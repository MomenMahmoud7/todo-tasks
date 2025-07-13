import type { ChangeEvent, FC } from "react";
import type { ItemPropsT } from "./Item.type";
import { Check, Trash2 } from "lucide-react";

const Item: FC<ItemPropsT> = ({
  completed,
  note,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onEdit(e.target.value);
  };

  return (
    <div
      className={`group flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
        completed ? "bg-gray-50" : "bg-white"
      }`}
      data-testid="todo-item"
    >
      <button
        onClick={onComplete}
        className={`flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br text-white transition-all duration-300 ${
          completed
            ? "from-purple-400 to-purple-700"
            : "from-gray-100 to-gray-200 hover:from-purple-100 hover:to-purple-200"
        }`}
        data-testid="todo-complete-button"
      >
        <Check
          size={16}
          className={`${completed ? "opacity-100" : "opacity-0"}`}
        />
      </button>

      <input
        type="text"
        value={note}
        onChange={onChange}
        disabled={completed}
        className={`w-full px-4 py-2 bg-gray-50 rounded-lg border-2 border-transparent focus:border-purple-300 focus:bg-white focus:outline-none transition-all duration-300 pr-14 ${
          completed ? "line-through text-gray-400" : "text-gray-900"
        }`}
        data-testid="todo-item-input"
      />

      <button
        onClick={onDelete}
        className="flex-shrink-0 w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        data-testid="todo-delete-button"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default Item;
