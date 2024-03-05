type Collection = {
  id: number;
  title: string;
  variables?: CollectionVariable[];
  children: CollectionRequest[] | [];
  isOpen?: boolean;
};
