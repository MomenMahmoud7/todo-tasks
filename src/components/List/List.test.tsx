import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import List from "./List";

vi.mock("../Input", () => ({
  default: ({ onSubmit }: { onSubmit: (text: string) => void }) => (
    <div data-testid="input-component">
      <button onClick={() => onSubmit("Test todo")}>Add Todo</button>
    </div>
  ),
}));

vi.mock("../Item", () => ({
  default: ({
    note,
    onComplete,
    onEdit,
    onDelete,
  }: {
    note: string;
    completed: boolean;
    onComplete: () => void;
    onEdit: (text: string) => void;
    onDelete: () => void;
  }) => (
    <div data-testid={`todo-item-${note}`}>
      <span>{note}</span>
      <button onClick={onComplete}>Toggle</button>
      <button onClick={() => onEdit("Updated " + note)}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe("List Component", () => {
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

  it("renders main components", () => {
    render(<List />);

    expect(screen.getByTestId("todo-app-title")).toBeInTheDocument();
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      /What.?s next\?/
    );
  });

  it("loads and saves todos from localStorage", () => {
    const mockTodos = JSON.stringify([
      { note: "Test todo", completed: false },
      { note: "Another todo", completed: true },
    ]);

    mockLocalStorage.getItem.mockReturnValue(mockTodos);

    render(<List />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("todos");
    expect(screen.getByText("Test todo")).toBeInTheDocument();
    expect(screen.getByText("Another todo")).toBeInTheDocument();
  });

  it("adds new todo and updates status", () => {
    render(<List />);

    const addButton = screen.getByText("Add Todo");
    fireEvent.click(addButton);

    expect(screen.getByText("Test todo")).toBeInTheDocument();
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      "0 of 1 completed"
    );
  });

  it("manages todo operations (complete, edit, delete)", () => {
    render(<List />);

    const addButton = screen.getByText("Add Todo");
    fireEvent.click(addButton);

    const toggleButton = screen.getByText("Toggle");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      "1 of 1 completed"
    );

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
    expect(screen.getByText("Updated Test todo")).toBeInTheDocument();

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Updated Test todo")).not.toBeInTheDocument();
  });

  it("saves todos to localStorage when todos change", async () => {
    render(<List />);

    const addButton = screen.getByText("Add Todo");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "todos",
        JSON.stringify([{ note: "Test todo", completed: false }])
      );
    });
  });

  it("clears completed todos", () => {
    const mockTodos = JSON.stringify([
      { note: "Todo 1", completed: true },
      { note: "Todo 2", completed: false },
      { note: "Todo 3", completed: true },
    ]);

    mockLocalStorage.getItem.mockReturnValue(mockTodos);

    render(<List />);

    const clearButton = screen.getByTestId("todo-clear-completed-button");
    fireEvent.click(clearButton);

    expect(screen.getByText("Todo 2")).toBeInTheDocument();
    expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Todo 3")).not.toBeInTheDocument();
  });

  it("handles localStorage errors gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid json");

    render(<List />);

    expect(screen.getByTestId("todo-status")).toHaveTextContent(
      /What.?s next\?/
    );
  });
});
