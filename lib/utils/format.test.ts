import { describe, expect, it } from "vitest";
import { initialsOf } from "./format";

describe("initialsOf", () => {
  it("ignores titles and uses first and last names", () => {
    expect(initialsOf("Dr. Claire Mutoni")).toBe("CM");
    expect(initialsOf("Jean Pierre Ndayisaba")).toBe("JN");
  });

  it("handles a single name", () => {
    expect(initialsOf("Aline")).toBe("A");
  });
});
