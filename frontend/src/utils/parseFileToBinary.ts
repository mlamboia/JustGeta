const parseFileToBinary = async function (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        resolve(new TextDecoder().decode(result));
      } else {
        resolve(result ? result.toString() : "");
      }
    });
    reader.addEventListener("error", (err) => reject(err));

    if (!file) return resolve("");
    reader.readAsDataURL(file);
  });
};

export default parseFileToBinary;
