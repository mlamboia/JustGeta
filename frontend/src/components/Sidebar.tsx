import React, { useState } from "react";
import NewImportButton from "./NewImportButton";

type SidebarProps = {
  collections: Collection[];
  dispatch: React.Dispatch<CollectionAction>;
  selectedCollection: Collection | CollectionRequest | null;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Collection | CollectionRequest | null>
  >;
};

const Sidebar: React.FC<SidebarProps> = ({
  collections,
  dispatch,
  selectedCollection,
  setSelectedCollection,
}) => {
  const [clickCount, setClickCount] = useState(1);

  const handleNewCollection = () => {
    const collection: Collection = {
      id: Date.now(),
      title: "New Collection",
      children: [],
    };

    dispatch({ type: "ADD_COLLECTION", collection });
  };

  const handleCollectionClick = (collection: Collection) => {
    setClickCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      if (clickCount != 1) return;
      setClickCount(1);

      if (selectedCollection?.id == collection.id) return;

      var selectedCollectionRequest = selectedCollection as CollectionRequest;
      if (selectedCollectionRequest?.collectionId == collection.id) return;

      dispatch({ type: "TOGGLE_COLLECTION", collection });
    }, 200);
  };

  const handleDoubleClick = (collection: Collection) => {
    setClickCount(1);
    collection.isOpen = true;

    setSelectedCollection((prevSelectedCollection) =>
      prevSelectedCollection?.id === collection.id ? null : collection,
    );

    dispatch({ type: "TOGGLE_COLLECTION", collection });
  };

  const handleCollectionRequestClick = (request: CollectionRequest) => {
    setSelectedCollection((prevSelectedCollection) =>
      prevSelectedCollection?.id === request.id ? null : request,
    );
  };

  return (
    <div className="w-64 p-2 px-4">
      <div className="flex rounded-lg shadow-sm mt-3 mb-2">
        <button
          className="border-e-0 rounded-s-md w-full bg-green-700 text-center border border-green-700 hover:border-green-800 hover:bg-green-800 px-6 py-2 shadow leading-tight focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleNewCollection}
        >
          New
        </button>

        <NewImportButton dispatch={dispatch} />
      </div>

      <div className="flex rounded-lg shadow-sm mt-3 mb-2">
        <input
          className="rounded-md w-full appearance-none bg-stone-600 text-white border border-stone-700 hover:border-stone-600 px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Name"
        />
      </div>

      <div className="text-start">
        {collections.map((collection) => (
          <React.Fragment key={collection.id}>
            <div
              className={`truncate cursor-pointer select-none rounded p-2 mt-1 ${selectedCollection?.id == collection.id || collection?.isOpen ? "bg-stone-800" : ""}`}
              onClick={() => handleCollectionClick(collection)}
              onDoubleClick={() => handleDoubleClick(collection)}
            >
              {collection.title}
            </div>
            {(selectedCollection?.id == collection.id || collection?.isOpen) &&
              collection.children && (
                <div>
                  {collection.children.map((childcollection) => (
                    <div
                      key={childcollection.id}
                      className={`truncate cursor-pointer select-none rounded p-2 pl-8 ${selectedCollection?.id === childcollection.id ? "bg-stone-700" : ""}`}
                      onClick={() =>
                        handleCollectionRequestClick(childcollection)
                      }
                    >
                      {childcollection.title}
                    </div>
                  ))}
                </div>
              )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
