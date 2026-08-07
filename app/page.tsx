"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Settings2 } from "lucide-react";
import Home from "../src/pages/Home";
import Formatter from "../src/pages/Formatter";
import Settings from "../src/pages/Settings";
import { ParsedDocument, parseInput } from "../src/core/parser";
import { applyReplacements } from "../src/core/replaceEngine";
import { DEFAULT_RULES, ReplaceRule } from "../src/types";

type Page = "home" | "formatter" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [documents, setDocuments] = useState<ParsedDocument[]>([]);
  const [rules, setRules] = useState<ReplaceRule[]>(DEFAULT_RULES);

  useEffect(() => {
    const saved = localStorage.getItem("yuque-replace-rules");
    if (saved) {
      try { setRules(JSON.parse(saved)); } catch { /* use defaults */ }
    }
  }, []);

  const processed = useMemo(() => documents.map(document => applyReplacements(document, rules)), [documents, rules]);

  const handleInput = async (files: File[]) => {
    const result = await Promise.all(files.map(file => parseInput(file)));
    setDocuments(result);
    setPage("formatter");
  };

  const addDocuments = async (files: File[]) => {
    const result = await Promise.all(files.map(file => parseInput(file)));
    setDocuments(current => [...current, ...result]);
  };

  const saveRules = (next: ReplaceRule[]) => {
    setRules(next);
    localStorage.setItem("yuque-replace-rules", JSON.stringify(next));
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#181818]">
      <header className="app-header">
        <button className="brand" onClick={() => setPage("home")} aria-label="返回首页">
          <span className="brand-mark"><img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" /></span>
          <span>文字替换助手</span>
        </button>
        <nav className="top-nav" aria-label="主导航">
          <button className={page !== "settings" ? "active" : ""} onClick={() => setPage(documents.length ? "formatter" : "home")}><FileText size={16} />文档整理</button>
          <button className={page === "settings" ? "active" : ""} onClick={() => setPage("settings")}><Settings2 size={16} />替换词库</button>
        </nav>
      </header>
      {page === "home" && <Home onInput={handleInput} />}
      {page === "formatter" && processed.length > 0 && <Formatter documents={processed} onAdd={addDocuments} onCancel={() => { setDocuments([]); setPage("home"); }} />}
      {page === "settings" && <Settings rules={rules} onSave={saveRules} />}
    </main>
  );
}
