"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/Card";

type AngleMode = "DEG" | "RAD";

interface BtnConfig { label: string; wide?: boolean; color?: "accent" | "op" | "fn" | "num" }

const BUTTONS: BtnConfig[][] = [
  [
    { label: "DEG/RAD", wide: false, color: "fn" },
    { label: "(",  color: "fn" },
    { label: ")",  color: "fn" },
    { label: "MC", color: "fn" },
    { label: "MR", color: "fn" },
  ],
  [
    { label: "sin",  color: "fn" },
    { label: "cos",  color: "fn" },
    { label: "tan",  color: "fn" },
    { label: "π",    color: "fn" },
    { label: "e",    color: "fn" },
  ],
  [
    { label: "sin⁻¹", color: "fn" },
    { label: "cos⁻¹", color: "fn" },
    { label: "tan⁻¹", color: "fn" },
    { label: "log",  color: "fn" },
    { label: "ln",   color: "fn" },
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
    { label: "7", color: "num" }, { label: "8", color: "num" }, { label: "9", color: "num" }, { label: "×", color: "op" },
  ],
  [
    { label: "4", color: "num" }, { label: "5", color: "num" }, { label: "6", color: "num" }, { label: "−", color: "op" },
  ],
  [
    { label: "1", color: "num" }, { label: "2", color: "num" }, { label: "3", color: "num" }, { label: "+", color: "op" },
  ],
  [
    { label: "+/−", color: "num" }, { label: "0", color: "num" }, { label: ".", color: "num" }, { label: "=", color: "accent" },
  ],
];

function toRad(deg: number) { return deg * (Math.PI / 180); }

export default function ScientificCalculator() {
  const [display, setDisplay]       = useState("0");
  const [expr, setExpr]             = useState("");
  const [angleMode, setAngleMode]   = useState<AngleMode>("DEG");
  const [memory, setMemory]         = useState(0);
  const [waitingOp, setWaitingOp]   = useState(false);
  const [pendingXy, setPendingXy]   = useState(false);
  const [xyBase, setXyBase]         = useState(0);
  const [error, setError]           = useState(false);

  const angle = useCallback((deg: number) => angleMode === "DEG" ? toRad(deg) : deg, [angleMode]);

  function applyFn(label: string, val: number): number | null {
    const a = angle(val);
    switch (label) {
      case "sin":   return Math.sin(a);
      case "cos":   return Math.cos(a);
      case "tan":   return Math.tan(a);
      case "sin⁻¹": return angleMode === "DEG" ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
      case "cos⁻¹": return angleMode === "DEG" ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
      case "tan⁻¹": return angleMode === "DEG" ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
      case "log":  return Math.log10(val);
      case "ln":   return Math.log(val);
      case "x²":   return val * val;
      case "x³":   return val * val * val;
      case "√":    return Math.sqrt(val);
      case "1/x":  return 1 / val;
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

    // Memory
    if (label === "MC") { setMemory(0); return; }
    if (label === "MR") {
      setDisplay(fmt(memory));
      setWaitingOp(false);
      return;
    }

    // Mode
    if (label === "DEG/RAD") {
      setAngleMode((m) => (m === "DEG" ? "RAD" : "DEG"));
      return;
    }

    // Clear
    if (label === "C") {
      setDisplay("0"); setExpr(""); setWaitingOp(false); setPendingXy(false); setError(false);
      return;
    }

    // Backspace
    if (label === "⌫") {
      if (display.length > 1) setDisplay((d) => d.slice(0, -1));
      else setDisplay("0");
      return;
    }

    // Constants
    if (label === "π") { setDisplay(fmt(Math.PI)); setWaitingOp(false); return; }
    if (label === "e") { setDisplay(fmt(Math.E)); setWaitingOp(false); return; }

    // Unary fns
    const unary = applyFn(label, parseFloat(display));
    if (unary !== null) {
      if (!isFinite(unary)) { setDisplay("Error"); setError(true); return; }
      setDisplay(fmt(unary)); setWaitingOp(false); return;
    }

    // xʸ — set base, wait for exponent
    if (label === "xʸ") {
      setXyBase(parseFloat(display));
      setPendingXy(true);
      setWaitingOp(true);
      setExpr(`${display} ^ `);
      return;
    }

    // +/−
    if (label === "+/−") {
      setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d);
      return;
    }

    // Operators
    if (["+", "−", "×", "÷", "%"].includes(label)) {
      setExpr(`${display} ${label} `);
      setWaitingOp(true);
      return;
    }

    // Equals
    if (label === "=") {
      if (pendingXy) {
        const exp = parseFloat(display);
        const res = Math.pow(xyBase, exp);
        setDisplay(fmt(res)); setExpr(""); setPendingXy(false); setWaitingOp(false);
        return;
      }
      if (!expr) return;
      try {
        const parts = expr.trim().split(" ");
        const left = parseFloat(parts[0]);
        const op   = parts[1];
        const right = parseFloat(display);
        let res: number;
        if (op === "+") res = left + right;
        else if (op === "−") res = left - right;
        else if (op === "×") res = left * right;
        else if (op === "÷") { if (right === 0) { setDisplay("Error"); setError(true); return; } res = left / right; }
        else if (op === "%") res = left % right;
        else return;
        setDisplay(fmt(res)); setExpr(""); setWaitingOp(false);
        setMemory(res); // auto-save to memory
      } catch { setDisplay("Error"); setError(true); }
      return;
    }

    // Digit / decimal / parens
    if (label === "(" || label === ")") {
      setDisplay((d) => (d === "0" ? label : d + label));
      return;
    }
    if (label === ".") {
      if (waitingOp) { setDisplay("0."); setWaitingOp(false); return; }
      if (!display.includes(".")) setDisplay((d) => d + ".");
      return;
    }
    // Digit
    if (waitingOp) { setDisplay(label); setWaitingOp(false); }
    else setDisplay((d) => d === "0" ? label : d + label);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−", Backspace: "⌫", Enter: "=", Escape: "C" };
      const label = map[e.key] ?? e.key;
      const valid = "0123456789.+-=×÷−%()";
      if (valid.includes(label) || ["⌫", "C", "="].includes(label)) {
        e.preventDefault();
        handleInput(label);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const btnStyle = (color: BtnConfig["color"]) => {
    if (color === "accent") return { background: "var(--accent)", color: "#fff" };
    if (color === "op")     return { background: "var(--muted)", color: "var(--accent)" };
    if (color === "fn")     return { background: "var(--muted)", color: "var(--foreground)", fontSize: "11px" };
    return { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--card-border)" };
  };

  return (
    <Card className="!p-3">
      {/* Display */}
      <div
        className="rounded-xl px-4 py-3 mb-3 text-right"
        style={{ background: "var(--muted)" }}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: "var(--accent)", color: "#fff" }}>
            {angleMode}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{expr || " "}</span>
        </div>
        <p
          className="font-mono font-bold truncate"
          style={{
            color: error ? "#ef4444" : "var(--foreground)",
            fontSize: display.length > 14 ? "16px" : display.length > 10 ? "20px" : "28px",
          }}
        >
          {display}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-1.5">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
            {row.map(({ label, color }) => (
              <button
                key={label}
                onClick={() => handleInput(label)}
                className="rounded-xl py-3 text-sm font-semibold transition-opacity active:opacity-60 hover:opacity-80"
                style={btnStyle(color)}
              >
                {label === "DEG/RAD" ? angleMode : label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
