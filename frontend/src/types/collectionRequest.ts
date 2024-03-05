type CollectionRequest = {
  id: number;
  collectionId: number;
  title: string;
  url?: string;
  method?: string;
  headers?: string;
  body?: string;
  isOpen?: boolean;
  attachments?: Attachment[];
};
