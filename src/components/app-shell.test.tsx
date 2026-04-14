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

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders without crashing", () => {
    render(
      <AppShell>
        <div>test content</div>
      </AppShell>
    );
  });

  it("renders children", () => {
    render(
      <AppShell>
        <div>child element</div>
      </AppShell>
    );
    expect(screen.getByText("child element")).toBeInTheDocument();
  });

  it("renders the Header", () => {
    render(
      <AppShell>
        <div>content</div>
      </AppShell>
    );
    expect(screen.getByText("つくるん")).toBeInTheDocument();
  });
});
