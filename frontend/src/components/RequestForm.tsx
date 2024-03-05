import React, { useState, useEffect } from "react";
import AttachmentComplexForm from "./AttachmentComplexForm";
import useSaveShortcut from "../hooks/useSaveShortcut";
import parseFileToBinary from "../utils/parseFileToBinary";

interface RequestFormProps {
  onSendRequest: (requestData: RequestData) => void;
  dispatch: React.Dispatch<CollectionAction>;
  request: CollectionRequest;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Collection | CollectionRequest | null>
  >;
}

const RequestForm: React.FC<RequestFormProps> = ({
  request,
  setSelectedCollection,
  dispatch,
  onSendRequest,
}) => {
  const [title, setTitle] = useState(request.title || "");
  const [url, setUrl] = useState(request.url || "");
  const [method, setMethod] = useState(request.method || "GET");
  const [headers, setHeaders] = useState(request.headers || "");
  const [body, setBody] = useState(request.body || "");
  const [contentType, setcontentType] = useState(1);
  const [attachments, setAttachments] = useState<Attachment[]>(
    request.attachments || [],
  );

  useEffect(() => {
    setTitle(request.title);
    setUrl(request.url || "");
    setMethod(request.method || "");
    setHeaders(request.headers || "");
    setBody(request.body || "");
    setcontentType(1);
    setAttachments(request.attachments || []);
  }, [request]);

  const setAttachment = async (
    id: number | null,
    name: string | null,
    files: FileList | null,
  ) => {
    const existingAttachmentIndex = attachments.findIndex(
      (attachment) => attachment.id === id,
    );

    let thisAttachment: Attachment =
      existingAttachmentIndex !== -1
        ? attachments[existingAttachmentIndex]
        : { id: id || Date.now(), name: "file" };
    if (files) {
      thisAttachment.filename = files[0].name;
      const file = await parseFileToBinary(files[0]);
      thisAttachment.file = file.split(",")[1];
    }

    if (name) {
      thisAttachment.name = name;
    }

    if (existingAttachmentIndex !== -1) {
      const updatedAttachments = [...attachments];
      updatedAttachments[existingAttachmentIndex] = thisAttachment;
      setAttachments(updatedAttachments);
    } else {
      setAttachments([...attachments, thisAttachment]);
    }
  };

  const removeAttachment = (id: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((attachment) => attachment.id !== id),
    );
  };

  const handleSendRequest = () => {
    onSendRequest({
      url,
      method,
      headers,
      body,
      attachments,
    });
  };

  const handleSave = () => {
    request.title = title;
    request.url = url;
    request.method = method;
    try {
      const headersJson = JSON.parse(headers);
      request.headers = JSON.stringify(headersJson, null, "\t");
      setHeaders(request.headers);
    } catch (e) {
      request.headers = headers;
    }

    try {
      const bodyJson = JSON.parse(body);
      request.body = JSON.stringify(bodyJson, null, "\t");
      setBody(request.body);
    } catch (e) {
      request.body = body;
    }

    request.attachments = attachments.filter(
      (attachment) => attachment.file != null,
    );

    dispatch({ type: "EDIT_REQUEST", request });
  };
  useSaveShortcut(handleSave);

  const toggleContent = (type: number) => {
    setcontentType(type);
  };

  const handleRequestDelete = function () {
    const confirmed = confirm("Sure delete this collection?");

    if (!confirmed) return;

    dispatch({ type: "DELETE_REQUEST", request });
    setSelectedCollection(null);
  };

  return (
    <div className="pt-2 px-4">
      <div className="flex gap-2 mb-8 mt-3">
        <input
          className="w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="text"
          placeholder="Enter URL"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-stone-700 text-center border border-stone-700 hover:border-stone-800 hover:bg-stone-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleSave}
        >
          Save
        </button>

        <button
          className="bg-red-700 text-center border border-red-700 hover:border-red-800 hover:bg-red-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleRequestDelete}
        >
          Delete
        </button>
      </div>

      <div className="flex gap-2">
        <select
          className="appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          className="w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="bg-blue-600 text-center border border-blue-600 hover:border-blue-700 hover:bg-blue-700 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleSendRequest}
        >
          Send
        </button>
      </div>

      <div className="flex items-center mb-2 py-2 px-2 rounded bg-stone-600">
        <button
          className={`py-2 px-4 rounded ${
            contentType == 1
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-stone-400 hover:bg-stone-500 text-stone-800"
          }`}
          onClick={() => toggleContent(1)}
        >
          Body
        </button>
        <button
          className={`py-2 px-4 ml-2 rounded ${
            contentType == 2
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-stone-400 hover:bg-stone-500 text-stone-800"
          }`}
          onClick={() => toggleContent(2)}
        >
          Header
        </button>
        <button
          className={`py-2 px-4 ml-2 rounded ${
            contentType == 3
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-stone-400 hover:bg-stone-500 text-stone-800"
          }`}
          onClick={() => toggleContent(3)}
        >
          FormData
        </button>
      </div>
      {contentType == 1 && (
        <textarea
          className="w-full h-40 overflow-auto resize-none appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          placeholder="Request Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}
      {contentType == 2 && (
        <textarea
          className="w-full h-40 overflow-auto resize-none appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          placeholder="Headers (JSON)"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
      )}
      {contentType == 3 && (
        <AttachmentComplexForm
          attachments={attachments}
          setAttachment={setAttachment}
          removeAttachment={removeAttachment}
        />
      )}
    </div>
  );
};

export default RequestForm;
