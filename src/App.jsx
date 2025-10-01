import React, { useState, useEffect } from "react";

import FileSaver from "file-saver";
import { wrap } from "comlink";
import Cycloid from "./Cycloid.jsx";


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
    <>
      
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        
        <button onClick={downloadSTEP}>Download STEP</button>
        <button onClick={downloadSTL}>Download STL</button>
      </section>
        <Cycloid/>

    </>
  );
}
