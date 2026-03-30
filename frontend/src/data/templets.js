export const TEMPLATES = [
  {
    name: "Production Planning",
    icon: "🏭",
    tag: "Classic LP",
    desc: "Maximize profit from two products given limited machine & labor hours.",
    problem: {
      numVars: 2,
      isMaximize: true,
      objCoeffs: [5, 4],
      varLabels: ["Product A", "Product B"],
      constraints: [
        { coeffs: [6, 4], type: "<=", rhs: 24, label: "Machine Hours" },
        { coeffs: [1, 2], type: "<=", rhs: 6, label: "Labor Hours" },
      ],
    },
  },
  {
    name: "Budget Allocation",
    icon: "💰",
    tag: "Finance",
    desc: "Optimize college fest budget across Marketing, Events & Logistics to maximize impact.",
    problem: {
      numVars: 3,
      isMaximize: true,
      objCoeffs: [15, 10, 12],
      varLabels: ["Marketing", "Events", "Logistics"],
      constraints: [
        { coeffs: [3, 2, 4], type: "<=", rhs: 120, label: "Total Budget (₹K)" },
        { coeffs: [1, 1, 0], type: "<=", rhs: 30, label: "Personnel Hours" },
        { coeffs: [0, 1, 2], type: "<=", rhs: 50, label: "Venue & Equipment" },
      ],
    },
  },
  {
    name: "Marketing Mix",
    icon: "📢",
    tag: "Strategy",
    desc: "Maximize audience reach by splitting spend between TV and Digital advertising.",
    problem: {
      numVars: 2,
      isMaximize: true,
      objCoeffs: [8, 12],
      varLabels: ["TV Ads (₹K)", "Digital Ads (₹K)"],
      constraints: [
        { coeffs: [1, 2], type: "<=", rhs: 100, label: "Total Budget" },
        { coeffs: [3, 1], type: "<=", rhs: 90, label: "Creative Hours" },
        { coeffs: [1, 3], type: ">=", rhs: 30, label: "Min Digital Reach" },
      ],
    },
  },
  {
    name: "Supply Chain",
    icon: "🚚",
    tag: "Operations",
    desc: "Minimize transportation cost across 2 warehouses serving 2 demand centers.",
    problem: {
      numVars: 2,
      isMaximize: false,
      objCoeffs: [4, 6],
      varLabels: ["Route W1→C1", "Route W2→C1"],
      constraints: [
        { coeffs: [1, 1], type: ">=", rhs: 50, label: "Demand Center 1" },
        { coeffs: [2, 1], type: "<=", rhs: 120, label: "Warehouse W1 Cap" },
      ],
    },
  },
];