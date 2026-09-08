import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database and notification functions
vi.mock("./db", () => ({
  createRegistration: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./_core/email", () => ({
  sendOwnerEmail: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("registrations.submit", () => {
  it("successfully submits a registration with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.registrations.submit({
      name: "John Doe",
      email: "john@example.com",
      role: "student",
    });

    expect(result).toEqual({
      success: true,
      message: "Registration successful! We'll be in touch soon.",
    });
  });

  it("rejects registration with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.registrations.submit({
        name: "John Doe",
        email: "invalid-email",
        role: "student",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Valid email is required");
    }
  });

  it("rejects registration with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.registrations.submit({
        name: "",
        email: "john@example.com",
        role: "student",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Name is required");
    }
  });

  it("rejects registration with invalid role", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.registrations.submit({
        name: "John Doe",
        email: "john@example.com",
        role: "invalid-role",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Please select a valid role");
    }
  });

  it("accepts all valid roles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const roles = ["student", "parent", "teacher"] as const;

    for (const role of roles) {
      const result = await caller.registrations.submit({
        name: "Test User",
        email: `test-${role}@example.com`,
        role,
      });

      expect(result.success).toBe(true);
    }
  });
});
