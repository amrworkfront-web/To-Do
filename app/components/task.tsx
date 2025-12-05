import { DialogDemo } from "./updateDialogf";
import {Todo} from '../type' 

export default function Task({
  title,
  completed,
  id,
  description,
  onDelete,
  onUpdate,
}: Todo & {
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onUpdate(id)}
        />
        <span className={completed ? "line-through text-gray-400" : ""}>
          {title}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          className="text-red-500 hover:text-white hover:cursor-pointer hover:bg-red-900 px-4 py-2 rounded-2xl transition-all duration-200"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
        <div className="hover:bg-blue-600 rounded-xl transition-all duration-200">
          <DialogDemo id={id} title={title} description={description}></DialogDemo>
        </div>{" "}
      </div>
    </div>
  );
}
