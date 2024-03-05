import React, { useState } from "react";
import useSaveShortcut from "../hooks/useSaveShortcut";

type CollectionFormProps = {
  collection: Collection | null;
  dispatch: React.Dispatch<CollectionAction>;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Collection | CollectionRequest | null>
  >;
};

const CollectionForm: React.FC<CollectionFormProps> = ({
  collection,
  setSelectedCollection,
  dispatch,
}) => {
  if (!collection) return <div></div>;

  const [title, setTitle] = useState(collection?.title);
  const [variables, setVariables] = useState<CollectionVariable[]>(
    collection?.variables || [{ id: Date.now(), name: "", value: "" }],
  );

  const handleInputChange = (
    index: number,
    key: keyof CollectionVariable,
    value: string,
  ) => {
    const updatedVariables: CollectionVariable[] = [...variables];
    if (key != "id") updatedVariables[index][key] = value;
    setVariables(updatedVariables);
  };

  const addVariable = () => {
    setVariables([...variables, { id: Date.now(), name: "", value: "" }]);
  };

  const handleCollectionChange = () => {
    collection.title = title || "";
    collection.variables = variables.filter(
      ({ name, value }) => name != "" && value != "",
    );
    dispatch({ type: "EDIT_COLLECTION", collection });
  };
  useSaveShortcut(handleCollectionChange);

  const handleCollectionDelete = function () {
    const confirmed = confirm("Sure delete this collection?");

    if (!confirmed) return;

    dispatch({ type: "DELETE_COLLECTION", collection });
    setSelectedCollection(null);
  };

  const handleNewRequest = function () {
    dispatch({
      type: "ADD_REQUEST",
      request: {
        id: Date.now(),
        title: "New Request",
        collectionId: collection.id,
      },
    });
  };

  return (
    <div className="pt-2 px-4">
      <div className="flex gap-2 mb-8 mt-3">
        <button
          className="w-60 bg-blue-700 text-center border border-blue-700 hover:border-blue-800 hover:bg-blue-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleNewRequest}
        >
          + New Request
        </button>

        <input
          className="w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="text"
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-stone-700 text-center border border-stone-700 hover:border-stone-800 hover:bg-stone-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleCollectionChange}
        >
          Save
        </button>
      </div>

      <button
        type="button"
        className="flex bg-green-700 border border-green-700 hover:border-green-800 hover:bg-green-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
        onClick={addVariable}
      >
        Add Variable
      </button>

      {variables.map((variable, index) => (
        <div className="flex gap-2" key={index}>
          <input
            type="text"
            value={variable.name}
            placeholder="Name"
            className="w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(index, "name", e.target.value)
            }
          />

          <input
            type="text"
            value={variable.value}
            placeholder="Value"
            className="w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(index, "value", e.target.value)
            }
          />
        </div>
      ))}

      <div className="flex">
        <button
          className="flex ml-auto justify-center my-4 w-48 bg-red-700 text-center border border-red-700 hover:border-red-800 hover:bg-red-800 px-6 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-2"
          type="button"
          onClick={handleCollectionDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CollectionForm;
