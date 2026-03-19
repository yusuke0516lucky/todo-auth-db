## YYYY-MM-DD
### Output
- （今日“動いた/増えた”もの。URL/画面/エンドポイント/コマンド結果）

### Key learning
- （学びは1つだけ。具体的に）

### Next
- （次にやることを1つ）

### Weekly summary (YYYY-MM-DD - YYYY-MM-DD)
- Shipped: （今週できたこと3つ）
- Blockers: （詰まったこと1つ）
- Next focus: （来週の焦点1つ）

## 2026-03-11
### Output
- 「User」「Todo」でテーブル設計を定義
- DB作成
    ・SQLiteのDBファイル(dev.db)を作成し、schema.prisma(テーブル定義)をもとに、実際の　テーブルをDB内に作成。
- DBに接続する"コード側の窓口"(prisma.ts)を作成
    ・アプリ(Next.js)がDBにアクセスするときの入り口(PrismaClient)を用意
- HTTPで叩けるAPIを作成（バックエンド）
    ・GET/api/todosというエンドポイント(API)を作成
    ・「http://localhost:3000/api/todos」を開くと、200でJSONが返る状態
    ・prisma.todo.findMany()を使い、DBからTodoを読み出し、Response.json(...)で返す

### Key learning
- zod(入力検証)の必要性
    ・request.json()の結果は外部入力で信用できないため、schema(ルール)を定義し、
    　safeParseで成功/失敗を分岐する必要がある。
- Prisma(DB操作)の基本CRUD
    ・取得:findMany (SELECT相当)
    ・作成:create　(INSERT相当)
    ・Prismaの戻り値はPromiseインスタンス(await必須)

### Next
- UI作成(フロントエンド)


## 2026-03-17
### Output
- 最低限のUI作成（Homeコンポーネント/addメソッド/一覧表示）
- state設計（todos(配列)/title(inputの値)/loading(取得中か否か)/error）
- fetchでAPIを叩いて表示する
- DELETE機能のAPIを追加（バックエンド）

### Key learning
- useState()の初期値がundefinedだとmapできない
    → useState<Todo[]>([])のように、配列初期化+型付けが必須
- URLパラメータの受け取り方（動的ルート）
    ・[id]などを使う場合、第二引数のcontextでparamsを受け取る
    ・{params} : {params: {id: string}}
- catch(error)のerrorはTypeScript的にはundefined扱い
    ・型チェックが必要
### Next
- DELETE機能のフロントエンド作成