"use client"; //クライアント側のコンポーネント
import { useEffect, useState } from "react";
import TodoList from "@/components/TodoList";
import TodoInput from "@/components/TodoInput";
//Todoの型定義
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null); //2重送信防止用(通信中のTodo)State
  const [editingId, setEditingId] = useState<string | null>(null); //編集中State
  const [editTitle, setEditTitle] = useState<string>(""); //編集中の値

  const isEditing = editingId !== null;

  //loadTodos()を作成する（GET）
  const loadTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/todos");
      const result = await response.json();
      if (result.ok === true) {
        setTodos(result.data);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  //addTodo()を作成する（POST）
  const addTodo = async () => {
    setError("");
    try {
      if (title.trim().length === 0) {
        setError("空文字です");
        return;
      }
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const result = await response.json();
      if (result.ok === true) {
        setTitle("");
        await loadTodos();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("送信に失敗しました。");
      console.log(error);
    }
  };

  //初回読み込み時にloadTodos()を実行
  useEffect(() => {
    void loadTodos();
  }, []);

  //削除用関数を作成する
  const deleteTodo = async (id: string) => {
    setError(""); //エラーをクリアする
    try {
      const response = await fetch("/api/todos/" + id, { method: "DELETE" });
      const result = await response.json();

      if (result.ok === true) {
        //削除が完了したらTodoを再取得する
        await loadTodos();
      } else {
        setError(result.message);
        return;
      }
    } catch (e) {
      setError("削除に失敗しました");
      console.log(e);
    }
  };

  //Todo完了・未完了関数
  const toggleCompleted = async (id: string, checked: boolean) => {
    setError("");
    setUpdatingId(id);
    try {
      const response = await fetch("/api/todos/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: checked }),
      });
      const result = await response.json();

      if (result.ok === true) {
        await loadTodos();
      } else {
        setError(result.message);
        return;
      }
    } catch (e) {
      setError("更新に失敗しました");
      console.log(e);
    } finally {
      setUpdatingId(null);
    }
  };

  //タイトル更新関数
  const updateTitle = async (id: string, newTitle: string) => {
    setError("");
    setUpdatingId(id); //2重送信防止
    try {
      if (newTitle.trim().length === 0) {
        setError("空文字です");
        return;
      }
      const response = await fetch("/api/todos/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      const result = await response.json();
      if (result.ok === true) {
        setEditingId(null);
        setEditTitle("");
        await loadTodos();
      } else {
        setError(result.message);
      }
    } catch (e) {
      setError("更新に失敗しました");
      console.log(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading</p>
      ) : (
        <TodoList
          todos={todos}
          editTitle={editTitle}
          editingId={editingId}
          updatingId={updatingId}
          onEditTitleChange={setEditTitle}
          onCancelEdit={() => {
            setEditingId(null);
            setEditTitle("");
          }}
          onToggleComplete={toggleCompleted}
          onStartEdit={(id, title) => {
            setEditingId(id);
            setEditTitle(title);
          }}
          onSaveEdit={updateTitle}
          onDelete={deleteTodo}
        />
      )}
      <TodoInput
        title={title}
        isDisabled={isEditing}
        onTitleChange={(value) => {
          setTitle(value);
        }}
        onAdd={addTodo}
      />
      {error ? <p>{error}</p> : <p></p>}
    </>
  );
}
