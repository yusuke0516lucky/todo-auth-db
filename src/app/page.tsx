'use client'; //クライアント側のコンポーネント
import {useEffect, useState} from 'react'
//Todoの型定義
type Todo = {
  id: string;
  title: string;
  completed: boolean;
}
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null) //2重送信防止用(通信中のTodo)State
  const [editingId, setEditingId] = useState<string | null>(null) //編集中State
  const [editTitle, setEditTitle] = useState<string>("") //編集中の値

  const isEditing = editingId !== null

  //loadTodos()を作成する（GET）
  const loadTodos = async() => {
    setLoading(true);
    try {
      const response = await fetch('/api/todos')
      const result = await response.json()
      if (result.ok === true) {
        setTodos(result.data)
        setError('')
      } else {
        setError(result.message)
      }
    } catch(error) {
      setError('取得に失敗しました')
    } finally {
      setLoading(false)
    }
    
  }

  //addTodo()を作成する（POST）
  const addTodo = async() => {
    setError('')
    try {
      if (title.trim().length === 0) {
        setError('空文字です')
        return
      }
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({title})
      })
      const result = await response.json()
      if (result.ok === true) {
        setTitle('')
        await loadTodos()
      } else {
        setError(result.message)
      }
    } catch(error) {
      setError('送信に失敗しました。')
      console.log(error)
    }
  }
  
  //初回読み込み時にloadTodos()を実行
  useEffect(() => {
    void loadTodos();
  }, [])
  
  //削除用関数を作成する
  const deleteTodo = async(id: string) => {
    setError('') //エラーをクリアする
    try {
      const response = await fetch('/api/todos/' + id, { method: 'DELETE' })
      const result = await response.json()

      if (result.ok === true) {
        //削除が完了したらTodoを再取得する
        await loadTodos()
      } else {
        setError(result.message)
        return
      }
    } catch(e) {
      setError('削除に失敗しました')
      console.log(e)
    }
  }

  //Todo完了・未完了関数
  const toggleCompleted = async(id: string, checked: boolean) => {
    setError('')
    setUpdatingId(id)
    try {
      const response = await fetch('/api/todos/' + id, { 
        method: 'PATCH', 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ completed: checked })
      })
      const result = await response.json()

      if (result.ok === true) {
        await loadTodos()
      } else {
        setError(result.message)
        return
      }
    } catch(e) {
      setError('更新に失敗しました')
      console.log(e)
    } finally {
      setUpdatingId(null)
    }
  }

  //タイトル更新関数
  const updateTitle = async(id: string, newTitle: string) => {
    setError('')
    setUpdatingId(id) //2重送信防止
    try {
       if (newTitle.trim().length === 0) {
        setError('空文字です')
        return
      }
      const response = await fetch('/api/todos/' + id, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      })
      const result = await response.json()
      if (result.ok === true) {
        setEditingId(null)
        setEditTitle('')
        await loadTodos()
      } else {
        setError(result.message)
      }
    } catch(e) {
      setError('更新に失敗しました')
      console.log(e)
    } finally {
      setUpdatingId(null)
    }
  }
 
  return (
    <>
      {
        loading 
        ? <p>Loading</p> 
        : <ul>
          {todos.length === 0 
          ? <li>まだTodoがありません</li>
          : todos.map((todo) => (
             <li key={todo.id}>
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    disabled={updatingId === todo.id}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button
                  disabled={updatingId === todo.id}
                  onClick={() => updateTitle(todo.id, editTitle)}
                  >
                    保存
                  </button>
                  <button
                  disabled={updatingId === todo.id}
                  onClick={() => {
                    setEditingId(null)
                    setEditTitle('')
                  }}
                  >
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  <input 
                    type="checkbox" 
                    disabled={isEditing || updatingId === todo.id} 
                    checked={todo.completed} 
                    onChange={(e) => toggleCompleted(todo.id, e.target.checked)} 
                    />{todo.title}
                  <button
                    disabled={isEditing || updatingId === todo.id}
                    onClick={() => {
                      setEditingId(todo.id)
                      setEditTitle(todo.title)
                    }}
                  >
                    編集
                  </button>
                  <button 
                    disabled={isEditing || updatingId === todo.id}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    削除
                  </button>
                </>
              )}
             </li>
          ))}
        </ul>
      }
      <input 
        type="text" 
        value={title} 
        disabled={isEditing}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button 
        onClick={addTodo}
        disabled={isEditing}
      >
          追加
      </button>
      {
        error ? <p>{error}</p> : <p></p>
      }
    </>
  );
}
