"use client";
import { useRef } from "react";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { ReplaceRule } from "../types";

export default function ReplaceLibrary({rules,onChange}:{rules:ReplaceRule[];onChange:(r:ReplaceRule[])=>void}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const edit=(id:string,patch:Partial<ReplaceRule>)=>onChange(rules.map(r=>r.id===id?{...r,...patch}:r));
  const importSheet=async(file?:File)=>{
    if(!file)return;
    try{
      const XLSX=await import("xlsx");
      const workbook=XLSX.read(await file.arrayBuffer(),{type:"array"});
      const rows=XLSX.utils.sheet_to_json<Record<string,unknown>>(workbook.Sheets[workbook.SheetNames[0]],{defval:""});
      const imported=rows.map(row=>({source:String(row["原文字"]??row["原词"]??row["source"]??"").trim(),target:String(row["替换文字"]??row["替换词"]??row["target"]??"").trim(),enabled:!["关闭","否","false","0"].includes(String(row["状态"]??row["enabled"]??"开启").toLowerCase())})).filter(row=>row.source);
      const merged=new Map(rules.map(rule=>[rule.source,rule]));
      imported.forEach(rule=>merged.set(rule.source,{id:merged.get(rule.source)?.id??crypto.randomUUID(),...rule}));
      onChange(Array.from(merged.values()));
    }catch{ window.alert("表格读取失败，请检查列名和文件格式。"); }
    if(fileRef.current)fileRef.current.value="";
  };
  const exportSheet=async()=>{
    const XLSX=await import("xlsx");
    const sheet=XLSX.utils.json_to_sheet(rules.map(rule=>({原文字:rule.source,替换文字:rule.target,状态:rule.enabled?"开启":"关闭"})));
    sheet["!cols"]=[{wch:28},{wch:28},{wch:10}];
    const workbook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook,sheet,"替换词库");
    XLSX.writeFile(workbook,"替换词库.xlsx");
  };
  return <><div className="rules-card">{rules.length ? <table className="rules-table"><thead><tr><th>原文字</th><th>替换文字</th><th>状态</th><th aria-label="操作"/></tr></thead><tbody>{rules.map(rule=><tr key={rule.id}><td><input type="text" value={rule.source} placeholder="输入原文字" onChange={e=>edit(rule.id,{source:e.target.value})}/></td><td><input type="text" value={rule.target} placeholder="输入替换文字" onChange={e=>edit(rule.id,{target:e.target.value})}/></td><td><button aria-label={rule.enabled?"关闭规则":"开启规则"} className={`switch ${rule.enabled?"on":""}`} onClick={()=>edit(rule.id,{enabled:!rule.enabled})}><span/></button></td><td><button className="icon-btn" aria-label="删除规则" onClick={()=>onChange(rules.filter(r=>r.id!==rule.id))}><Trash2 size={17}/></button></td></tr>)}</tbody></table>:<div className="empty-rules">还没有替换规则，可手动新增或导入表格</div>}</div><div className="settings-footer"><button className="btn" onClick={()=>onChange([...rules,{id:crypto.randomUUID(),source:"",target:"",enabled:true}])}><Plus size={17}/>新增规则</button><div className="rule-file-actions"><input ref={fileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={e=>void importSheet(e.target.files?.[0])}/><button className="btn" onClick={()=>fileRef.current?.click()}><Upload size={17}/>导入表格</button><button className="btn btn-primary" disabled={!rules.length} onClick={()=>void exportSheet()}><Download size={17}/>下载全部</button></div></div></>;
}
