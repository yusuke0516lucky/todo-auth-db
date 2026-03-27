interface TodoInputProps {
  title: string;
  isDisabled: boolean;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
}
export default function TodoInput({
  title,
  isDisabled,
  onTitleChange,
  onAdd,
}: TodoInputProps) {
  return (
    <>
      <input
        type="text"
        value={title}
        disabled={isDisabled}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <button onClick={onAdd} disabled={isDisabled}>
        追加
      </button>
    </>
  );
}
