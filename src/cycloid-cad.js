import {draw,drawCircle,drawPointsInterpolation} from "replicad";
export function drawCycloid(){
    
    function calculate_next_point(R, E, Rr, N, theta, DiClearance) {
        const psi = -Math.atan2(
          Math.sin((1 - N) * theta),
          (R - DiClearance) / (E * N) - Math.cos((1 - N) * theta)
        );
        const x =
          (R - DiClearance) * Math.cos(theta) -
          Rr * Math.cos(theta - psi) -
          E * Math.cos(N * theta);
        const y =
          -(R - DiClearance) * Math.sin(theta) +
          Rr * Math.sin(theta - psi) +
          E * Math.sin(N * theta);
        return { x, y };
      }
    const R = 20 / 2;
    const E = 0.75;
    const Rr = 2 / 2;
    const N = 10;
    const thetaStep = 0.01;
    const DiOrClearance = 0;

    let points = [];
    let theta = 0;

    for (; theta <= 2 * Math.PI; theta += thetaStep) {
      let { x, y } = calculate_next_point(
        R,
        E,
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
      E,
      Rr,
      N,
      0,
      DiOrClearance
    );
    points.push([x,y]);
    console.log(points)

    // const circle0 = drawCircle(5).sketchOnPlane("XY").extrude(5);
    // const circle1 = drawCircle(5).sketchOnPlane("XY").extrude(5).translate([15,0,0]);
    // const circle2 = drawCircle(5).sketchOnPlane("XY").extrude(5).translate([-15,0,0]);
    // return drawCircle(30).sketchOnPlane("XY").extrude(5).cut(circle0).cut(circle1).cut(circle2);
    const holes = []
    const shaft = 4
    const output_disk_diameter = 10
    const output_pin_count = 5
    const output_pin_diameter = 2
    const disk_op_clearance = 0
    const eccentricity = 0.75
    
    holes.push({
        x: 0,
        y: 0,
        r: shaft / 2,
      });

      // Output pin holes
      for (let i = 0; i < output_pin_count; i++) {
        let angle = (2 * Math.PI * i) / output_pin_count;

        // Apply phase-specific rotations
        // if (phase === 2 && disk === 2) angle += Math.PI;
        // if (phase === 3 && disk === 2) angle += (4 / 3) * Math.PI;
        // if (phase === 3 && disk === 3) angle += (2 / 3) * Math.PI;

        const x = (output_disk_diameter / 2) * Math.cos(angle);
        const y = (output_disk_diameter / 2) * Math.sin(angle);
        const r =
          disk_op_clearance +
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


