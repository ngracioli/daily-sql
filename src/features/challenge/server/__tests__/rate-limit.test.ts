import { NextRequest } from "next/server";
import { checkRateLimit } from "../rate-limit";

describe("Rate Limiter Utility", () => {
  it("should allow requests up to the threshold and then block", async () => {
    const ip = "192.168.1.100";

    // Make 10 requests (all should be allowed)
    for (let i = 0; i < 10; i++) {
      const req = new NextRequest("http://localhost/api/challenges/attempt", {
        headers: { "x-real-ip": ip },
      });
      const result = await checkRateLimit(req);
      expect(result.isAllowed).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(10 - (i + 1));
    }

    // The 11th request should be blocked
    const blockedReq = new NextRequest("http://localhost/api/challenges/attempt", {
      headers: { "x-real-ip": ip },
    });
    const blockedResult = await checkRateLimit(blockedReq);
    expect(blockedResult.isAllowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.resetMs).toBeGreaterThan(0);
  });

  it("should isolate rate limits between different IPs", async () => {
    const ip1 = "10.0.0.1";
    const ip2 = "10.0.0.2";

    // Rate limit ip1 completely
    for (let i = 0; i < 10; i++) {
      const req = new NextRequest("http://localhost/api/challenges/attempt", {
        headers: { "x-real-ip": ip1 },
      });
      await checkRateLimit(req);
    }

    // ip1 is blocked
    const req1 = new NextRequest("http://localhost/api/challenges/attempt", {
      headers: { "x-real-ip": ip1 },
    });
    expect((await checkRateLimit(req1)).isAllowed).toBe(false);

    // ip2 should still be allowed since rate limit is isolated by IP
    const req2 = new NextRequest("http://localhost/api/challenges/attempt", {
      headers: { "x-real-ip": ip2 },
    });
    const result2 = await checkRateLimit(req2);
    expect(result2.isAllowed).toBe(true);
    expect(result2.remaining).toBe(9);
  });
});
