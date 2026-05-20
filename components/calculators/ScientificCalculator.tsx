"use client";

import { useState, useCallback, useEffect } from "react";

type AngleMode = "DEG" | "RAD";
interface BtnConfig { label: string; color?: "accent" | "op" | "fn" | "num" }

const BUTTONS: BtnConfig[][] = [
  [
    { label: "DEG/RAD", color: "fn" },
    { label: "(",       color: "fn" },
    { label: ")",       color: "fn" },
    { label: "MC",      color: "fn" },
    { label: "MR",      color: "fn" },
  ],
  [
    { label: "sin",   color: "fn" },
    { label: "cos",   color: "fn" },
    { label: "tan",   color: "fn" },
    { label: "π",     color: "fn" },
    { label: "e",     color: "fn" },
  ],
  [
    { label: "sin⁻¹", color: "fn" },
    { label: "cos⁻¹", color: "fn" },
    { label: "tan⁻¹", color: "fn" },
    { label: "log",   color: "fn" },
    { label: "ln",    color: "fn" },
  ],
  [
    { label: "x²",  color: "fn" },
    { label: "x³",  color: "fn" },
    { label: "xʸ",  color: "fn" },
    { label: "√",   color: "fn" },
    { label: "1/x", color: "fn" },
  ],
  [
    { label: "C",  color: "accent" },
    { label: "⌫",  color: "accent" },
    { label: "%",  color: "op" },
    { label: "÷",  color: "op" },
  ],
  [
    { label: "7", color: "num" }, { label: "8", color: "num" },
    { label: "9", color: "num" }, { label: "×", color: "op" },
  ],
  [
    { label: "4", color: "num" }, { label: "5", color: "num" },
    { label: "6", color: "num" }, { label: "−", color: "op" },
  ],
  [
    { label: "1", color: "num" }, { label: "2", color: "num" },
    { label: "3", color: "num" }, { label: "+", color: "op" },
  ],
  [
    { label: "+/−", color: "num" }, { label: "0", color: "num" },
    { label: ".",   color: "num" }, { label: "=", color: "accent" },
  ],
];

function toRad(deg: number) { return deg * (Math.PI / 180); }

