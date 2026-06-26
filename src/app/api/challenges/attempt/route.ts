import { NextRequest, NextResponse } from "next/server";
import { getChallengeById } from "@/features/challenge/server/challenges-data";
import { sanitizeSQL } from "@/features/challenge/server/sanitizer";
import { runInSandbox } from "@/features/challenge/server/runner";
import { compareResultSets } from "@/features/challenge/server/validator";
import { checkRateLimit } from "@/features/challenge/server/rate-limit";

export async function POST(req: NextRequest) {
  // 1. Rate limiting check
  const rateLimit = await checkRateLimit(req);
  if (!rateLimit.isAllowed) {
    const retryAfterSeconds = Math.ceil(rateLimit.resetMs / 1000);
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Too many attempts. Please wait ${retryAfterSeconds} second(s) before trying again.`,
        },
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { challengeId, query } = body;

    // 2. Basic validation
    if (challengeId === undefined || typeof challengeId !== "number") {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing or invalid 'challengeId'. It must be a number.",
          },
        },
        { status: 400 }
      );
    }

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Missing or invalid 'query'. It must be a non-empty string.",
          },
        },
        { status: 400 }
      );
    }

    if (query.length > 4096) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "The SQL query is too long. Maximum allowed is 4096 characters.",
          },
        },
        { status: 400 }
      );
    }

    // 2. Fetch challenge definition
    const challenge = await getChallengeById(challengeId);
    if (!challenge) {
      return NextResponse.json(
        {
          error: {
            code: "CHALLENGE_NOT_FOUND",
            message: `Challenge with ID ${challengeId} was not found.`,
          },
        },
        { status: 404 }
      );
    }

    // 3. Run security sanitizer
    const sanitization = sanitizeSQL(query);
    if (!sanitization.isValid) {
      return NextResponse.json({
        success: false,
        error: sanitization.error,
        executionTimeMs: 0,
        results: null,
        expectedResults: null,
      });
    }

    // 4. Run inside execution sandbox
    const sandboxOutcome = await runInSandbox(
      challenge.schemaSql,
      challenge.seedSql,
      query,
      challenge.solutionSql
    );

    if (sandboxOutcome.error) {
      return NextResponse.json({
        success: false,
        error: sandboxOutcome.error,
        executionTimeMs: sandboxOutcome.executionTimeMs,
        results: null,
        expectedResults: null,
      });
    }

    // 5. Compare result datasets
    if (sandboxOutcome.userResults && sandboxOutcome.solutionResults) {
      const comparison = compareResultSets(
        sandboxOutcome.userResults.rows,
        sandboxOutcome.solutionResults.rows,
        sandboxOutcome.userResults.fields,
        sandboxOutcome.solutionResults.fields,
        challenge.checkOrder
      );

      return NextResponse.json({
        success: comparison.success,
        reason: comparison.reason || null,
        error: comparison.message,
        expected: comparison.expected || null,
        received: comparison.received || null,
        executionTimeMs: sandboxOutcome.executionTimeMs,
        results: sandboxOutcome.userResults.rows,
        userFields: sandboxOutcome.userResults.fields,
        expectedResults: sandboxOutcome.solutionResults.rows,
        solutionFields: sandboxOutcome.solutionResults.fields,
      });
    }

    // Fallback if results are empty and no error was set
    return NextResponse.json({
      success: false,
      error: "Unable to retrieve query execution results.",
      executionTimeMs: sandboxOutcome.executionTimeMs,
      results: null,
      expectedResults: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "An unexpected error occurred during execution.",
        },
      },
      { status: 500 }
    );
  }
}
