import { useEffect, useMemo, useState } from "react";
import Item from "../Item";
import Input from "../Input";

function List() {
  const [todos, setTodos] = useState<{ note: string; completed: boolean }[]>(
    () => {
      const cache = localStorage.getItem("todos") || "[]";
      try {
        const cachedTodos = JSON.parse(cache);
        return Array.isArray(cachedTodos) ? cachedTodos : [];
      } catch {
        return [];
      }
    }
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const { completedCount, totalCount } = useMemo(
    () => ({
      completedCount: todos.filter((todo) => todo.completed).length,
      totalCount: todos.length,
    }),
    [todos]
  );

  const addToList = (note: string) => {
    setTodos((todos) => [...todos, { note, completed: false }]);
  };

  const deleteFromList = (currIndex: number) => () => {
    setTodos((todos) => todos.filter((_, i) => i !== currIndex));
  };

  const togglecompleted = (currIndex: number) => () => {
    setTodos((todos) =>
      todos.map((item, i) =>
        i === currIndex ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const editNote = (currIndex: number) => (note: string) => {
    setTodos((todos) =>
      todos.map((item, i) =>
        i === currIndex ? { note, completed: false } : item
      )
    );
  };

  const clearCompleted = () => {
    setTodos((todos) => todos.filter((todo) => !todo.completed));
  };

  return (
    <div className="w-full max-w-md" data-testid="todo-list">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1
            className="text-4xl font-black text-purple-900"
            data-testid="todo-app-title"
          >
            To-Do Tasks
          </h1>
          <p className="text-gray-500 text-md" data-testid="todo-status">
            {totalCount === 0
              ? "What's next?"
              : `${completedCount} of ${totalCount} completed`}
          </p>
        </div>
        <Input onSubmit={addToList} />
        <div className="flex flex-col gap-4" data-testid="todo-items-container">
          {todos.map(({ note, completed }, i) => (
            <Item
              key={i}
              completed={completed}
              note={note}
              onEdit={editNote(i)}
              onDelete={deleteFromList(i)}
              onComplete={togglecompleted(i)}
            />
          ))}
        </div>

        <div className="p-2 border-t border-gray-300" data-testid="todo-footer">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span data-testid="todo-remaining-count">
              {totalCount - completedCount} of {totalCount} remaining
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-purple-900 hover:text-purple-700 font-medium transition-colors duration-300"
                data-testid="todo-clear-completed-button"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
