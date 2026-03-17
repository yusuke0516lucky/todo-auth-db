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
      alert(`取得に失敗しました。`)
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
      alert('送信に失敗しました。')
      console.log(error)
    }
  }
  
  //初回読み込み時にloadTodos()を実行
  useEffect(() => {
    void loadTodos();
  }, [])
  
 
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
               {todo.title}
             </li>
          ))}
        </ul>
      }
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <button onClick={addTodo}>追加</button>
      {
        error ? <p>{error}</p> : <p></p>
      }
    </>
  );
}
