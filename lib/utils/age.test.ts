import { describe, expect, it } from "vitest";
import { computeAge } from "./age";

describe("computeAge", () => {
  const today = new Date("2026-10-30T12:00:00Z");

  it("counts completed years", () => {
    expect(computeAge("1980-08-14", today)).toBe(46);
  });

  it("does not count the year before the birthday", () => {
    expect(computeAge("1980-11-02", today)).toBe(45);
  });

  it("accepts ISO timestamps", () => {
    expect(computeAge("2000-10-30T00:00:00.000Z", today)).toBe(26);
  });
});
