// utils/CycloidalDriveEngine.js
export class CycloidalDriveEngine {
    constructor(canvas, params, onResultsUpdate) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.params = params;
      this.onResultsUpdate = onResultsUpdate;
      
      // Animation properties
      this.animationId = null;
      this.inputAngle = 0;
      this.lastSpeedTime = -1;
      this.scale = 1;
      
      // Pre-rendered canvases
      this.cycloidalDiskCanvas = document.createElement('canvas');
      this.cdc = this.cycloidalDiskCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      this.cdc.imageSmoothingEnabled = false;

      this.cycloidal_disk_phase2_canvas = document.createElement("canvas");
      this.cdc_2 = this.cycloidal_disk_phase2_canvas.getContext("2d", {
        willReadFrequently: true,
      });
      this.cdc_2.imageSmoothingEnabled = false;

      this.cycloidal_disk_phase3_2_canvas =
        document.createElement("canvas");
      this.cdc_3_2 = this.cycloidal_disk_phase3_2_canvas.getContext("2d", {
        willReadFrequently: true,
      });
      this.cdc_3_2.imageSmoothingEnabled = false;
      this.cycloidal_disk_phase3_3_canvas =
        document.createElement("canvas");
      this.cdc_3_3 = this.cycloidal_disk_phase3_3_canvas.getContext("2d", {
        willReadFrequently: true,
      });
      this.cdc_3_3.imageSmoothingEnabled = false;
      
