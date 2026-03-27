interface TodoInputProps {
  title: string;
  isInputDisabled: boolean;
  isAddDisabled: boolean;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
}
export default function TodoInput({
  title,
  isInputDisabled,
  isAddDisabled,
  onTitleChange,
  onAdd,
}: TodoInputProps) {
  return (
    <>
      <input
        type="text"
        value={title}
        disabled={isInputDisabled}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <button onClick={onAdd} disabled={isAddDisabled}>
        追加
      </button>
    </>
  );
}
