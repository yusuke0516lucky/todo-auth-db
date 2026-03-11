import { prisma } from "@/lib/prisma"
import { z } from "zod"
export async function GET() {
    try {
        const todos = await prisma.todo.findMany();
        return Response.json({ok: true, data: todos})
    } catch {
        return Response.json({ok: false, message: "Server error"}, {status: 500})
    }
}

const createTodoSchema = z.object({
    title: z.string().min(1, "title is required")
})

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const result = createTodoSchema.safeParse(requestData)
        if (!result.success) {
            return Response.json({ ok: false, message: "Invalid request"},{status: 400})
        } 
        const title = result.data.title
        const newTodo = await prisma.todo.create({
            data: { title, userId: "dummy-user" }
        })
        return Response.json({ok: true, data: newTodo}, {status: 201})
    } catch(e) {
        console.error(e);
    return Response.json({ ok: false, message: "Server error", },{status: 500})
    }
}