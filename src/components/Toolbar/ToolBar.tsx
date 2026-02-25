import styles from "./ToolBar.module.css";
import SvgBin from "../../svg/SvgBin.tsx";
import { useBlockContext } from "../../context/BlockContext.tsx";
import SvgDownload from "../../svg/SvgDownload.tsx";
import SvgUpload from "../../svg/SvgUpload.tsx";
import downloadProgram from "../../logic/downloadProgram.ts";
import React, { useRef } from "react";
import { uploadProgram } from "../../logic/uploadProgram.ts";

export default function ToolBar() {
  const {
    removeProgram,
    getProgram,
    refreshProgram,
    program,
    updateProgramName,
  } = useBlockContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadProgram(file);
      refreshProgram(data);
      event.target.value = "";
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className={styles.toolBar}>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={fileChange}
      />

      <div className={styles.fileName}>
        <input
          value={program.name}
          onChange={(e) => updateProgramName(e.target.value)}
          className={styles.fieldFileName}
          type="text"
        />
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={styles.elem}
      >
        <SvgUpload fill={"rgb(7 75 114)"} />
      </div>
      <div
        onClick={() => downloadProgram(getProgram())}
        className={styles.elem}
      >
        <SvgDownload fill={"rgb(7 75 114)"} />
      </div>
      <div onClick={() => removeProgram()} className={styles.elem}>
        <SvgBin fill={"rgb(7 75 114)"} />
      </div>
    </div>
  );
}
