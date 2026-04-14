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
    },
  ),
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("renders without crashing", () => {
    render(<HeroSection />);
  });

  it("displays the tagline badge", () => {
    render(<HeroSection />);
    expect(screen.getByText("30分で完成。コード不要。")).toBeInTheDocument();
  });

  it("displays the main heading", () => {
    render(<HeroSection />);
    expect(screen.getByText(/話すだけで、/)).toBeInTheDocument();
    expect(screen.getByText(/Webツールができる。/)).toBeInTheDocument();
  });

  it("displays the sub-text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("「何を作るか」はAIと一緒に考えよう"),
    ).toBeInTheDocument();
  });

  it("renders a CTA link to /create", () => {
    render(<HeroSection />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/create");
  });

  it("displays the CTA button text", () => {
    render(<HeroSection />);
    expect(screen.getByText("作ってみる")).toBeInTheDocument();
  });
});
