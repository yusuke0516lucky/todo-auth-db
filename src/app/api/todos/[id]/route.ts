import { prisma } from "@/lib/prisma"
import { z } from "zod"

//「errorがcode: stringを持つ」ことを保証するためのガード
function hasStringCode(e: unknown): e is { code: string } {
    return (
        typeof  e === 'object' && //errorがobjectであることを確認
        e !== null &&     
        'code' in e &&  //中にcodeというプロパティがあることを確認
        typeof (e as any).code === 'string' //codeがstringであることを確認
    )
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string, }> } //第二引数のcontext
) {
    //params.idの中に、URLの[id]の部分が入ってくる
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get("uid")
        
        if(!uid) {
            return Response.json({ok: false, message: "uid is required"}, { status: 400 })
        }
        if (id.trim().length === 0) {
            return Response.json({ ok: false, message: "Data error" }, { status: 400 })
        }  
        const todo = await prisma.todo.findFirst({
            where: {
                id,
                userId:uid
            }
        })
        if (!todo) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 404 })
        }
        await prisma.todo.delete({where: {id}})
        return Response.json({ ok: true }, { status: 200 })
    } catch(error) {
        if (hasStringCode(error) && error.code === 'P2025') {
            return Response.json({ ok: false, message: "Todo not found" }, { status: 404 })
        }
        return Response.json({ ok: false, message: "Server error" },{ status: 500 })
    }
}

const updatedTodoSchema = z.object({
    completed: z.boolean(),
    title: z.string().trim().min(1)
}).partial().refine((data) => data.completed !== undefined || data.title !== undefined,
{ message: "Either title or completed is required" }) //更新時、completedかtitleのどちらかは必須。

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get("uid")

        if(!uid) {
            return Response.json({ ok: false, message: "uid is required" }, { status: 400 })
        }
        if (id.trim().length === 0) {
            return Response.json({ ok: false, message: "Invalid id" }, { status: 400 })
        }
        const body = await request.json()
        const updatedTodo = updatedTodoSchema.safeParse(body)
        if (!updatedTodo.success) {
            return Response.json({ ok: false, message: "Invalid request body"}, { status: 400 } )
        }
        const data: { completed?: boolean; title?: string } = {} //更新用データを格納する空のdataオブジェクト
        if (updatedTodo.data.completed !== undefined) {
            data.completed = updatedTodo.data.completed; //完了・未完了
        }
        if (updatedTodo.data.title !== undefined) {
            data.title = updatedTodo.data.title; //Todo名
        }
        const todo = await prisma.todo.findFirst({
            where: {
                id,
                userId:uid
            }
        })
        if (!todo) {
            return Response.json({ ok: false, message: "Not authorized" }, { status: 404 })
        }
        const updatedData = await prisma.todo.update({ where: { id }, data })
        return Response.json({ ok: true, data: updatedData }, { status: 200 })
        
        
    } catch(error) {
        console.log(error)
        if (hasStringCode(error) && error.code === 'P2025') {
            return Response.json({ ok: false, message: "Todo not found" }, { status: 404 })
        }
        return Response.json({ ok: false, message: "Server error" }, { status: 500 })
    }
}