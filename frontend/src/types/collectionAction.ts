type CollectionAction =
  | { type: "LOAD_DATA"; collections: Collection[] }
  | { type: "TOGGLE_COLLECTION"; collection: Collection }
  | { type: "ADD_COLLECTION"; collection: Collection }
  | { type: "EDIT_COLLECTION"; collection: Collection }
  | { type: "DELETE_COLLECTION"; collection: Collection }
  | { type: "TOGGLE_EDIT"; collection: Collection }
  | { type: "ADD_REQUEST"; request: CollectionRequest }
  | { type: "EDIT_REQUEST"; request: CollectionRequest }
  | { type: "DELETE_REQUEST"; request: CollectionRequest };
