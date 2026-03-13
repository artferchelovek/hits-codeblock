import styles from "./ToolBar.module.css";
import SvgBin from "../../svg/SvgBin.tsx";
import { useProgramContext } from "../../context/ProgramContext.tsx";
import { useInteractionContext } from "../../context/InteractionContext.tsx";
import SvgDownload from "../../svg/SvgDownload.tsx";
import SvgUpload from "../../svg/SvgUpload.tsx";
import SvgSun from "../../svg/SvgSun.tsx";
import SvgMoon from "../../svg/SvgMoon.tsx";
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
  } = useProgramContext();

  const { theme, toggleTheme } = useInteractionContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadProgram(file);
      refreshProgram(data);
      event.target.value = "";
    } catch (e) {
      alert(e);
    }
  };

  const iconColor = "var(--md-sys-color-on-primary-container)";

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
        onClick={toggleTheme}
        className={styles.elem}
      >
        {theme === "light" ? (
          <SvgMoon fill={iconColor} />
        ) : (
          <SvgSun fill={iconColor} />
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={styles.elem}
      >
        <SvgUpload fill={iconColor} />
      </div>
      <div
        onClick={() => downloadProgram(getProgram())}
        className={styles.elem}
      >
        <SvgDownload fill={iconColor} />
      </div>
      <div onClick={() => removeProgram()} className={styles.elem}>
        <SvgBin fill={iconColor} />
      </div>
    </div>
  );
}
