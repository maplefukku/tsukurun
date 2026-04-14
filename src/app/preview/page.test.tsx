import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

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
  AnimatePresence: ({ children, mode, ...rest }: any) => children,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/preview",
}));

vi.mock("@/components/header", () => ({
  Header: () => <header data-testid="header" />,
}));

import PreviewPage from "./page";

describe("PreviewPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    render(<PreviewPage />);
  });

  it("renders the Header", () => {
    render(<PreviewPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("shows the first loading step initially", () => {
    render(<PreviewPage />);
    expect(screen.getByText("アイデアを整理してるよ...")).toBeInTheDocument();
  });

  it("advances through loading steps on interval", () => {
    render(<PreviewPage />);
    expect(screen.getByText("アイデアを整理してるよ...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("デザインを考え中...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("コードを書いてるよ...")).toBeInTheDocument();
  });

  it("shows preview content after loading completes", () => {
    render(<PreviewPage />);

    // Interval fires at 1500 (0->1), 3000 (1->2), 4500 (2->3), 6000 (3>=3: clearInterval + setTimeout(800))
    // setTimeout fires at 6800ms total
    act(() => { vi.advanceTimersByTime(1500); }); // step 0 -> 1
    act(() => { vi.advanceTimersByTime(1500); }); // step 1 -> 2
    act(() => { vi.advanceTimersByTime(1500); }); // step 2 -> 3
    act(() => { vi.advanceTimersByTime(1500); }); // step 3 >= 3: clearInterval, setTimeout(800)
    act(() => { vi.advanceTimersByTime(1000); }); // flush the 800ms timeout

    expect(screen.getByText("友達にシェアする")).toBeInTheDocument();
    expect(screen.getByText("もう少し変えたい")).toBeInTheDocument();
  });

  it("shows share and edit links after loading", () => {
    render(<PreviewPage />);

    act(() => { vi.advanceTimersByTime(1500); });
    act(() => { vi.advanceTimersByTime(1500); });
    act(() => { vi.advanceTimersByTime(1500); });
    act(() => { vi.advanceTimersByTime(1500); });
    act(() => { vi.advanceTimersByTime(1000); });

    const shareLink = screen.getByText("友達にシェアする").closest("a");
    expect(shareLink).toHaveAttribute("href", "/share");

    const editLink = screen.getByText("もう少し変えたい").closest("a");
    expect(editLink).toHaveAttribute("href", "/create");
  });
});
