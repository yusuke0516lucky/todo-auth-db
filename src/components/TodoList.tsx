import TodoItem from "./TodoItem";
import type { Todo } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  editTitle: string;
  editingId: string | null;
  updatingId: string | null;
  onEditTitleChange: (value: string) => void;
  onCancelEdit: () => void;
  onToggleComplete: (id: string, checked: boolean) => void;
  onStartEdit: (id: string, title: string) => void;
  onSaveEdit: (id: string, editTitle: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  editTitle,
  editingId,
  updatingId,
  onEditTitleChange,
  onCancelEdit,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: TodoListProps) {
  return (
    <ul>
      {todos.length === 0 ? (
        <li>まだTodoがありません</li>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editTitle={editTitle}
            isCurrentItemEditing={editingId === todo.id}
            isAnotherItemEditing={editingId !== null && editingId !== todo.id}
            isUpdating={updatingId === todo.id}
            onEditTitleChange={onEditTitleChange}
            onCancelEdit={onCancelEdit}
            onToggleComplete={(checked) => onToggleComplete(todo.id, checked)}
            onStartEdit={() => onStartEdit(todo.id, todo.title)}
            onSaveEdit={() => onSaveEdit(todo.id, editTitle)}
            onDelete={() => onDelete(todo.id)}
          />
        ))
      )}
    </ul>
  );
}
