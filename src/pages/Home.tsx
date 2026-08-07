import UploadBox from "../components/UploadBox";
import FormatCleaner from "../components/FormatCleaner";
export default function Home({onInput}:{onInput:(files:File[])=>Promise<void>}) { return <section className="home-shell"><div className="hero"><p className="eyebrow">保留 文件原始格式</p><h1>文字替换助手</h1><UploadBox onInput={onInput}/><FormatCleaner/><p className="support-line">支持 .docx、.docm、.dotx、.dotm · 老式 .doc / .wps 请先另存为 .docx</p></div></section>; }
