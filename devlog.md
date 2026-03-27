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

## 2026-03-19

### Output

- Todoの完了・未完了API(PATCH)の実装（バックエンド）
  ・zodで{ completed: boolean }を検証(SafeParse)
- Todoの完了・未完了フロントエンド実装(チェックボックス)
  ・toggleCompletedメソッドの実装
- 連打防止機能実装
  ・更新中の状態管理(state)の実装
  ・checkboxにdisabled={editingTodo === todo.id}を付与

### Key learning

- fetch関数の書き方
  ・第一引数(URL)
  ・第二引数
  method: (POST|GET|PUT|DELETE)などのリクエストメソッドを文字列で設定
  (初期値はGET)
  headers: { "Content-Type": "application/json" }←JSONをサーバに送信する際
  body: JSON.stringify(obj)←JSONをサーバに送信する際
- devサーバ稼働中にdev.dbを置換/復元/移動してはいけない

### Next

- 編集(タイトル更新)機能の実装

## 2026-03-24

### Output

- タイトル編集機能(PATCH拡張)追加
  ・zodスキーマ設計：optional(completedとtitle) + "どちらか必須"
- タイトル編集機能UI
  ・updateTitle関数作成
  ・state設計(editingId/editTitle)

### Key learning

- zodの関数
  ・「.partial()」でoptionalにする
  ・「.refine(...)」で条件を追加する(どちらか必須)
- dataの組み立て
  ・更新時にcompleted(Todo実行/未実行)とtitleの同時更新時、
  空のdataオブジェクトを作成し、プロパティに格納することで、
  1度のupdateで更新できる。

### Next

- UI整理(component分割など)

## 2026-03-25

### Output

- （今日“動いた/増えた”もの。URL/画面/エンドポイント/コマンド結果）
- TodoItemへの切り出し(UI)
  ・Todo1件分の表示部品として分割
  ・props設計

### Key learning

- disabled制御の棲み分け
  ・isCurrentItemEditing/isAnotherItemEditing/isUpdating
- props設計

### Next

- TodoList/TodoInputへの分割

## 2026-03-26

### Output

- TodoList.tsxの作成・切り分け

### Key learning

- コンポーネント分割の基本原則
  ・状態(state)は上位コンポーネントが持ち、UIは下位コンポーネントが持つ
  ・子で発火し、親で処理する
  checkboxを押す→TodoItem(checkedを渡す)→TodoList(todo.idを渡す)
  →page.tsx(idとcheckedを使い関数実行)→state更新
- イベントハンドラの包み直し
  ・親の関数: toggleCompleted(id, checked)
  ・TodoItemが欲しい関数: onToggleComplete(checked)
  →TodoListで包み直す: (checked) => onToggleComplete(todo.id, checked)

### Next

- TodoInput作成

## 2026-03-27

### Output

- TodoInput.tsxの作成・切り分け
- Todo型の最適化
  ・Todo型を共通ファイル(todo.ts)へ切り出し
- Todo新規作成と編集保存のUIバリデーションを改善
  ・TodoInputのpropsを分割(isInputDisabled/isAddDisabled)
  ・TodoItemにisUpdatingとisSaveDisabledを分けて持たせる
- 入力補助メッセージとエラーメッセージの表示を改善
  ・エラー時の文言を修正
  ・空欄の時はそもそもボタンを押せないようにした
  ・disabledにするだけでは不親切であるため、補助分を追加

### Key learning

- booleanに意味を詰め込みすぎてはいけない
  ・isDisabled={isEditing || title.trim().length === 0}
  ・inputとbuttonに共通のisDisabledを使ったことにより、空文字の時そもそも入力できない状態になってしまった。
  ・isInputDisabledとisAddDisabledに役割分担した。

### Next

- 入力の文字数制限
- UIの改善
