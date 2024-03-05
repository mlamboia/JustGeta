import React, { useState, useReducer, useEffect } from "react";
import { MakeRequest } from "../wailsjs/go/main/App";
import "./App.css";

import CollectionForm from "./components/CollectionForm";
import RequestForm from "./components/RequestForm";
import { collectionReducer } from "./reducers/collectionReducer";
import ResponseViewer from "./components/ResponseViewer";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [response, setResponse] = useState<any | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<
    Collection | CollectionRequest | null
  >(null);
  const storedCollections = localStorage.getItem("collections");
  const [collections, dispatch] = useReducer(
    collectionReducer,
    storedCollections ? JSON.parse(storedCollections) : [],
  );

  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  const handleRequest = async (request: RequestData) => {
    try {
      try {
        if (request.headers) JSON.parse(request.headers);
      } catch (e) {
        throw "Header is not a valid JSON";
      }

      try {
        if (request.body) JSON.parse(request.body);
      } catch (e) {
        throw "Body is not a valid JSON";
      }

      if (!selectedCollection) throw "Selected collection not found";

      const thisRequest = selectedCollection as CollectionRequest;
      const collection = collections.find(
        (c) => c.id == thisRequest.collectionId,
      );

      if (!collection) throw "Collection not found";
      collection.variables?.forEach((variable) => {
        if (request.body) {
          request.body = request.body.replace(
            new RegExp(`{{${variable.name}}}`, "g"),
            variable.value.toString(),
          );
        }

        if (request.headers) {
          request.headers = request.headers.replace(
            new RegExp(`{{${variable.name}}}`, "g"),
            variable.value.toString(),
          );
        }
      });

      const data = await MakeRequest(request);
      setResponse(data);
    } catch (error) {
      setResponse(error);
    }
  };

  return (
    <div className="min-h-screen place-items-center justify-items-center">
      <nav className="text-2xl py-2 px-6 sticky top-0 left-0 w-full z-30 flex justify-between items-center backdrop-blur-md shadow">
        Just Geta 🏠
      </nav>

      <div className="grid grid-cols-[15rem_minmax(100px,_1fr)] gap-4">
        <div className="col-auto">
          <Sidebar
            collections={collections}
            dispatch={dispatch}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        </div>
        <div className="">
          {selectedCollection ? (
            "children" in selectedCollection ? (
              <CollectionForm
                collection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                dispatch={dispatch}
              />
            ) : (
              <div>
                <RequestForm
                  request={selectedCollection as CollectionRequest}
                  setSelectedCollection={setSelectedCollection}
                  dispatch={dispatch}
                  onSendRequest={handleRequest}
                />
                <ResponseViewer response={response} />
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
