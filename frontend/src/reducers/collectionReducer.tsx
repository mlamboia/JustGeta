export const collectionReducer = (
  state: Collection[],
  action: CollectionAction,
): Collection[] => {
  switch (action.type) {
    case "LOAD_DATA":
      return action.collections;

    case "ADD_COLLECTION":
      return [...state, action.collection];

    case "TOGGLE_COLLECTION":
      return state.map((collection) =>
        collection.id === action.collection.id
          ? { ...collection, isOpen: !collection.isOpen }
          : collection,
      );

    case "EDIT_COLLECTION": {
      const { id, title, variables } = action.collection;
      return state.map((collection) =>
        collection.id === id ? { ...collection, title, variables } : collection,
      );
    }

    case "DELETE_COLLECTION":
      return state.filter(
        (collection) => collection.id !== action.collection.id,
      );

    case "ADD_REQUEST": {
      return state.map((collection) =>
        collection.id === action.request.collectionId
          ? {
              ...collection,
              children: [...(collection.children || []), action.request],
            }
          : collection,
      );
    }

    case "EDIT_REQUEST": {
      return state.map((collection) =>
        collection.id === action.request.collectionId
          ? {
              ...collection,
              children: (collection.children || []).map((request) =>
                request.id === action.request.id ? action.request : request,
              ),
            }
          : collection,
      );
    }

    case "DELETE_REQUEST": {
      return state.map((collection) =>
        collection.id === action.request.collectionId
          ? {
              ...collection,
              children: (collection.children || []).filter(
                (request) => request.id !== action.request.id,
              ),
            }
          : collection,
      );
    }

    default:
      return state;
  }
};
