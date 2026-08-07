"use client";
import { useEffect, useState } from "react";
import { ReplaceRule } from "../types";
import ReplaceLibrary from "../components/ReplaceLibrary";
export default function Settings({rules,onSave}:{rules:ReplaceRule[];onSave:(r:ReplaceRule[])=>void}) { const [draft,setDraft]=useState(rules); useEffect(()=>setDraft(rules),[rules]); const update=(next:ReplaceRule[])=>{setDraft(next);onSave(next)}; return <section className="settings-shell"><div className="settings-head"><div><h1>替换词库</h1><p>所有修改自动保存，也可以通过表格批量导入或下载全部规则。</p></div></div><ReplaceLibrary rules={draft} onChange={update}/></section>; }
