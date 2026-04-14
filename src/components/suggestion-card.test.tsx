import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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

import { SuggestionCard } from "./suggestion-card";
import type { Suggestion } from "@/lib/types";

describe("SuggestionCard", () => {
  const suggestion: Suggestion = {
    id: "1",
    title: "テストタイトル",
    description: "テスト説明文",
  };

  const onSelect = vi.fn();

  it("renders without crashing", () => {
    render(<SuggestionCard suggestion={suggestion} onSelect={onSelect} />);
  });

  it("displays the suggestion title", () => {
    render(<SuggestionCard suggestion={suggestion} onSelect={onSelect} />);
    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
  });

  it("displays the suggestion description", () => {
    render(<SuggestionCard suggestion={suggestion} onSelect={onSelect} />);
    expect(screen.getByText("テスト説明文")).toBeInTheDocument();
  });

  it("displays the action button", () => {
    render(<SuggestionCard suggestion={suggestion} onSelect={onSelect} />);
    expect(screen.getByText("これにする！")).toBeInTheDocument();
  });

  it("calls onSelect with the suggestion when button is clicked", () => {
    render(<SuggestionCard suggestion={suggestion} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("これにする！"));
    expect(onSelect).toHaveBeenCalledWith(suggestion);
  });
});
