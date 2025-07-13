import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Input from "./Input";

describe("Input Component", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders input field and submit button", () => {
    render(<Input onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId("todo-input-field")).toBeInTheDocument();
    expect(screen.getByTestId("todo-submit-button")).toBeInTheDocument();
  });

  it("submits todo and clears input", () => {
    render(<Input onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("todo-input-field");
    const form = screen.getByTestId("todo-input-form");

    fireEvent.change(input, { target: { value: "New todo" } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith("New todo");
    expect(input).toHaveValue("");
  });

  it("trims whitespace from input value", () => {
    render(<Input onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("todo-input-field");
    const form = screen.getByTestId("todo-input-form");

    fireEvent.change(input, { target: { value: "  test todo  " } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith("test todo");
  });

  it("does not submit empty or whitespace-only input", () => {
    render(<Input onSubmit={mockOnSubmit} />);

    const form = screen.getByTestId("todo-input-form");

    fireEvent.submit(form);
    expect(mockOnSubmit).not.toHaveBeenCalled();

    const input = screen.getByTestId("todo-input-field");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(form);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
