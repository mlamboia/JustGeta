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
  const handleNewCollection = () => {
    const collection: Collection = {
      id: Date.now(),
      title: "New Collection",
      children: [],
    };

    dispatch({ type: "ADD_COLLECTION", collection });
  };

  const handleCollectionClick = (collection: Collection) => {
    var selectedCollectionRequest = selectedCollection as CollectionRequest;

    if (selectedCollectionRequest?.id == collection.id) {
      collection.isOpen = true;
      setSelectedCollection(() => null);
    } else if (selectedCollectionRequest?.collectionId == collection.id) {
      setSelectedCollection(() => collection);
      return;
    } else {
      setSelectedCollection(() => collection);
    }

    dispatch({ type: "TOGGLE_COLLECTION", collection });
  };

  const handleCollectionRequestClick = (request: CollectionRequest) => {
    setSelectedCollection((prevSelectedCollection) =>
      prevSelectedCollection?.id === request.id ? null : request,
    );
  };

  return (
    <div className="w-80 p-2 px-4 flex flex-col h-screen">
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

      <div className="flex-1 text-start h-100 overflow-auto mb-10 pr-2">
        {collections.map((collection) => (
          <React.Fragment key={collection.id}>
            <div
              className={`truncate cursor-pointer select-none rounded p-2 mt-1 ${[selectedCollection?.id, (selectedCollection as CollectionRequest)?.collectionId].includes(collection.id) || collection?.isOpen ? "bg-stone-800" : ""}`}
              onClick={() => handleCollectionClick(collection)}
            >
              {collection.title}
            </div>
            {([
              selectedCollection?.id,
              (selectedCollection as CollectionRequest)?.collectionId,
            ].includes(collection.id) ||
              collection?.isOpen) &&
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
