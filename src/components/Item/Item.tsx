import type { ChangeEvent, FC } from "react";
import type { ItemPropsT } from "./Item.type";
import { Check, X } from "lucide-react";

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
      className={`group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-lg ${
        completed
          ? "bg-violet-100 border-2 border-violet-100"
          : "bg-white border-2 border-gray-100 hover:border-violet-300"
      }`}
    >
      <button
        onClick={onComplete}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
          completed
            ? "bg-violet-500 border-violet-500 text-white"
            : "border-gray-300 hover:border-violet-400"
        }`}
      >
        {completed && <Check size={14} />}
      </button>

      <input
        type="text"
        value={note}
        onChange={onChange}
        disabled={completed}
        className={`w-full px-4 py-2 text-gray-700 bg-violet-100 rounded-md border-2 border-transparent focus:border-purple-300 focus:bg-white focus:outline-none transition-all duration-200 pr-14 ${
          completed ? "line-through text-gray-400" : ""
        }`}
      />

      <button
        onClick={onDelete}
        className="flex-shrink-0 w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-200 rounded-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Item;
