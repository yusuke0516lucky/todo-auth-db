import type { Todo } from "@/types/todo";
import { SUPPORT_TEXT_STYLE } from "./TodoInput";
interface TodoItemProps {
  todo: Todo;
  editTitle: string;
  isCurrentItemEditing: boolean; //自分自身が編集中かどうか
  isAnotherItemEditing: boolean; //他のitemが編集中かどうか
  isUpdating: boolean; //更新中かどうか(2重送信防止)
  isSaveDisabled: boolean;
  showTooLongSaveTitleMessage: boolean; //文字数制限時に出力する補助文用
  showEmptyEditTitleMessage: boolean; //0文字以下の時に出力する補助分用
  onEditTitleChange: (value: string) => void;
  onCancelEdit: () => void;
  onToggleComplete: (checked: boolean) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}

export default function TodoItem({
  todo,
  editTitle,
  isCurrentItemEditing,
  isAnotherItemEditing,
  isUpdating,
  isSaveDisabled,
  showTooLongSaveTitleMessage,
  showEmptyEditTitleMessage,
  onEditTitleChange,
  onCancelEdit,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: TodoItemProps) {
  return (
    <li>
      {isCurrentItemEditing ? (
        <div className="flex flex-col gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 shadow-sm">
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-md px-2 py-1 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              type="text"
              value={editTitle}
              disabled={isUpdating}
              onChange={(e) => onEditTitleChange(e.target.value)}
            />
            <button
              disabled={isUpdating || isSaveDisabled}
              onClick={onSaveEdit}
              className="px-3 py-1 rounded-md border border-blue-600 text-white bg-blue-600 text-sm hover:bg-blue-700 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              保存
            </button>
            <button
              disabled={isUpdating}
              onClick={onCancelEdit}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400  disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
          </div>
          <div>
            {showTooLongSaveTitleMessage && (
              <p className={SUPPORT_TEXT_STYLE}>
                ※30文字以内で入力してください
              </p>
            )}
            {showEmptyEditTitleMessage && (
              <p className={SUPPORT_TEXT_STYLE}>
                ※1文字以上入力すると保存できます
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-3">
          <input
            type="checkbox"
            disabled={isAnotherItemEditing || isUpdating}
            checked={todo.completed}
            onChange={(e) => onToggleComplete(e.target.checked)}
          />
          <span className={todo.completed ? "line-through text-gray-400" : ""}>
            {todo.title}
          </span>
          <button
            disabled={isAnotherItemEditing || isUpdating}
            onClick={onStartEdit}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400  disabled:cursor-not-allowed"
          >
            編集
          </button>
          <button
            disabled={isAnotherItemEditing || isUpdating}
            onClick={onDelete}
            className="px-3 py-1 rounded-md border border-red-300 bg-white text-sm text-red-600 disabled:border-gray-200 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            削除
          </button>
        </div>
      )}
    </li>
  );
}
