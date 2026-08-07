"use client";

import { useEffect, useRef } from "react";
import { ParsedDocument } from "../core/parser";

export default function WordDocumentPreview({ document }: { document: ParsedDocument }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !document.originalWord) return;
    const host = ref.current;
    host.innerHTML = "";
    let cancelled = false;
    void import("docx-preview").then(async ({ renderAsync }) => {
      if (cancelled) return;
      await renderAsync(document.originalWord!.slice(0), host, undefined, {
        className: "source-docx",
        inWrapper: true,
        ignoreWidth: true,
        ignoreHeight: true,
        breakPages: false,
        useBase64URL: true,
      });
      if (cancelled) return;
      if (document.wordReplacements?.length) {
        host.querySelectorAll("p").forEach((paragraph) => {
          document.wordReplacements?.forEach((rule) => {
            const walker = window.document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
            const nodes: Node[] = [];
            let node: Node | null;
            while ((node = walker.nextNode())) nodes.push(node);
            const joined = nodes.map((item) => item.textContent || "").join("");
            const starts: number[] = [];
            let cursor = joined.indexOf(rule.source);
            while (cursor >= 0) { starts.push(cursor); cursor = joined.indexOf(rule.source, cursor + rule.source.length); }
            starts.reverse().forEach((start) => {
              const end = start + rule.source.length;
              let offset=0, first=-1, last=-1, firstOffset=0, lastOffset=0;
              nodes.forEach((item,index) => { const length=(item.textContent||"").length; if(first<0&&start>=offset&&start<offset+length){first=index;firstOffset=start-offset} if(end>offset&&end<=offset+length){last=index;lastOffset=end-offset} offset+=length; });
              if(first<0||last<0)return;
              const prefix=(nodes[first].textContent||"").slice(0,firstOffset), suffix=(nodes[last].textContent||"").slice(lastOffset);
              nodes[first].textContent=prefix+rule.target+suffix;
              for(let index=first+1;index<=last;index++)nodes[index].textContent="";
            });
          });
        });
      }
    });
    return () => { cancelled = true; };
  }, [document]);

  return <article id="document-preview" className="document-paper word-document"><div className="document-meta">仅替换文字 · 原始格式保持不变</div><div ref={ref} className="word-preview" /></article>;
}
