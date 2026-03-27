import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  editTitle: string;
  isCurrentItemEditing: boolean; //自分自身が編集中かどうか
  isAnotherItemEditing: boolean; //他のitemが編集中かどうか
  isUpdating: boolean; //更新中かどうか(2重送信防止)
  isSaveDisabled: boolean;
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
        <>
          <input
            type="text"
            value={editTitle}
            disabled={isUpdating}
            onChange={(e) => onEditTitleChange(e.target.value)}
          />
          <button disabled={isUpdating || isSaveDisabled} onClick={onSaveEdit}>
            保存
          </button>
          <button disabled={isUpdating} onClick={onCancelEdit}>
            キャンセル
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            disabled={isAnotherItemEditing || isUpdating}
            checked={todo.completed}
            onChange={(e) => onToggleComplete(e.target.checked)}
          />
          {todo.title}
          <button
            disabled={isAnotherItemEditing || isUpdating}
            onClick={onStartEdit}
          >
            編集
          </button>
          <button
            disabled={isAnotherItemEditing || isUpdating}
            onClick={onDelete}
          >
            削除
          </button>
        </>
      )}
    </li>
  );
}
