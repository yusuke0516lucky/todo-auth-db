import { prisma } from "@/lib/prisma"
import { z } from "zod"
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url) //requestのURLをURLオブジェクトとして扱う
        const uid = searchParams.get("uid") 

        if (!uid) {
            return Response.json({ok: false, message: "uid is required"}, {status: 400})
        }

        const todos = await prisma.todo.findMany({
            where: {
                userId: uid,
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        return Response.json({ok: true, data: todos})
    } catch {
        return Response.json({ok: false, message: "Server error"}, {status: 500})
    }
}

const createTodoSchema = z.object({
    title: z.string().min(1, "title is required"),
    uid: z.string().min(1, "uid is required"),
    email: z.string().email("無効なメールアドレスです")
})

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const result = createTodoSchema.safeParse(requestData)
        if (!result.success) {
            return Response.json({ ok: false, message: "Invalid request"},{status: 400})
        } 
        const title = result.data.title
        const uid = result.data.uid
        const email = result.data.email
        const user = await prisma.user.findUnique({
            where: {
                id: uid
            }
        })
        if (!user) {
            await prisma.user.create({
                data: {
                    id: uid,
                    email: email,

                }
            })
        }
        const newTodo = await prisma.todo.create({
            data: { title, userId: uid }
        })
        return Response.json({ok: true, data: newTodo}, {status: 201})
    } catch(e) {
        console.error(e);
    return Response.json({ ok: false, message: "Server error", },{status: 500})
    }
}