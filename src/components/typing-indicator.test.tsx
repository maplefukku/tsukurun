import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        return React.forwardRef((props: any, ref: any) => {
          const {
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileTap,
            ...rest
          } = props;
          return React.createElement(prop as string, { ...rest, ref });
        });
      },
    }
  ),
  AnimatePresence: ({ children }: any) => children,
}));

import { TypingIndicator } from "./typing-indicator";

describe("TypingIndicator", () => {
  it("renders without crashing", () => {
    render(<TypingIndicator />);
  });

  it("has a status role for accessibility", () => {
    render(<TypingIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has the correct aria-label", () => {
    render(<TypingIndicator />);
    expect(screen.getByLabelText("入力中")).toBeInTheDocument();
  });

  it("renders three dots", () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll("span");
    expect(dots.length).toBe(3);
  });
});
