import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";
import rw from "./rw.json";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("translations", () => {
  const englishKeys = flattenKeys(en).sort();

  it.each([
    ["fr", fr],
    ["rw", rw],
  ])("%s has exactly the same keys as en", (_locale, messages) => {
    expect(flattenKeys(messages).sort()).toEqual(englishKeys);
  });
});
