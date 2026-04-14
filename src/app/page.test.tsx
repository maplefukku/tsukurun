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

vi.mock("./hero-section", () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock("./examples-section", () => ({
  ExamplesSection: () => <div data-testid="examples-section" />,
}));

vi.mock("@/components/header", () => ({
  Header: () => <header data-testid="header" />,
}));

import LandingPage from "./page";

describe("LandingPage", () => {
  it("renders without crashing", () => {
    render(<LandingPage />);
  });

  it("renders the Header component", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders the HeroSection component", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  it("renders the ExamplesSection component", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("examples-section")).toBeInTheDocument();
  });

  it("renders the footer text", () => {
    render(<LandingPage />);
    expect(screen.getByText("30分で完成。コード不要。")).toBeInTheDocument();
  });
});
