import { prisma } from "@/lib/prisma"

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
    _request: Request,
    { params }: { params: Promise<{ id: string }> } //第二引数のcontext
) {
    //params.idの中に、URLの[id]の部分が入ってくる
    try {
        const { id } = await params
        if (id.trim().length === 0) {
            return Response.json({ ok: false, message: "Data error" }, { status: 400 })
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