export default function ScientificCalculator() {
  const [display, setDisplay]     = useState("0");
  const [expr, setExpr]           = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [memory, setMemory]       = useState(0);
  const [waitingOp, setWaitingOp] = useState(false);
  const [pendingXy, setPendingXy] = useState(false);
  const [xyBase, setXyBase]       = useState(0);
  const [error, setError]         = useState(false);

  const angle = useCallback(
    (deg: number) => angleMode === "DEG" ? toRad(deg) : deg,
    [angleMode]
  );

  function applyFn(label: string, val: number): number | null {
    const a = angle(val);
    switch (label) {
      case "sin":   return Math.sin(a);
      case "cos":   return Math.cos(a);
      case "tan":   return Math.tan(a);
      case "sin⁻¹": return angleMode === "DEG" ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
      case "cos⁻¹": return angleMode === "DEG" ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
      case "tan⁻¹": return angleMode === "DEG" ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
      case "log": return Math.log10(val);
      case "ln":  return Math.log(val);
      case "x²":  return val * val;
      case "x³":  return val * val * val;
      case "√":   return Math.sqrt(val);
      case "1/x": return 1 / val;
      default: return null;
    }
  }

  const fmt = (n: number) => {
    if (!isFinite(n)) return "Error";
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    return parseFloat(n.toPrecision(10)).toString();
  };

  function handleInput(label: string) {
    if (error && label !== "C") return;
    if (label === "MC") { setMemory(0); return; }
    if (label === "MR") { setDisplay(fmt(memory)); setWaitingOp(false); return; }
    if (label === "DEG/RAD") { setAngleMode((m) => m === "DEG" ? "RAD" : "DEG"); return; }
    if (label === "C") { setDisplay("0"); setExpr(""); setWaitingOp(false); setPendingXy(false); setError(false); return; }
    if (label === "⌫") { setDisplay((d) => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (label === "π") { setDisplay(fmt(Math.PI)); setWaitingOp(false); return; }
    if (label === "e") { setDisplay(fmt(Math.E)); setWaitingOp(false); return; }

    const unary = applyFn(label, parseFloat(display));
    if (unary !== null) {
      if (!isFinite(unary)) { setDisplay("Error"); setError(true); return; }
      setDisplay(fmt(unary)); setWaitingOp(false); return;
    }

    if (label === "xʸ") { setXyBase(parseFloat(display)); setPendingXy(true); setWaitingOp(true); setExpr(`${display} ^ `); return; }
    if (label === "+/−") { setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d); return; }

    if (["+", "−", "×", "÷", "%"].includes(label)) {
      setExpr(`${display} ${label} `); setWaitingOp(true); return;
    }

    if (label === "=") {
      if (pendingXy) {
        const res = Math.pow(xyBase, parseFloat(display));
        setDisplay(fmt(res)); setExpr(""); setPendingXy(false); setWaitingOp(false); return;
      }
      if (!expr) return;
      try {
        const parts = expr.trim().split(" ");
        const left = parseFloat(parts[0]), op = parts[1], right = parseFloat(display);
        let res: number;
        if (op === "+") res = left + right;
        else if (op === "−") res = left - right;
        else if (op === "×") res = left * right;
        else if (op === "÷") { if (right === 0) { setDisplay("Error"); setError(true); return; } res = left / right; }
        else if (op === "%") res = left % right;
        else return;
        setDisplay(fmt(res)); setExpr(""); setWaitingOp(false); setMemory(res);
      } catch { setDisplay("Error"); setError(true); }
      return;
    }

    if (label === "(" || label === ")") { setDisplay((d) => d === "0" ? label : d + label); return; }
    if (label === ".") {
      if (waitingOp) { setDisplay("0."); setWaitingOp(false); return; }
      if (!display.includes(".")) setDisplay((d) => d + ".");
      return;
    }
    if (waitingOp) { setDisplay(label); setWaitingOp(false); }
    else setDisplay((d) => d === "0" ? label : d + label);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−", Backspace: "⌫", Enter: "=", Escape: "C" };
      const label = map[e.key] ?? e.key;
      if ("0123456789.+-=×÷−%()".includes(label) || ["⌫","C","="].includes(label)) {
        e.preventDefault(); handleInput(label);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const btnStyle = (color: BtnConfig["color"]) => {
    if (color === "accent") return { background: "var(--accent)", color: "#fff" };
    if (color === "op")     return { background: "var(--muted)", color: "var(--accent)" };
    if (color === "fn")     return { background: "var(--muted)", color: "var(--foreground)" };
    return { background: "var(--card)", color: "var(--foreground)" };
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: "var(--card)" }}>

      {/* Display — ~22% of height, number sits bottom-right */}
      <div
        className="flex flex-col justify-end px-5 pb-4"
        style={{ flex: "0 0 22%", background: "var(--muted)" }}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {angleMode}
          </span>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {expr || " "}
          </span>
        </div>
        <p
          className="text-right font-mono font-bold leading-none truncate"
          style={{
            color: error ? "#ef4444" : "var(--foreground)",
            fontSize: display.length > 14 ? "1.5rem" : display.length > 10 ? "1.875rem" : "2.5rem",
          }}
        >
          {display}
        </p>
      </div>

      {/* Button grid — each row flex-1, each button flex-1 */}
      <div
        className="flex-1 flex flex-col"
        style={{ gap: 1, background: "var(--card-border)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="flex flex-1" style={{ gap: 1 }}>
            {row.map(({ label, color }) => (
              <button
                key={label + ri}
                onClick={() => handleInput(label)}
                className="flex-1 flex items-center justify-center font-semibold transition-opacity active:opacity-50 select-none"
                style={{
                  ...btnStyle(color),
                  fontSize: row.length === 5 ? "11px" : "15px",
                }}
              >
                {label === "DEG/RAD" ? angleMode : label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
