export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type FilterStatus = "all" | "active" | "completed";
export type SortStatus = "asc" | "desc";