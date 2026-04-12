"use client"; //クライアント側のコンポーネント
import { useEffect, useState } from "react";
import TodoList from "@/components/TodoList";
import TodoInput from "@/components/TodoInput";
import type { Todo, FilterStatus, SortStatus } from "@/types/todo";
import { TODOS_MAX_LENGTH } from "@/constants/validation";
import {
  loadTodoApi,
  addTodoApi,
  deleteTodoApi,
  updateTitleApi,
  toggleCompletedApi,
} from "@/lib/todoApi";
import {
  filterTodos,
  searchTodos,
  sortTodos,
  getEmptyMessage,
} from "@/lib/todoView";
//firebaseAuthの要素をインポート
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null); //2重送信防止用(通信中のTodo)State
  const [editingId, setEditingId] = useState<string | null>(null); //編集中State
  const [editTitle, setEditTitle] = useState<string>(""); //編集中の値
  const [filter, setFilter] = useState<FilterStatus>("all"); //フィルター用state
  const [searchKeyword, setSearchKeyword] = useState<string>(""); //検索用state
  const [sortOrder, setSortOrder] = useState<SortStatus>("asc"); //ソート用state(順方向/逆方向)
  const [success, setSuccess] = useState(""); //成功時コメント用state

  //認証用state
  const [user, setUser] = useState<User | null>(null); //ログイン済みかどうかのstate
  const [loadingAuth, setLoadingAuth] = useState(true); //認証確認中かどうかのstate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Googleログイン失敗：", error);
      setError("Googleログインに失敗しました");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウト失敗：", error);
      setError("ログアウトに失敗しました");
    }
  };

  //エラーメソッド
  const handleError = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(fallbackMessage);
    }
  };

  const isEditing: boolean = editingId !== null;
  const SELECTED_CLASS_STYLE =
    "px-3 py-1 rounded-md border border-blue-600 bg-blue-600 text-sm text-white";
  const UNSELECTED_CLASS_STYLE =
    "px-3 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50";
  //件数表示する変数
  const allCount = todos.length;
  const activeCount = todos.filter((todo) => todo.completed === false).length;
  const completedCount = todos.filter((todo) => todo.completed === true).length;

  const filteredTodos: Todo[] = filterTodos(todos, filter); //表示用Todo

  const searchedTodos = searchTodos(filteredTodos, searchKeyword);
  const sortedTodos = sortTodos(searchedTodos, sortOrder);

  //loadTodos()を作成する（GET）
  const loadTodos = async (uid: string) => {
    setLoading(true);
    try {
      const response = await loadTodoApi(uid);
      setTodos(response);
      setError("");
    } catch (error) {
      handleError(error, "Todo取得失敗");
    } finally {
      setLoading(false);
    }
  };

  //addTodo()を作成する（POST）
  const addTodo = async () => {
    setSuccess("");
    setError("");
    if (!user || !user.email) {
      return;
    }
    try {
      if (title.trim().length === 0) {
        setError("文字を入力してください");
        return;
      } else if (title.trim().length > TODOS_MAX_LENGTH) {
        setError("30文字以内で入力してください");
        return;
      }
      await addTodoApi(title, user.uid, user.email);
      setTitle("");
      setSuccess("Todo追加成功");
      await loadTodos(user.uid);
    } catch (error) {
      handleError(error, "Todo追加失敗");
    }
  };

  //成功時メッセージを3秒後に消す
  useEffect(() => {
    if (!success) return;
    let timer = setTimeout(() => {
      setSuccess("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success]);

  //初回読み込み時にloadTodos()を実行
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }
    void loadTodos(user.uid);
  }, [user]);

  //削除用関数を作成する
  const deleteTodo = async (id: string) => {
    setSuccess("");
    setError(""); //エラーをクリアする
    if (!user) {
      return;
    }
    try {
      await deleteTodoApi(id, user.uid);
      setSuccess("Todo削除成功");
      await loadTodos(user.uid);
    } catch (error) {
      handleError(error, "Todo削除失敗");
    }
  };

  //Todo完了・未完了関数
  const toggleCompleted = async (id: string, checked: boolean) => {
    setSuccess("");
    setError("");
    if (!user) {
      return;
    }
    setUpdatingId(id);

    try {
      await toggleCompletedApi(id, checked, user.uid);
      setSuccess("完了/未完了切り替え成功");
      await loadTodos(user.uid);
    } catch (error) {
      handleError(error, "完了/未完了切り替え失敗");
    } finally {
      setUpdatingId(null);
    }
  };

  //タイトル更新関数
  const updateTitle = async (id: string, newTitle: string) => {
    setSuccess("");
    setError("");
    if (!user) {
      return;
    }
    setUpdatingId(id); //2重送信防止

    try {
      if (newTitle.trim().length === 0) {
        setError("文字を入力してください");
        return;
      } else if (newTitle.trim().length > TODOS_MAX_LENGTH) {
        setError("30文字以内で入力してください");
        return;
      }
      await updateTitleApi(id, newTitle, user.uid);

      setEditingId(null);
      setEditTitle("");
      setSuccess("Todo更新成功");
      await loadTodos(user.uid);
    } catch (error) {
      handleError(error, "Todo更新失敗");
    } finally {
      setUpdatingId(null);
    }
  };

  //0件・空表示の分岐
  const emptyMessage = getEmptyMessage(
    todos,
    searchKeyword,
    sortedTodos,
    filter,
  );
  //認証確認中であれば早期リターンする
  if (loadingAuth) {
    return <div>認証状態を確認中...</div>;
  }
  //未ログイン状態の場合はログイン画面を出力する(Todoリストを表示しない)
  if (!user) {
    return (
      <div>
        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-medium text-red-700">
            {`⚠️ ${error}`}
          </p>
        )}
        <div>
          <h1>Todoリスト</h1>
          <p>ログインしてください</p>
          <button
            onClick={handleGoogleLogin}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">
              ログイン中: {user.displayName ?? "ユーザー"}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          >
            ログアウト
          </button>
        </div>
      </div>
      {loading ? (
        <p className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Todoを読み込み中...
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              className={
                filter === "all" ? SELECTED_CLASS_STYLE : UNSELECTED_CLASS_STYLE
              }
              onClick={() => setFilter("all")}
            >
              {`全件(${allCount})`}
            </button>
            <button
              className={
                filter === "active"
                  ? SELECTED_CLASS_STYLE
                  : UNSELECTED_CLASS_STYLE
              }
              onClick={() => setFilter("active")}
            >
              {`未完了(${activeCount})`}
            </button>
            <button
              className={
                filter === "completed"
                  ? SELECTED_CLASS_STYLE
                  : UNSELECTED_CLASS_STYLE
              }
              onClick={() => setFilter("completed")}
            >
              {`完了済み(${completedCount})`}
            </button>
            <button
              onClick={() => setSortOrder("asc")}
              className={
                sortOrder === "asc"
                  ? "border-b-2 border-blue-500 font-bold"
                  : "text-gray-500"
              }
            >
              昇順
            </button>
            <button
              onClick={() => setSortOrder("desc")}
              className={
                sortOrder === "desc"
                  ? "border-b-2 border-blue-500 font-bold"
                  : "text-gray-500"
              }
            >
              降順
            </button>
          </div>
          <div>
            <input
              placeholder="絞り込み"
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-2 py-1 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <TodoList
            todos={sortedTodos}
            emptyMessage={emptyMessage}
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
        </>
      )}
      <TodoInput
        title={title}
        isInputDisabled={isEditing}
        isAddDisabled={
          isEditing ||
          title.trim().length === 0 ||
          title.trim().length > TODOS_MAX_LENGTH
        }
        onTitleChange={(value) => {
          setTitle(value);
        }}
        onAdd={addTodo}
        showEmptyTitleMessage={!isEditing && title.trim().length === 0}
        showEditingMessage={isEditing}
        showTooLongTitleMessage={
          !isEditing && title.trim().length > TODOS_MAX_LENGTH
        }
      />

      {error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-medium text-red-700">
          {`⚠️ ${error}`}
        </p>
      ) : (
        success && (
          <p className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            {success}
          </p>
        )
      )}
    </>
  );
}
