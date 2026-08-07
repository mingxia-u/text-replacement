export type ParsedDocument = {
  name: string;
  originalWord: ArrayBuffer;
  wordReplacements?: { source: string; target: string }[];
};

export async function parseInput(file?: File): Promise<ParsedDocument> {
  if (!file || !/\.(docx|docm|dotx|dotm)$/i.test(file.name)) {
    throw new Error("请选择 .docx、.docm、.dotx 或 .dotm 文件");
  }
  return { name: file.name, originalWord: await file.arrayBuffer() };
}
