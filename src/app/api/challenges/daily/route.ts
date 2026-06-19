import { NextResponse } from "next/server";
import { getDailyChallenge } from "@/features/challenge/server/challenges-data";

export async function GET() {
  try {
    const challenge = getDailyChallenge();
    
    // Explicitly return only necessary user-facing fields to prevent cheating
    const userFacingChallenge = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      database: challenge.database,
      schema: challenge.schema,
      initialData: challenge.initialData,
    };

    return NextResponse.json(userFacingChallenge, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to retrieve daily challenge.",
        },
      },
      { status: 500 }
    );
  }
}
