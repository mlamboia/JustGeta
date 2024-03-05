import React from "react";

interface ResponseViewerProps {
  response: any;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const lines = response
    ? JSON.stringify(response, null, "\t").split("\t")
    : response?.split("\n");

  return (
    <div className="pb-2 px-4">
      <div className="flex flex-col items-start mb-4 py-2 px-2 rounded bg-stone-600">
        <h2 className="text-lg font-bold mb-2">Response</h2>
        <pre className="w-full h-44 overflow-y-auto flex items-start bg-stone-500 p-2 rounded">
          {lines?.map((line: string, index: number) => (
            <React.Fragment key={index}>
              <span className="line-number text-gray-400">{1}</span>
              <code className="ml-2 whitespace-normal text-start">{line}</code>
            </React.Fragment>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
