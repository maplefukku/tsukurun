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

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

import { Header } from "./header";

describe("Header", () => {
  it("renders without crashing", () => {
    render(<Header />);
  });

  it("displays the brand name", () => {
    render(<Header />);
    expect(screen.getByText("つくるん")).toBeInTheDocument();
  });

  it("displays the login button", () => {
    render(<Header />);
    expect(screen.getByText("ログイン")).toBeInTheDocument();
  });

  it("has a link to the home page", () => {
    render(<Header />);
    const link = screen.getByText("つくるん").closest("a");
    expect(link).toHaveAttribute("href", "/");
  });
});
