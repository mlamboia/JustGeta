import React from "react";
import parseFileToJson from "../utils/parseFileToJson";

type NewImportButtonProps = {
  dispatch: React.Dispatch<CollectionAction>;
};

const NewImportButton: React.FC<NewImportButtonProps> = ({ dispatch }) => {
  const newImport = async (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    if (file.type != "application/json")
      return console.error("Only json is allowed");

    const content = await parseFileToJson(file);

    const collectionVariables: CollectionVariable[] | undefined =
      content?.variable?.map((v) => ({
        id: Date.now(),
        name: v.key,
        value: v.value,
      })) || [];

    let collection: Collection = {
      id: Date.now() - 1,
      title: content?.info.name || "",
      variables: collectionVariables,
      children: [],
      isOpen: false,
    };

    let requests: CollectionRequest[] = [];
    content?.item?.forEach((i, idx) => {
      let requestHeader: { [key: string]: string } = {};
      if (i?.request?.header) {
        requestHeader = i.request.header.reduce(
          (acc: { [key: string]: string }, h: { [key: string]: string }) => {
            acc[h.key] = h.value;
            return acc;
          },
          {},
        );
      }

      let request: CollectionRequest = {
        id: Date.now() + idx,
        collectionId: collection.id,
        title: i.name,
        url: i.request.url.raw,
        method: i.request.method,
        headers: JSON.stringify(requestHeader),
        body: i.request.body?.raw,
        isOpen: false,
      };
      requests.push(request);
    });

    collection.children = requests;
    dispatch({ type: "ADD_COLLECTION", collection });
  };

  return (
    <label className="cursor-pointer border-s-0 rounded-e-md w-full bg-stone-700 text-center border border-stone-700 hover:border-stone-800 hover:bg-stone-800 px-6 py-2 shadow leading-tight focus:outline-none focus:shadow-outline">
      <span>Import</span>
      <input
        type="file"
        className="hidden"
        name="import"
        onChange={(e) => newImport(e.target.files)}
      />
    </label>
  );
};

export default NewImportButton;
