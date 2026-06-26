import { getDailyChallenge, CHALLENGES } from "../challenges-data";

describe("Daily Challenge Data & Rotation", () => {
  it("should return a valid challenge definition", () => {
    const challenge = getDailyChallenge();
    expect(challenge).toBeDefined();
    expect(CHALLENGES[challenge.id]).toBeDefined();
    expect(challenge.title).toBeDefined();
    expect(challenge.description).toBeDefined();
    expect(challenge.schema.tableName).toBeDefined();
    expect(challenge.schema.columns.length).toBeGreaterThan(0);
    expect(challenge.initialData.length).toBeGreaterThan(0);
    expect(challenge.schemaSql).toBeDefined();
    expect(challenge.seedSql).toBeDefined();
    expect(challenge.solutionSql).toBeDefined();
  });

  it("should rotate challenges predictably based on dates", () => {
    const originalDate = global.Date;
    const challengeCount = Object.keys(CHALLENGES).length;

    try {
      // Mock Date to Day 10 of the year (Jan 11)
      const mockDateDay10 = new Date("2026-01-11T12:00:00Z");
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          super();
          if (args.length > 0) {
            return new originalDate(...(args as [any]));
          }
          return mockDateDay10;
        }
      } as any;

      const challenge1 = getDailyChallenge();

      // Mock Date to Day 11 of the year (Jan 12)
      const mockDateDay11 = new Date("2026-01-12T12:00:00Z");
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          super();
          if (args.length > 0) {
            return new originalDate(...(args as [any]));
          }
          return mockDateDay11;
        }
      } as any;

      const challenge2 = getDailyChallenge();

      // Since the day changes, it should cycle to another challenge if challengeCount > 1
      if (challengeCount > 1) {
        expect(challenge1.id).not.toEqual(challenge2.id);
      }
    } finally {
      global.Date = originalDate;
    }
  });
});