      this.setupCanvases();
    }
  
    setupCanvases() {
      const size = 500;
      this.canvas.width = size;
      this.canvas.height = size;
      
      this.cycloidalDiskCanvas.width = size * 2;
      this.cycloidalDiskCanvas.height = size * 2;
      this.cycloidal_disk_phase2_canvas.width = size * 2;
      this.cycloidal_disk_phase2_canvas.height = size * 2;
      this.cycloidal_disk_phase3_2_canvas.width = size * 2;
      this.cycloidal_disk_phase3_2_canvas.height = size * 2;
      this.cycloidal_disk_phase3_3_canvas.width = size * 2;
      this.cycloidal_disk_phase3_3_canvas.height = size * 2;

      
      this.ctx.imageSmoothingEnabled = false;
      this.cdc.imageSmoothingEnabled = false;
    }
  
    init() {
      this.calculateParameters();
      this.create_cycloidal_disk();
      this.startAnimation();
    }
  
    calculateParameters() {
      const { 
        fixedRingDiameter, 
        numberOfExternalPins, 
        inputSpeed,
        eccentricity 
      } = this.params;
  
      this.rollerRadius = fixedRingDiameter / numberOfExternalPins;
      this.reductionRatio = numberOfExternalPins - 1;
      this.transmissionRatio = this.reductionRatio / (numberOfExternalPins - this.reductionRatio);
      this.outputSpeed = inputSpeed / this.reductionRatio;
  
      this.scale = (this.canvas.width * 0.8) / fixedRingDiameter;
  
      this.onResultsUpdate({
        transmissionRatio: this.transmissionRatio.toFixed(2),
        outputSpeed: this.outputSpeed.toFixed(4),
        averagePressureAngle: "40.00", // Will calculate properly later
        pressureAngleRange: "5.00"
      });
    }
  
    calculateNextPoint(R, E, Rr, N, theta, DiClearance) {
      const psi = -Math.atan2(
        Math.sin((1 - N) * theta),
        (R - DiClearance) / (E * N) - Math.cos((1 - N) * theta)
      );
      const x = (R - DiClearance) * Math.cos(theta) - Rr * Math.cos(theta - psi) - E * Math.cos(N * theta);
      const y = -(R - DiClearance) * Math.sin(theta) + Rr * Math.sin(theta - psi) + E * Math.sin(N * theta);
      return { x, y };
    }
  
    getContourPoints() {
      const R = this.params.fixedRingDiameter / 2;
      const E = this.params.eccentricity;
      const Rr = this.params.externalPinDiameter / 2;
      const N = this.params.numberOfExternalPins;
      const thetaStep = 0.01;
      const DiOrClearance = this.params.outerRingDiskClearance || 0;
  
      let points = [];
      
      for (let theta = 0; theta <= 2 * Math.PI; theta += thetaStep) {
        let { x, y } = this.calculateNextPoint(R, E, Rr, N, theta, DiOrClearance);
        points.push({ x, y });
      }
  
      // Close the loop
      let { x, y } = this.calculateNextPoint(R, E, Rr, N, 0, DiOrClearance);
      points.push({ x, y });
  
      return points;
    }
  
    getPins() {
      let pins = [];
      const pinCount = this.params.numberOfExternalPins;
      const diameter = this.params.fixedRingDiameter;
      const pinDiameter = this.params.externalPinDiameter;
      
      for (let i = 0; i < pinCount; i++) {
        let angle = ((Math.PI * 2) / pinCount) * i + (Math.PI * 2) / pinCount / 2;
        const x = (diameter / 2) * Math.cos(angle);
        const y = (diameter / 2) * Math.sin(angle);
        const r = pinDiameter / 2;
        pins.push({ x, y, r });
      }
      return pins;
    }
    get_holes(phase, disk) {
      // Get holes for shaft and output pins
      const holes = [];

      // Central shaft hole
      holes.push({
        x: 0,
        y: 0,
        r: this.params.camshaftHole / 2,
      });

      // Output pin holes
      for (let i = 0; i < this.params.numberOfOutputPins; i++) {
        let angle = (2 * Math.PI * i) / this.params.numberOfOutputPins;

        // Apply phase-specific rotations
        if (phase === 2 && disk === 2) angle += Math.PI;
        if (phase === 3 && disk === 2) angle += (4 / 3) * Math.PI;
        if (phase === 3 && disk === 3) angle += (2 / 3) * Math.PI;

        const x = (this.params.outputDiskDiameter / 2) * Math.cos(angle);
        const y = (this.params.outputDiskDiameter / 2) * Math.sin(angle);
        const r =
          // this.disk_op_clearance +
          this.params.eccentricity +
          this.params.outputPinDiameter / 2;

        holes.push({ x, y, r });
      }
      return holes;
    }

    get_contour_holes_and_pins(phase, disk) {

      // Get the contour points and holes
      return {
        contour: this.getContourPoints(),
        holes: this.get_holes(phase, disk),
        pins: this.getPins(),
      };
    }
    computeNormal(a, b, c) {
      // Original function preserved even if STL is commented out.
      const v1 = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
      const v2 = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
      const normal = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x,
      };
      const length = Math.sqrt(
        normal.x ** 2 + normal.y ** 2 + normal.z ** 2
      );
      return {
        x: normal.x / length,
        y: normal.y / length,
        z: normal.z / length,
      };
    }
  
    create_cycloidal_disk() {
      const cx = this.cycloidalDiskCanvas.width / 2;
      const cy = this.cycloidalDiskCanvas.height / 2;

      const { contour, holes, pins } = this.get_contour_holes_and_pins();

      this.cycloidal_disk_pins = pins;

      // Function for shape generator on canvas
      const cycloidalDiskCanvasDrawing = (
        canvasContext,
        holePinsAngle,
        diskColor,
        holeColor
      ) => {
        canvasContext.clearRect(
          0,
          0,
          this.cycloidalDiskCanvas.width,
          this.cycloidalDiskCanvas.height
        );

        canvasContext.beginPath();
        canvasContext.fillStyle = diskColor;
        canvasContext.strokeStyle = "black";
        const s = this.cycloidalDiskCanvas.width / this.diameter; // Original 's' calculation preserved
        for (const [index, point] of contour.entries()) {
          if (!index) {
            canvasContext.moveTo(
              cx + point.x * this.scale,
              cy + point.y * this.scale
            );
          } else
            canvasContext.lineTo(
              cx + point.x * this.scale,
              cy + point.y * this.scale
            );
        }
        for (const [index, hole] of holes.entries()) {
          if (!index) continue; // Skip first hole (camshaft)
          canvasContext.moveTo(
            // Original move logic preserved
            cx +
              (hole.x * Math.cos(holePinsAngle) -
                hole.y * Math.sin(holePinsAngle)) *
                this.scale,
            cy +
              (hole.y * Math.cos(holePinsAngle) +
                hole.x * Math.sin(holePinsAngle)) *
                this.scale
          );
          canvasContext.arc(
            // Original arc logic preserved
            cx +
              (hole.x * Math.cos(holePinsAngle) -
                hole.y * Math.sin(holePinsAngle)) *
                this.scale,
            cy +
              (hole.y * Math.cos(holePinsAngle) +
                hole.x * Math.sin(holePinsAngle)) *
                this.scale,
            hole.r * this.scale,
            0,
            Math.PI * 2,
            false
          );
        }
        canvasContext.fill();

        {
          // paint the shaft (first hole in `holes` array)
          canvasContext.beginPath();
          canvasContext.arc(
            cx,
            cy,
            holes[0].r * this.scale,
            0,
            Math.PI * 2,
            false
          );
          canvasContext.fillStyle = holeColor;
          canvasContext.fill();
        }
      };

      // Drawing calls for each phase's disk
      cycloidalDiskCanvasDrawing(this.cdc, 0, "blue", "green");
      cycloidalDiskCanvasDrawing(
        this.cdc_2,
        Math.PI,
        "aquamarine",
        "green"
      );
      cycloidalDiskCanvasDrawing(
        this.cdc_3_2,
        (Math.PI * 4) / 3,
        "cyan",
        "green"
      );
      cycloidalDiskCanvasDrawing(
        this.cdc_3_3,
        (Math.PI * 2) / 3,
        "darkcyan",
        "green"
      );
    }

    render() {
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Calculate animation timing
      const now = performance.now();
      let inputAngleStep = 0;
      if (this.lastSpeedTime !== -1) {
        const delta = now - this.lastSpeedTime;
        inputAngleStep = (delta * this.params.inputSpeed) / 2000;
      }
      this.lastSpeedTime = now;
      this.inputAngle += inputAngleStep;
      
      const outputAngle = -this.inputAngle / this.transmissionRatio + Math.PI / this.transmissionRatio;
      const diskOffset = this.params.eccentricity * this.scale;
      
      const ex = cx + diskOffset * Math.cos(this.inputAngle);
      const ey = cy + diskOffset * Math.sin(this.inputAngle);
      const ex_2 = cx + diskOffset * Math.cos(this.inputAngle + Math.PI);
      const ey_2 = cy + diskOffset * Math.sin(this.inputAngle + Math.PI);

      const ex_3_2 =
        cx + diskOffset * Math.cos(this.inputAngle + (Math.PI * 2) / 3);
      const ey_3_2 =
        cy + diskOffset * Math.sin(this.inputAngle + (Math.PI * 2) / 3);
      const ex_3_3 =
        cx + diskOffset * Math.cos(this.inputAngle + (Math.PI * 4) / 3);
      const ey_3_3 =
        cy + diskOffset * Math.sin(this.inputAngle + (Math.PI * 4) / 3);

      // Draw output disk
      const outputDiskRadius = (this.params.outputDiskDiameter * this.scale) / 2;
      this.ctx.beginPath();
      this.ctx.fillStyle = 'grey';
      this.ctx.arc(cx, cy, outputDiskRadius, 0, Math.PI * 2);
      this.ctx.fill();
  
      
  
      // Draw cycloidal disk
      let selectedPhase = this.params.phase;
      this.ctx.save();
      this.ctx.translate(ex, ey);
      this.ctx.rotate(outputAngle);
      this.ctx.drawImage(
        this.cycloidalDiskCanvas,
        -this.cycloidalDiskCanvas.width / 2,
        -this.cycloidalDiskCanvas.height / 2
      );
      this.ctx.restore();
      // 2nd Disk of Phase 2
      if (selectedPhase == 2) {
        this.ctx.save();
        this.ctx.translate(ex_2, ey_2);
        this.ctx.rotate(outputAngle + Math.PI);
        this.ctx.drawImage(
          this.cycloidal_disk_phase2_canvas,
          -this.cycloidal_disk_phase2_canvas.width / 2,
          -this.cycloidal_disk_phase2_canvas.height / 2
        );
        this.ctx.restore();
      }

      // 2nd and 3rd Disk of Phase 3
      if (selectedPhase == 3) {
        this.ctx.save();
        this.ctx.translate(ex_3_2, ey_3_2);
        this.ctx.rotate(outputAngle + (Math.PI * 2) / 3);
        this.ctx.drawImage(
          this.cycloidal_disk_phase3_2_canvas,
          -this.cycloidal_disk_phase3_2_canvas.width / 2,
          -this.cycloidal_disk_phase3_2_canvas.height / 2
        );
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(ex_3_3, ey_3_3);
        this.ctx.rotate(outputAngle + (Math.PI * 4) / 3);
        this.ctx.drawImage(
          this.cycloidal_disk_phase3_3_canvas,
          -this.cycloidal_disk_phase3_3_canvas.width / 2,
          -this.cycloidal_disk_phase3_3_canvas.height / 2
        );
        this.ctx.restore();
      }
  
      // Draw input shaft
      const shaftRadius = Math.max(0, (this.params.camshaftHole * this.scale - diskOffset * 2) / 2);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, shaftRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'orange';
      this.ctx.fill();
  
      // Draw fixed pins (outer ring)
      if (this.cycloidal_disk_pins) {
        this.cycloidal_disk_pins.forEach(pin => {
          this.ctx.beginPath();
          this.ctx.fillStyle = 'black';
          this.ctx.arc(cx + this.scale * pin.x, cy + this.scale * pin.y, this.scale * pin.r, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }
      // Draw output pins
      const outputPinRadius = (this.params.outputPinDiameter * this.scale) / 2;
      for (let i = 0; i < this.params.numberOfOutputPins; i++) {
        const angle = (2 * Math.PI * i) / this.params.numberOfOutputPins;
        const x = cx + (this.params.outputDiskDiameter / 2) * this.scale * Math.cos(outputAngle + angle);
        const y = cy + (this.params.outputDiskDiameter / 2) * this.scale * Math.sin(outputAngle + angle);
        
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.arc(x, y, outputPinRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    check_value_limits(R, E, Rr, N, Ro, Ri, Ni, CH, DiOrC) {
      /*
            Input: User set values
            Purpose: Check against MAX/MIN limits
            Output: Updated values if outside limits
        */
      // ----------------------------
      // Check R, cannot be zero or negative
      if (R <= 0) R = 10;
      // ----------------------------
      // Check N & Rr values (external pins)
      const Nmin = 6; // min number of rollers
      const Rrmax = R * 0.3; // set upper boundary
      if (N < Nmin) N = Nmin;
      if (Rr <= 0)
        Rr = R * 0.1; // Rr cannot be zero, set it proportional to R
      else if (Rr > Rrmax) Rr = Rrmax;
      let perimeter = 2 * R * Math.PI; // perimeter of ring diameter
      let RollerPerimeter = 2 * Rr * N; // Pseudo perimeter from roller diameters
      while (!(RollerPerimeter < perimeter)) {
        // Roller Perimeter cannot be larger than actual perimeter from Ring Diameter
        // Need to either decres N, or decrease Rr
        // First try to decrease N
        while (N > Nmin) {
          N--; // decrease N by 1
          RollerPerimeter = 2 * Rr * N; // recalculate perimeter
          if (RollerPerimeter < perimeter) break; // exit loop
        }
        // Then, If N has reached min value possible, start decreasing Rr
        Rr = Rr * 0.9;
        RollerPerimeter = 2 * Rr * N; // recalculate perimeter
      }
      // ----------------------------
      // Check E value
      const Emax = 0.9 * (R / N);
      const Emin = 0;
      if (E >= Emax) E = Emax;
      else if (E <= Emin) E = R * 0.05; // Proportional to R if reaches min value
      // ----------------------------
      // Check CH, camshaft hole
      const CHmin = E * 1.5;
      const CHmax = R * 0.4;
      if (CH < CHmin) CH = CHmin;
      else if (CH > CHmax) CH = CHmax;
      // ----------------------------
      // Sanity check Ni (# internal pins)
      const Nimin = 3; // min number of internal pins
      if (Ni < Nimin) Ni = Nimin;
      // Sanity check Ri (internal pins radius)
      if (Ri <= 0) Ri = R * 0.05; // Ri cannot be zero, set as proportional to outer diameter
      const Rimax = (0.5 * (R - Rr - CH)) / 2; // Available space in disc between center hole and outer perimeter
      if (Ri > Rimax) Ri = Rimax;
      // ----------------------------
      // Check Ro
      let Rh = Ri + E; // Recalculate Hole Radius
      const Romax = (R - Rr - Rh) * 0.8;
      let Romin = (CH + Rh) * 1.05;
      if (Romin > Romax) Romin = Romax; // consider corner case, when MIN > MAX
      if (Ro > Romax) Ro = Romax;
      else if (Ro < Romin) Ro = Romin;
      // ----------------------------
      // Check Ni (number of internal pins)
      Rh = Ri + E; // Recalculate Hole Radius
      let Ro_circumference = 2 * Math.PI * Ro;
      let Hole_circumference = 2 * Rh * Ni;
      while (!(Hole_circumference < Ro_circumference)) {
        // Reduce number of internal pins
        while (Ni > Nimin) {
          Ni--;
          Hole_circumference = 2 * Rh * Ni; // recalculate
          if (Hole_circumference < Ro_circumference) break;
        }
        // If N has reached minimum, decrease Ri
        Ri = Ri * 0.95;
        Rh = Ri + E; // Recalculate Hole Radius
        Hole_circumference = 2 * Rh * Ni; // recalculate
      }
      //
      let phase1Btn = this.ui.phase_1_btn; // Original code directly accessed global, now via this.ui
      phase1Btn.checked = true;
      // ----------------------------
      // Check Clearance between Disk and Outer Ring Diameter
      const maxC = R - Rr - Ro - Rh - E;
      DiOrC = DiOrC < 0 ? 0 : DiOrC > maxC ? maxC : DiOrC;
      // ----------------------------

      return {
        newR: R,
        newE: E,
        newN: N,
        newRr: Rr,
        newRo: Ro,
        newRi: Ri,
        newNi: Ni,
        newCH: CH,
        newDiOrC: DiOrC,
      };
    }

    startAnimation() {
      const animate = () => {
        this.render();
        this.animationId = requestAnimationFrame(animate);
      };
      animate();
    }
  
    updateParams(newParams) {
      this.params = { ...this.params, ...newParams };
      this.calculateParameters();
      this.create_cycloidal_disk();
    }
  
    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }