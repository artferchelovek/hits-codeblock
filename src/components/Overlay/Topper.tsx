import styles from "./Overlay.module.css";
import { useProgramRunner } from "../../hooks/useProgramRunner.ts";
import SvgStop from "../../svg/SvgStop.tsx";
import SvgNextStep from "../../svg/SvgNextStep.tsx";
import SvgStart from "../../svg/SvgStart.tsx";
import SvgBug from "../../svg/SvgBug.tsx";

type TopperProps = {
  runner: ReturnType<typeof useProgramRunner>;
};

export default function Topper({ runner }: TopperProps) {
  const { isRunning, isDebug, start, debug, stop, nextStep } = runner;

  return (
    <div className={styles.menu}>
      <div className={styles.label}>CodeBlocks</div>

      {isRunning ? (
        <>
          <div className={styles.break} onClick={stop}>
            <SvgStop fill={"var(--md-sys-color-on-error)"} />
          </div>

          {isDebug && (
            <div className={styles.start} onClick={nextStep}>
              <SvgNextStep fill="var(--md-sys-color-on-tertiary)" />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.start} onClick={start}>
            <SvgStart fill="var(--md-sys-color-on-tertiary)" />
          </div>
          <div className={styles.stop} onClick={debug}>
            <SvgBug fill={"var(--md-sys-color-on-secondary)"} />
          </div>
        </>
      )}
    </div>
  );
}
