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

import { ProjectList } from "./project-list";

const mockProjects = [
  {
    id: "p1",
    title: "カウントダウンタイマー",
    status: "published",
    published_slug: "countdown-abc",
    template_id: "countdown",
    created_at: "2026-04-10T12:00:00Z",
  },
  {
    id: "p2",
    title: "プロフィールサイト",
    status: "draft",
    published_slug: null,
    template_id: "profile",
    created_at: "2026-04-08T09:30:00Z",
  },
];

describe("ProjectList", () => {
  it("プロジェクト一覧を表示する", () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText("カウントダウンタイマー")).toBeInTheDocument();
    expect(screen.getByText("プロフィールサイト")).toBeInTheDocument();
  });

  it("ページタイトルと新規作成ボタンを表示する", () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText("プロジェクト")).toBeInTheDocument();
    const createLinks = screen.getAllByRole("link", { name: /新しくつくる/ });
    expect(createLinks[0]).toHaveAttribute("href", "/create");
  });

  it("公開済みプロジェクトに公開バッジを表示する", () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText("公開中")).toBeInTheDocument();
    expect(screen.getByText("下書き")).toBeInTheDocument();
  });

  it("日付を日本語フォーマットで表示する", () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText("4月10日")).toBeInTheDocument();
    expect(screen.getByText("4月8日")).toBeInTheDocument();
  });

  it("公開スラッグがあればリンクを表示する", () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText("/s/countdown-abc")).toBeInTheDocument();
  });

  it("プロジェクトカードがプレビューページへリンクする", () => {
    render(<ProjectList projects={mockProjects} />);

    const card = screen.getByTestId("project-card-p1");
    expect(card).toHaveAttribute("href", "/preview?template=countdown");
  });

  it("プロジェクトがない場合は空状態を表示する", () => {
    render(<ProjectList projects={[]} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("まだプロジェクトがないよ")).toBeInTheDocument();
    expect(screen.getByText("最初のサイトをつくってみよう")).toBeInTheDocument();
  });

  it("空状態でも新規作成ボタンを表示する", () => {
    render(<ProjectList projects={[]} />);

    const links = screen.getAllByRole("link", { name: /新しくつくる/ });
    expect(links.length).toBeGreaterThanOrEqual(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/create");
    });
  });

  it("レスポンシブグリッドのクラスが適用されている", () => {
    render(<ProjectList projects={mockProjects} />);

    const grid = screen.getByTestId("project-grid");
    expect(grid.className).toContain("sm:grid-cols-2");
  });
});
