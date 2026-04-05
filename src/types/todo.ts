export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoApiResponse<T> = {
  ok: boolean;
  data: T;
  message: string;
}

export type FilterStatus = "all" | "active" | "completed";
export type SortStatus = "asc" | "desc";

