// utils/parameterValidation.js
export function checkValueLimits(R, E, Rr, N, Ro, Ri, Ni, CH, DiOrC) {
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
