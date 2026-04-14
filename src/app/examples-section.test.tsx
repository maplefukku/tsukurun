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
  useInView: () => true,
}));

import { ExamplesSection } from "./examples-section";

describe("ExamplesSection", () => {
  it("renders without crashing", () => {
    render(<ExamplesSection />);
  });

  it("displays the section heading", () => {
    render(<ExamplesSection />);
    expect(screen.getByText("みんなが作ったもの")).toBeInTheDocument();
  });

  it("renders all template cards", () => {
    render(<ExamplesSection />);
    expect(screen.getByText("メニューボード")).toBeInTheDocument();
    expect(screen.getByText("やることリスト")).toBeInTheDocument();
    expect(screen.getByText("カウントダウン")).toBeInTheDocument();
    expect(screen.getByText("投票アンケート")).toBeInTheDocument();
    expect(screen.getByText("プロフィールカード")).toBeInTheDocument();
    expect(screen.getByText("割り勘カリキュレーター")).toBeInTheDocument();
    expect(screen.getByText("読書メモ")).toBeInTheDocument();
  });

  it("renders template descriptions", () => {
    render(<ExamplesSection />);
    expect(
      screen.getByText("お店のメニューをおしゃれに表示"),
    ).toBeInTheDocument();
    expect(screen.getByText("タスクをサクサク管理")).toBeInTheDocument();
  });

  it("renders emoji role images with aria-labels", () => {
    render(<ExamplesSection />);
    const emojiImages = screen.getAllByRole("img");
    expect(emojiImages.length).toBe(7);
    expect(emojiImages[0]).toHaveAttribute("aria-label", "メニューボード");
  });
});
