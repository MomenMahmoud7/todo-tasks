import { useEffect, useMemo, useState } from "react";
import Item from "../Item";
import Input from "../Input";

function List() {
  const [todos, setTodos] = useState<{ note: string; completed: boolean }[]>(
    () => {
      const cache = localStorage.getItem("todos") || "[]";
      const cachedTodos = JSON.parse(cache);
      return cachedTodos;
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
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-violet-50 mb-2">
            To-Do Tasks
          </h1>
          <p className="text-violet-300 text-lg">
            {totalCount === 0
              ? "What’s next?"
              : `${completedCount} of ${totalCount} completed`}
          </p>
        </div>
        <Input onSubmit={addToList} />
        <div className="flex flex-col gap-2">
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

        <div className="p-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-md text-violet-300">
            <span>{totalCount - completedCount} remaining</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-violet-100 hover:text-violet-50 transition-colors duration-200"
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
