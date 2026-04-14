import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

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
import { templates } from "@/lib/templates/registry";

describe("ExamplesSection", () => {
  it("renders without crashing", () => {
    render(<ExamplesSection />);
  });

  it("displays the section heading", () => {
    render(<ExamplesSection />);
    expect(screen.getByText("テンプレートから作る")).toBeInTheDocument();
  });

  it("renders all template cards from registry", () => {
    render(<ExamplesSection />);
    for (const t of templates) {
      expect(screen.getByText(t.name)).toBeInTheDocument();
    }
  });

  it("renders template descriptions", () => {
    render(<ExamplesSection />);
    expect(
      screen.getByText(templates[0].description),
    ).toBeInTheDocument();
  });

  it("renders emoji role images with aria-labels", () => {
    render(<ExamplesSection />);
    const emojiImages = screen.getAllByRole("img");
    expect(emojiImages.length).toBe(templates.length);
    expect(emojiImages[0]).toHaveAttribute("aria-label", templates[0].name);
  });
});
