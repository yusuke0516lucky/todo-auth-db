import type { Todo, FilterStatus, SortStatus } from "@/types/todo";

//フィルターメソッド
export const filterTodos = (todos: Todo[], filter: FilterStatus): Todo[] => {
    if (filter === "all") {
      return todos;
    } else if (filter === "active") {
      return todos.filter((todo) => todo.completed === false);
    } else {
      return todos.filter((todo) => todo.completed === true);
    }
  };
//検索メソッド
export const searchTodos = (todos: Todo[], value: string): Todo[] => {
      const searchedTodo: Todo[] = todos.filter((todo) => {
        return todo.title.includes(value);
      });
      return searchedTodo;
    };

//ソートメソッド　※createdAtをTodoに持たせていないため、一旦順方向・逆方向でソートする
export const sortTodos = (todos: Todo[], sortOrder: SortStatus): Todo[] => {
    const copiedTodos = [...todos];
    if (sortOrder === "asc") {
      return copiedTodos; //順方向
    } else {
      return copiedTodos.reverse(); //逆順
    }
};

//0件・空表示の処理
export const getEmptyMessage = (
    todos: Todo[],
    searchKeyword: string,
    displayTodos: Todo[],
    filter: FilterStatus
): string => {
    
    let emptyMessage = ""
    if (todos.length === 0) {
        emptyMessage = "まだTodoがありません";
    } else if (searchKeyword.trim().length > 0 && displayTodos.length === 0) {
        emptyMessage = "検索結果は0件です";
    } else if (filter === "active" && displayTodos.length === 0) {
        emptyMessage = "未完了のTodoはありません";
    } else if (filter === "completed" && displayTodos.length === 0) {
        emptyMessage = "完了済みのTodoはありません";
    }
    return emptyMessage
}