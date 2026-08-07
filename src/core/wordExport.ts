import { ParsedDocument } from "./parser";

export async function createProcessedWord(data: ParsedDocument) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(data.originalWord);
  const targets = Object.keys(zip.files).filter((path) => /^word\/(document|header\d+|footer\d+|footnotes|endnotes)\.xml$/.test(path));
  await Promise.all(targets.map(async (path) => {
    const entry = zip.file(path);
    if (!entry) return;
    const xml = new DOMParser().parseFromString(await entry.async("text"), "application/xml");
    Array.from(xml.getElementsByTagName("w:p")).forEach((paragraph) => {
      data.wordReplacements?.forEach((rule) => {
        const nodes = Array.from(paragraph.getElementsByTagName("w:t"));
        const joined = nodes.map((node) => node.textContent || "").join("");
        const starts: number[] = [];
        let cursor = joined.indexOf(rule.source);
        while (cursor >= 0) { starts.push(cursor); cursor = joined.indexOf(rule.source, cursor + rule.source.length); }
        starts.reverse().forEach((start) => {
          const end = start + rule.source.length;
          let offset = 0, first = -1, last = -1, firstOffset = 0, lastOffset = 0;
          nodes.forEach((node, index) => {
            const length = (node.textContent || "").length;
            if (first < 0 && start >= offset && start < offset + length) { first = index; firstOffset = start - offset; }
            if (end > offset && end <= offset + length) { last = index; lastOffset = end - offset; }
            offset += length;
          });
          if (first < 0 || last < 0) return;
          const prefix = (nodes[first].textContent || "").slice(0, firstOffset);
          const suffix = (nodes[last].textContent || "").slice(lastOffset);
          nodes[first].textContent = prefix + rule.target + suffix;
          for (let index = first + 1; index <= last; index++) nodes[index].textContent = "";
        });
      });
    });
    zip.file(path, new XMLSerializer().serializeToString(xml));
  }));
  return zip.generateAsync({ type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

function download(blob:Blob,name:string){
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportWord(data: ParsedDocument) {
  download(await createProcessedWord(data),data.name);
}

export async function exportAllWords(documents:ParsedDocument[]) {
  const { default: JSZip } = await import("jszip");
  const archive=new JSZip();
  await Promise.all(documents.map(async document=>archive.file(document.name,await createProcessedWord(document))));
  download(await archive.generateAsync({type:"blob"}),"处理后的Word.zip");
}
