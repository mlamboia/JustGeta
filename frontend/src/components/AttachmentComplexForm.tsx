import React from "react";

interface AttachmentComplexFormProps {
  attachments: Attachment[];
  setAttachment: (
    id: number | null,
    name: string | null,
    files: FileList | null,
  ) => void;
  removeAttachment: (id: number) => void;
}

const AttachmentComplexForm: React.FC<AttachmentComplexFormProps> = ({
  attachments,
  setAttachment,
  removeAttachment,
}) => {
  return (
    <div>
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex gap-2 mt-3 mb-2">
          <input
            className="w-full bg-stone-600 border border-stone-600 hover:border-stone-700 hover:bg-stone-700 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="File"
            value={attachment.name}
            onChange={(e) => setAttachment(attachment.id, e.target.value, null)}
          />
          <label className="w-full cursor-pointer bg-stone-600 text-center border border-stone-600 hover:border-stone-700 hover:bg-stone-700 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <span>{attachment.filename || "Choose File"}</span>
            <input
              type="file"
              className="hidden"
              name={`attachments-${attachment.id}`}
              onChange={(e) =>
                setAttachment(attachment.id, null, e.target.files)
              }
            />
          </label>
          <button
            type="button"
            className="bg-stone-700 text-center border border-stone-700 hover:border-stone-800 hover:bg-stone-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            onClick={() => removeAttachment(attachment.id)}
          >
            X
          </button>
        </div>
      ))}

      <button
        type="button"
        className="flex bg-green-700 border border-green-700 hover:border-green-800 hover:bg-green-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
        onClick={() => setAttachment(null, null, null)}
      >
        Add File Input
      </button>
    </div>
  );
};

export default AttachmentComplexForm;
