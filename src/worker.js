import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import { expose } from "comlink";
import { drawCycloid } from "./cycloid-cad";
// We import our model as a simple function

// This is the logic to load the web assembly code into replicad
let loaded = false;
const init = async () => {
  if (loaded) return Promise.resolve(true);

  const OC = await opencascade({
    locateFile: () => opencascadeWasm,
  });

  loaded = true;
  setOC(OC);

  return true;
};
const started = init();

function createSTEPBlob() {
  // note that you might want to do some caching for more complex models
  return started.then(() => {
    return drawCycloid().blobSTEP();
  });
}
function createSTLBlob() {
  // note that you might want to do some caching for more complex models
  return started.then(() => {
    return drawCycloid().blobSTL();
  });
}


// comlink is great to expose your functions within the worker as a simple API
// to your app.
expose({ createSTEPBlob, createSTLBlob });
