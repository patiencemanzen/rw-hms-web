import { describe, expect, it } from "vitest";
import {
  loginSchema,
  meetsPasswordPolicy,
  PASSWORD_RULES,
  resetPasswordSchema,
  safeNextPath,
} from "./auth";

describe("password policy", () => {
  it("matches the API rules", () => {
    expect(meetsPasswordPolicy("ChangeMe!Dev2026")).toBe(true);
    expect(PASSWORD_RULES.minLength("Short1!")).toBe(false);
    expect(PASSWORD_RULES.uppercase("lowercase123!")).toBe(false);
    expect(PASSWORD_RULES.number("NoDigitsHere!")).toBe(false);
    expect(PASSWORD_RULES.special("NoSpecial1234")).toBe(false);
    expect(PASSWORD_RULES.special("Has Spaces 1234")).toBe(false);
  });
});

describe("loginSchema", () => {
  it("trims the email and requires a password", () => {
    expect(loginSchema.parse({ email: " a@b.rw ", password: "x" }).email).toBe("a@b.rw");
    const result = loginSchema.safeParse({ email: "nope", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message).sort()).toEqual([
      "invalidEmail",
      "passwordRequired",
    ]);
  });
});

describe("resetPasswordSchema", () => {
  it("rejects weak and mismatched passwords", () => {
    const weak = resetPasswordSchema.safeParse({ password: "weak", confirmPassword: "weak" });
    expect(weak.error?.issues[0].message).toBe("weakPassword");

    const mismatch = resetPasswordSchema.safeParse({
      password: "ChangeMe!Dev2026",
      confirmPassword: "ChangeMe!Dev2027",
    });
    expect(mismatch.error?.issues[0]).toMatchObject({
      path: ["confirmPassword"],
      message: "passwordMismatch",
    });
  });
});

describe("safeNextPath", () => {
  it.each([
    [null, "/dashboard"],
    ["/patients", "/patients"],
    ["https://evil.example", "/dashboard"],
    ["//evil.example", "/dashboard"],
    ["/\\evil.example", "/dashboard"],
    ["/login", "/dashboard"],
  ])("%s -> %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });
});
