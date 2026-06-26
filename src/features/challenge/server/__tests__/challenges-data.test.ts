import { getDailyChallenge, getChallengeById } from "../challenges-data";
import { dbPool } from "../db";

jest.mock("../db", () => ({
  dbPool: {
    query: jest.fn(),
    on: jest.fn(),
  },
}));

describe("Daily Challenge Data & Rotation", () => {
  const mockChallenges = [
    {
      id: 42,
      title: "Filter active user accounts.",
      description: "Select the id, username, and email of all users who have logged in within the last 30 days.",
      category: "Filtering",
      difficulty: "Easy",
      database: "PostgreSQL",
      schema_table_name: "users",
      schema_columns: [
        { name: "id", type: "integer" },
        { name: "username", type: "varchar(100)" },
      ],
      initial_data: [
        { id: 1, username: "alice_jones" }
      ],
      schema_sql: "CREATE TABLE users...",
      seed_sql: "INSERT INTO users...",
      solution_sql: "SELECT id, username FROM users...",
      check_order: false
    },
    {
      id: 101,
      title: "Identify premium orders.",
      description: "Select the id, customer_id, and total_amount of all orders where the total_amount is greater than 150.00, ordered by total_amount in descending order.",
      category: "Filtering",
      difficulty: "Easy",
      database: "PostgreSQL",
      schema_table_name: "orders",
      schema_columns: [
        { name: "id", type: "integer" },
      ],
      initial_data: [],
      schema_sql: "CREATE TABLE orders...",
      seed_sql: "INSERT INTO orders...",
      solution_sql: "SELECT id FROM orders...",
      check_order: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a valid challenge definition", async () => {
    (dbPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockChallenges });

    const challenge = await getDailyChallenge();
    expect(challenge).toBeDefined();
    expect(challenge.id).toBe(mockChallenges[0].id);
    expect(challenge.title).toBe(mockChallenges[0].title);
    expect(challenge.description).toBe(mockChallenges[0].description);
    expect(challenge.schema.tables["users"]).toBeDefined();
    expect(challenge.schema.tables["users"].length).toBeGreaterThan(0);
    expect(challenge.initialData["users"]).toBeDefined();
    expect(challenge.schemaSql).toBeDefined();
    expect(challenge.seedSql).toBeDefined();
    expect(challenge.solutionSql).toBeDefined();
  });

  it("should rotate challenges predictably based on dates", async () => {
    const originalDate = global.Date;

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

      (dbPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockChallenges });
      const challenge1 = await getDailyChallenge();

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

      (dbPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockChallenges });
      const challenge2 = await getDailyChallenge();

      // Since the day changes, it should cycle to another challenge
      expect(challenge1.id).not.toEqual(challenge2.id);
    } finally {
      global.Date = originalDate;
    }
  });

  it("should return challenge by ID if it exists", async () => {
    (dbPool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockChallenges[0]] });

    const challenge = await getChallengeById(42);
    expect(challenge).toBeDefined();
    expect(challenge?.id).toBe(42);
    expect(dbPool.query).toHaveBeenCalledWith("SELECT * FROM challenges WHERE id = $1", [42]);
  });

  it("should return null if challenge by ID does not exist", async () => {
    (dbPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const challenge = await getChallengeById(999);
    expect(challenge).toBeNull();
    expect(dbPool.query).toHaveBeenCalledWith("SELECT * FROM challenges WHERE id = $1", [999]);
  });
});

