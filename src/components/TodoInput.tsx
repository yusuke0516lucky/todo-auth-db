interface TodoInputProps {
  title: string;
  isInputDisabled: boolean; //編集中
  isAddDisabled: boolean; //編集中+1文字未満
  showEmptyTitleMessage: boolean;
  showEditingMessage: boolean;
  showTooLongTitleMessage: boolean;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
}
export default function TodoInput({
  title,
  isInputDisabled,
  isAddDisabled,
  showEmptyTitleMessage,
  showEditingMessage,
  showTooLongTitleMessage,
  onTitleChange,
  onAdd,
}: TodoInputProps) {
  return (
    <>
      {showEditingMessage && <p>現在編集中のため追加できません</p>}
      <input
        type="text"
        value={title}
        disabled={isInputDisabled}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      {showTooLongTitleMessage && <p>30文字以内で入力してください</p>}
      {showEmptyTitleMessage && <p>1文字以上入力すると追加できます</p>}
      <button onClick={onAdd} disabled={isAddDisabled}>
        追加
      </button>
    </>
  );
}
