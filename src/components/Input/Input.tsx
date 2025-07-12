import { useState, type ChangeEvent, type FC } from "react";
import type { InputPropsT } from "./Input.type";
import { Plus } from "lucide-react";

const Input: FC<InputPropsT> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(!e.target.value.trim() ? e.target.value.trim() : e.target.value);
  };

  const onClick = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <form
      onSubmit={onClick}
      className="flex items-center px-6 py-6 gap-3 rounded-xl bg-white"
    >
      <input
        type="text"
        value={text}
        autoFocus
        onChange={onChange}
        placeholder="What needs to be done?"
        className="grow p-4 rounded-md text-gray-700 bg-violet-50 border-2 border-transparent focus:border-purple-300 focus:bg-white focus:outline-none transition-all duration-200"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-12 h-12 rounded-md bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <Plus size={20} />
      </button>
    </form>
  );
};

export default Input;
