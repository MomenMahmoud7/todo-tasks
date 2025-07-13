import { useMemo, useState, type ChangeEvent, type FC } from "react";
import type { InputPropsT } from "./Input.type";
import { Plus } from "lucide-react";

const Input: FC<InputPropsT> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const trimmedText = useMemo(() => text.trim(), [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(trimmedText);
    setText("");
  };

  return (
    <form
      onSubmit={trimmedText ? handleSubmit : undefined}
      className="flex items-center px-6 py-6 gap-3 rounded-2xl bg-white shadow-lg"
      data-testid="todo-input-form"
    >
      <input
        type="text"
        value={text}
        autoFocus
        onChange={onChange}
        placeholder="What needs to be done?"
        className="grow px-4 py-3 rounded-xl text-gray-700 bg-gray-50 border-2 border-transparent focus:border-purple-300 focus:bg-white focus:outline-none transition-all duration-300"
        data-testid="todo-input-field"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 hover:from-purple-500 hover:to-purple-800 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
        data-testid="todo-submit-button"
      >
        <Plus size={16} />
      </button>
    </form>
  );
};

export default Input;
