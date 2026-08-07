"use client";
import { useRef, useState } from "react";
import { Download, FilePlus2, FileText, X } from "lucide-react";
import { ParsedDocument } from "../core/parser";
import { exportAllWords, exportWord } from "../core/wordExport";
import WordDocumentPreview from "../components/WordDocumentPreview";

export default function Formatter({documents,onAdd,onCancel}:{documents:ParsedDocument[];onAdd:(files:File[])=>Promise<void>;onCancel:()=>void}) {
  const [selected,setSelected]=useState(0);
  const [adding,setAdding]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);
  const current=documents[selected] || documents[0];
  const download=()=>documents.length===1?exportWord(current):exportAllWords(documents);
  const add=async(list:FileList|null)=>{if(!list)return;const files=Array.from(list).filter(file=>/\.(docx|docm|dotx|dotm)$/i.test(file.name));if(!files.length)return;setAdding(true);try{await onAdd(files)}finally{setAdding(false);if(fileRef.current)fileRef.current.value=""}};
  return <><div className="formatter-toolbar"><div className="file-title"><FileText size={18} color="#2e9eff"/><span>已处理 {documents.length} 个文件</span></div><div className="toolbar-actions"><button className="btn" onClick={onCancel}><X size={16}/>取消上传</button><input ref={fileRef} hidden multiple type="file" accept=".docx,.docm,.dotx,.dotm" onChange={event=>void add(event.target.files)}/><button className="btn" disabled={adding} onClick={()=>fileRef.current?.click()}><FilePlus2 size={16}/>{adding?"正在处理…":"上传文件"}</button><button className="btn btn-primary" onClick={()=>void download()}><Download size={16}/>下载文件</button></div></div><section className="batch-stage"><aside className="batch-list">{documents.map((document,index)=><div className={`batch-item ${index===selected?"active":""}`} key={`${document.name}-${index}`}><button className="batch-select" onClick={()=>setSelected(index)}><FileText size={17}/><span>{document.name}</span></button><button className="icon-btn batch-download" aria-label={`下载 ${document.name}`} onClick={()=>void exportWord(document)}><Download size={17}/></button></div>)}</aside><div className="batch-preview"><WordDocumentPreview document={current}/></div></section></>;
}
