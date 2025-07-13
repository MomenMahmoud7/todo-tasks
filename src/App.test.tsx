import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./components/List", () => ({
  default: () => <div data-testid="list-component">List Component</div>,
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("renders the main app container and List component", () => {
    render(<App />);

    expect(screen.getByTestId("todo-app")).toBeInTheDocument();
    expect(screen.getByTestId("list-component")).toBeInTheDocument();
  });
});
