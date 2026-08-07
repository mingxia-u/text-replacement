"use client";

import { useState } from "react";
import { Clipboard, Eraser } from "lucide-react";

export default function FormatCleaner() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="format-cleaner">
      <div className="format-cleaner-head">
        <div><span className="format-cleaner-icon"><Eraser size={16}/></span><strong>清除格式</strong></div>
        <span>粘贴后复制纯文本</span>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="在这里粘贴需要清除格式的文字…"
        aria-label="粘贴需要清除格式的文字"
      />
      <div className="format-cleaner-footer">
        <span>{text.length} 字</span>
        <button className="btn" disabled={!text.trim()} onClick={copy}><Clipboard size={16}/>{copied ? "已复制" : "复制纯文本"}</button>
      </div>
    </section>
  );
}
