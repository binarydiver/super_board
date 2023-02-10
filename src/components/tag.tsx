import { useState } from "react";

type TagInputProps = {
  onClick: VoidCallback;
};

const TagInput = ({ onClick }: TagInputProps) => {
  return (
    <span
      className="border border-dashed py-1 px-2 rounded-full inline-block mb-2"
      onClick={onClick}
    >
      + New Tag
    </span>
  );
};

type TagProps = {
  onBlur: { (tag: string): void };
  tags: string[];
};

const Tag = ({ onBlur, tags }: TagProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [enteredTag, setEnteredTag] = useState<string>();

  return (
    <section className="py-1 text-sm text-white">
      {tags.map((tag, index) => (
        <span
          className="border py-1 px-2 rounded-full mr-1 inline-block mb-2"
          key={index}
        >
          {tag}
        </span>
      ))}
      {isEditing ? (
        <input
          className="bg-slate-800 border disabled:cursor-not-allowed disabled:text-slate-500 enabled:focus:ring-1 rounded-sm py-0.5 px-1 w-20 mb-2"
          onChange={(event) => {
            setEnteredTag(event.target.value);
          }}
          onBlur={() => {
            if (enteredTag) {
              const matchedIndex = tags.findIndex((tag) => tag === enteredTag);
              if (matchedIndex === -1) {
                onBlur(enteredTag);
              }
              setEnteredTag(undefined);
            }
            setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <TagInput onClick={() => setIsEditing(true)} />
      )}
    </section>
  );
};

export default Tag;
