import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title, description and action", () => {
    render(
      <EmptyState
        title="No patients found"
        description="Try another search."
        action={<button type="button">Register patient</button>}
      />,
    );

    expect(screen.getByRole("heading", { name: "No patients found" })).toBeInTheDocument();
    expect(screen.getByText("Try another search.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register patient" })).toBeInTheDocument();
  });
});
