import type { Todo, TodoApiResponse } from "@/types/todo";



export const loadTodoApi = async (uid: string): Promise<Todo[]> => {
    const response = await fetch(`/api/todos?uid=${uid}`);
    const result: TodoApiResponse<Todo[]> = await response.json();
    if (result.ok === true) {
        return result.data
    } else {
        throw new Error(result.message)
    }
}

export const addTodoApi = async (title: string, uid: string, email: string): Promise<void> => {
    const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, uid, email })
    })
    const result:TodoApiResponse<null> = await response.json()
    if (result.ok === true) {
        return;
    } else {
        throw new Error(result.message)
    }
}

export const deleteTodoApi = async (id: string): Promise<void> => {
    const response = await fetch("/api/todos/" + id, {
        method: "DELETE"
    }) 
    const result:TodoApiResponse<null> = await response.json()

    if (result.ok === true) {
        return;
    } else {
        throw new Error(result.message)
    }
}

export const updateTitleApi = async (id: string, newTitle: string): Promise<void> => {
    const response = await fetch("/api/todos/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
    });
    const result:TodoApiResponse<null> = await response.json();

    if (result.ok === true) {
        return;
    } else {
        throw new Error(result.message)
    }
}


export const toggleCompletedApi = async(id :string, checked: boolean): Promise<void> => {
    const response = await fetch("/api/todos/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: checked })
    });
    const result:TodoApiResponse<null> = await response.json();

    if (result.ok === true) {
        return;
    } else {
        throw new Error(result.message)
    }
}