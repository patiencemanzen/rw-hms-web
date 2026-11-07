import { describe, expect, it } from "vitest";
import { formatNationalId, formatPhone, maskNationalId, maskPhone } from "./mask";

describe("maskNationalId", () => {
  it("hides the middle digits", () => {
    expect(maskNationalId("1198580012345012")).toBe("1 1985 8 *** *** ** 12");
  });

  it("fully masks malformed values", () => {
    expect(maskNationalId("123")).toBe("***");
  });

  it("formats the full ID into groups", () => {
    expect(formatNationalId("1198580012345012")).toBe("1 1985 8 0012345 0 12");
  });
});

describe("maskPhone", () => {
  it.each(["+250788123456", "0788123456", "788123456"])("masks %s", (phone) => {
    expect(maskPhone(phone)).toBe("+250 788 *** 456");
  });

  it("formats full numbers", () => {
    expect(formatPhone("+250788123456")).toBe("+250 788 123 456");
  });
});
