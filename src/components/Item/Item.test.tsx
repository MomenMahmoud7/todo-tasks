import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Item from "./Item";

describe("Item Component", () => {
  const mockOnComplete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it("renders todo item with note text", () => {
    render(
      <Item
        note="Test todo item"
        completed={false}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("todo-item-input")).toHaveValue("Test todo item");
  });

  it("calls onComplete when checkbox is clicked", () => {
    render(
      <Item
        note="Test todo"
        completed={false}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId("todo-complete-button");
    fireEvent.click(checkbox);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit when input value changes", () => {
    render(
      <Item
        note="Original text"
        completed={false}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByTestId("todo-item-input");
    fireEvent.change(input, { target: { value: "Updated text" } });

    expect(mockOnEdit).toHaveBeenCalledWith("Updated text");
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <Item
        note="Test todo"
        completed={false}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId("todo-delete-button");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("disables input when item is completed", () => {
    render(
      <Item
        note="Completed todo"
        completed={true}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByTestId("todo-item-input");
    expect(input).toBeDisabled();
  });

  it("enables input when item is not completed", () => {
    render(
      <Item
        note="Incomplete todo"
        completed={false}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByTestId("todo-item-input");
    expect(input).not.toBeDisabled();
  });
});
