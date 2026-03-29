interface TodoInputProps {
  title: string;
  isInputDisabled: boolean; //編集中
  isAddDisabled: boolean; //編集中+1文字未満+文字数超過
  showEmptyTitleMessage: boolean;
  showEditingMessage: boolean;
  showTooLongTitleMessage: boolean;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
}
export const SUPPORT_TEXT_STYLE = "text-gray-500 text-sm";
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <input
          className="flex-1 mr-1 border border-gray-300 rounded-md px-2 py-1 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          type="text"
          value={title}
          disabled={isInputDisabled}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <button
          className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={onAdd}
          disabled={isAddDisabled}
        >
          追加
        </button>
      </div>
      <div>
        {showEditingMessage && (
          <p className={SUPPORT_TEXT_STYLE}>※現在編集中のため追加できません</p>
        )}
        {showTooLongTitleMessage && (
          <p className={SUPPORT_TEXT_STYLE}>※30文字以内で入力してください</p>
        )}
        {showEmptyTitleMessage && (
          <p className={SUPPORT_TEXT_STYLE}>※1文字以上入力すると追加できます</p>
        )}
      </div>
    </div>
  );
}
