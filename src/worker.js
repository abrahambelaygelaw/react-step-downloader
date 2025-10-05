import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import { expose } from "comlink";
import { drawCycloid3D } from "./cycloid-3d";
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

function createSTEPBlob(params,disk) {
  // note that you might want to do some caching for more complex models
  return started.then(() => {
    return drawCycloid3D(params,disk).blobSTEP();
  });
}
function createSTLBlob(params,disk) {
  // note that you might want to do some caching for more complex models
  return started.then(() => {
    return drawCycloid3D(params,disk).blobSTL();
  });
}


// comlink is great to expose your functions within the worker as a simple API
// to your app.
expose({ createSTEPBlob, createSTLBlob });
