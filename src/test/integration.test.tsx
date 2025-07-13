import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Todo App Integration Tests", () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    vi.clearAllMocks();

    mockLocalStorage.getItem.mockReturnValue("[]");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("allows user to add, edit, complete, and delete todos", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByTestId("todo-input-field");
    const submitButton = screen.getByTestId("todo-submit-button");

    await user.type(input, "Buy groceries");
    await user.click(submitButton);

    expect(screen.getByTestId("todo-item-input")).toHaveValue("Buy groceries");
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      "0 of 1 completed"
    );

    const todoInput = screen.getByTestId("todo-item-input");
    await user.clear(todoInput);
    await user.type(todoInput, "Buy organic groceries");

    expect(screen.getByTestId("todo-item-input")).toHaveValue(
      "Buy organic groceries"
    );

    const checkbox = screen.getByTestId("todo-complete-button");
    await user.click(checkbox);

    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      /1 of 1 completed/
    );

    const todoContainer = screen.getByTestId("todo-item");
    fireEvent.mouseEnter(todoContainer);

    const deleteButton = screen.getByTestId("todo-delete-button");
    await user.click(deleteButton);

    expect(screen.queryByTestId("todo-item-input")).not.toBeInTheDocument();
  });

  it("persists todos in localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByTestId("todo-input-field");
    const submitButton = screen.getByTestId("todo-submit-button");

    await user.type(input, "Buy groceries");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "todos",
        JSON.stringify([{ note: "Buy groceries", completed: false }])
      );
    });
  });

  it("loads todos from localStorage on app start", () => {
    const mockTodos = JSON.stringify([
      { note: "Buy groceries", completed: false },
      { note: "Walk the dog", completed: true },
    ]);

    mockLocalStorage.getItem.mockReturnValue(mockTodos);

    render(<App />);

    const todoInputs = screen.getAllByTestId("todo-item-input");
    expect(todoInputs[0]).toHaveValue("Buy groceries");
    expect(todoInputs[1]).toHaveValue("Walk the dog");
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      "1 of 2 completed"
    );
  });

  it("manages multiple todos and clears completed ones", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByTestId("todo-input-field");
    const submitButton = screen.getByTestId("todo-submit-button");

    await user.type(input, "Buy groceries");
    await user.click(submitButton);

    await user.clear(input);
    await user.type(input, "Walk the dog");
    await user.click(submitButton);

    const checkboxes = screen.getAllByTestId("todo-complete-button");
    await user.click(checkboxes[0]);

    expect(screen.getByTestId("todo-remaining-count")).toHaveTextContent(
      "1 of 2 remaining"
    );

    const clearButton = screen.getByTestId("todo-clear-completed-button");
    await user.click(clearButton);

    expect(screen.queryByTestId("todo-item-input")).not.toHaveValue(
      "Buy groceries"
    );
    expect(screen.getByTestId("todo-item-input")).toHaveValue("Walk the dog");
  });

  it("prevents adding empty or whitespace-only todos", async () => {
    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByTestId("todo-submit-button");

    await user.click(submitButton);
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      /What.?s next\?/
    );

    const input = screen.getByTestId("todo-input-field");
    await user.type(input, "   ");
    await user.click(submitButton);
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      /What.?s next\?/
    );
  });
});
