"use client";
import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

export default function UploadBox({ onInput }: { onInput:(files:File[])=>Promise<void> }) {
  const wordRef = useRef<HTMLInputElement>(null);
  const [dragging,setDragging] = useState(false), [busy,setBusy] = useState(false);
  const send = async (input:FileList|File[]) => { const files=Array.from(input).filter(file=>/\.(docx|docm|dotx|dotm)$/i.test(file.name)); if(!files.length)return; setBusy(true); try { await onInput(files); } finally { setBusy(false); } };
  return <div className={`upload-box ${dragging?"dragging":""}`} onDragOver={(e)=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={(e)=>{e.preventDefault();setDragging(false);void send(e.dataTransfer.files)}}>
    <div className="upload-icon"><UploadCloud size={27}/></div>
    <h2>把文件放在这里</h2><p>支持批量上传 WPS 所有格式文件</p>
    <div className="upload-actions">
      <button className="btn btn-primary" disabled={busy} onClick={()=>wordRef.current?.click()}><FileText size={17}/>{busy?"正在处理…":"上传文件"}</button>
    </div>
    <input ref={wordRef} hidden multiple type="file" accept=".docx,.docm,.dotx,.dotm" onChange={(e)=>e.target.files&&void send(e.target.files)}/>
  </div>;
}
