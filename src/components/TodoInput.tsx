interface TodoInputProps {
  title: string;
  isInputDisabled: boolean;
  isAddDisabled: boolean;
  showEmptyTitleMessage: boolean;
  showEditingMessage: boolean;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
}
export default function TodoInput({
  title,
  isInputDisabled,
  isAddDisabled,
  showEmptyTitleMessage,
  showEditingMessage,
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
      {showEmptyTitleMessage && <p>1文字以上入力すると追加できます</p>}
      <button onClick={onAdd} disabled={isAddDisabled}>
        追加
      </button>
    </>
  );
}
