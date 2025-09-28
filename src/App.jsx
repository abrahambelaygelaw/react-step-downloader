import React, { useState, useEffect } from "react";

import FileSaver from "file-saver";
import { wrap } from "comlink";


import cadWorker from "./worker.js?worker";
const cad = wrap(new cadWorker());

export default function ReplicadApp() {
  const [size, setSize] = useState(5);

  const downloadSTEP = async () => {
    const blob = await cad.createSTEPBlob();
    FileSaver.saveAs(blob, "cycloid.step");
  };
  const downloadSTL = async () => {
    const blob = await cad.createSTLBlob();
    FileSaver.saveAs(blob, "cycloid.stl");
  };
  return (
    <main>
      <h1>
        A{" "}
        <a
          href="https://replicad.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          replicad
        </a>{" "}
        sample app
      </h1>
      <p>
        You can find the code for this app{" "}
        <a
          href="https://github.com/sgenoud/replicad/tree/main/packages/replicad-app-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          on the GitHub repository
        </a>
      </p>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <label htmlFor="thicknessInput">thickness</label>
          <input
            id="thicknessInput"
            type="number"
            step="1"
            min="1"
            max="10"
            value={size}
            onChange={(v) => {
              const val = parseInt(v.target.value);
              if (val > 0 && val <= 10) setSize(val);
            }}
          />
        </div>
        <button onClick={downloadSTEP}>Download STEP</button>
        <button onClick={downloadSTL}>Download STL</button>
      </section>

    </main>
  );
}
