import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import { expose } from "comlink";
import { drawCycloid3D } from "./cycloid-3d";

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

async function createSTEPBlob(params,disk) {
  await init()
    return drawCycloid3D(params,disk).blobSTEP();
}
async function createSTLBlob(params,disk) {
  await init()

    return drawCycloid3D(params,disk).blobSTL();
}


.
expose({ createSTEPBlob, createSTLBlob });
