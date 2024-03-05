const parseFileToJson = async function (
  file: File,
): Promise<PostmanImport | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
      const result = JSON.parse(event.target?.result as string);
      resolve(result);
    });
    reader.addEventListener("error", (err) => reject(err));

    if (!file) return resolve(null);
    reader.readAsText(file);
  });
};

export default parseFileToJson;
