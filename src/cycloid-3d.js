import {drawCircle,drawPointsInterpolation} from "replicad";
export function drawCycloid3D(params,disk){
    const R = params.fixedRingDiameter / 2
    const Rr = params.externalPinDiameter / 2
    const N = params.numberOfExternalPins
    const eccentricity = params.eccentricity
    const shaft = params.camshaftHole
    const output_disk_diameter = params.outputDiskDiameter
    const output_pin_count = params.numberOfOutputPins
    const output_pin_diameter = params.outputPinDiameter
    const thetaStep = 0.01;
    const DiOrClearance = 0;
    const holes = []
    const phase = params.phase

    
    function calculate_next_point(R, eccentricity, Rr, N, theta, DiClearance) {
        const psi = -Math.atan2(
          Math.sin((1 - N) * theta),
          (R - DiClearance) / (eccentricity * N) - Math.cos((1 - N) * theta)
        );
        const x =
          (R - DiClearance) * Math.cos(theta) -
          Rr * Math.cos(theta - psi) -
          eccentricity * Math.cos(N * theta);
        const y =
          -(R - DiClearance) * Math.sin(theta) +
          Rr * Math.sin(theta - psi) +
          eccentricity * Math.sin(N * theta);
        return { x, y };
      }

    let points = [];
    let theta = 0;

    for (; theta <= 2 * Math.PI; theta += thetaStep) {
      let { x, y } = calculate_next_point(
        R,
        eccentricity,
        Rr,
        N,
        theta,
        DiOrClearance
      );
      points.push([x,y]);
    }

    // Close the loop
    let { x, y } = calculate_next_point(
      R,
      eccentricity,
      Rr,
      N,
      0,
      DiOrClearance
    );
    points.push([x,y]);

    
    holes.push({
        x: 0,
        y: 0,
        r: shaft / 2,
      });

      // Output pin holes
      for (let i = 0; i < output_pin_count; i++) {
        let angle = (2 * Math.PI * i) / output_pin_count;

        if (phase === 2 && disk === 2) angle += Math.PI;
        if (phase === 3 && disk === 2) angle += (4 / 3) * Math.PI;
        if (phase === 3 && disk === 3) angle += (2 / 3) * Math.PI;

        const x = (output_disk_diameter / 2) * Math.cos(angle);
        const y = (output_disk_diameter / 2) * Math.sin(angle);
        const r =
          DiOrClearance +
          eccentricity +
          output_pin_diameter / 2;

        holes.push({ x, y, r });
      }
      
      let cycloid =  drawPointsInterpolation(points).sketchOnPlane("XY").extrude(5);
      holes.forEach(hole => {
        cycloid = cycloid.cut(drawCircle(hole.r).sketchOnPlane("XY").extrude(5).translate([hole.x,hole.y,0]))
      })
      
    return cycloid;
}


