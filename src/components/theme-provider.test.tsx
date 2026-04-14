import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: any) => children,
}));

import { ThemeProvider } from "./theme-provider";

describe("ThemeProvider", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <div>test</div>
      </ThemeProvider>
    );
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div>child content</div>
      </ThemeProvider>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
