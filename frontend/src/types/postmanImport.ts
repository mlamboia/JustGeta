type Header = {
  key: string;
  value: string;
};

type PostmanImport = {
  info: {
    name: string;
    _postman_id: string;
  };
  variable?: { key: string; value: string | number }[];
  item?: {
    name: string;
    request: {
      method: string;
      body?: { raw: string };
      header?: Header[];
      url: { raw: string };
    };
  }[];
};
