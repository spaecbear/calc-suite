"use client";

import { useState, useCallback, useEffect } from "react";
import { Delete } from "lucide-react";

type Op = "+" | "-" | "×" | "÷" | null;

function fmt(val: string): string {
  if (val === "Error") return val;
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return parseFloat(num.toPrecision(10)).toString();
}

const BUTTONS = [
  ["C", "+/-", "%", "÷"],
  ["7", "8",   "9", "×"],
  ["4", "5",   "6", "-"],
  ["1", "2",   "3", "+"],
  ["0", ".",   "⌫", "="],
];

export default function BasicCalculator() {
  const [display, setDisplay]               = useState("0");
  const [stored, setStored]                 = useState<string | null>(null);
  const [op, setOp]                         = useState<Op>(null);
  const [justEvaled, setJustEvaled]         = useState(false);
  const [waitingForOperand, setWaiting]     = useState(false);

  const compute = (a: string, b: string, operation: Op): string => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return "Error";
    switch (operation) {
      case "+": return fmt(String(x + y));
      case "-": return fmt(String(x - y));
      case "×": return fmt(String(x * y));
      case "÷": return y === 0 ? "Error" : fmt(String(x / y));
      default:  return b;
    }
  };

  const handleInput = useCallback((btn: string) => {
    if (btn === "C")    { setDisplay("0"); setStored(null); setOp(null); setJustEvaled(false); setWaiting(false); return; }
    if (btn === "⌫")   { if (display === "Error" || waitingForOperand) { setDisplay("0"); return; } setDisplay(display.length > 1 ? display.slice(0, -1) : "0"); return; }
    if (btn === "+/-")  { if (display !== "0" && display !== "Error") setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display); return; }
    if (btn === "%")    { const n = parseFloat(display); if (!isNaN(n)) setDisplay(fmt(String(n / 100))); return; }

    if (["÷","×","-","+"].includes(btn)) {
      if (op && stored !== null && !waitingForOperand) { const r = compute(stored, display, op); setStored(r); setDisplay(r); }
      else { setStored(display); }
      setOp(btn as Op); setJustEvaled(false); setWaiting(true); return;
    }

    if (btn === "=") {
      if (op && stored !== null) { const r = compute(stored, display, op); setDisplay(r); setStored(null); setOp(null); setJustEvaled(true); setWaiting(false); }
      return;
    }

    if (btn === ".") {
      const base = waitingForOperand || justEvaled ? "0" : display;
      if (!base.includes(".")) { setDisplay(base === "Error" ? "0." : base + "."); setJustEvaled(false); setWaiting(false); }
      return;
    }

    const replace = waitingForOperand || justEvaled || display === "0" || display === "Error";
    const next = replace ? btn : display + btn;
    if (next.replace(".", "").replace("-", "").length > 12) return;
    setDisplay(next); setJustEvaled(false); setWaiting(false);
  }, [display, stored, op, justEvaled, waitingForOperand]);

  useEffect(() => {
    const map: Record<string, string> = {
      "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
      ".":".", "Enter":"=", "=":"=", "+":"+", "-":"-", "*":"×", "/":"÷",
      "Backspace":"⌫", "Escape":"C", "%":"%",
    };
    const handler = (e: KeyboardEvent) => { const b = map[e.key]; if (b) { e.preventDefault(); handleInput(b); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleInput]);

  const isOpBtn  = (btn: string) => ["÷","×","-","+"].includes(btn);
  const isActive = (btn: string) => btn === op && stored !== null && waitingForOperand;

  return (
    // flex-col so this fills whatever height the parent gives it
    <div className="flex flex-col h-full" style={{ background: "var(--card)" }}>

      {/* Display */}
      <div className="px-5 pt-5 pb-4 shrink-0" style={{ background: "var(--muted)" }}>
        <div className="h-5 text-right mb-1">
          {stored && op && (
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {stored} {op}
            </span>
          )}
        </div>
        <div
          className="text-right font-mono font-semibold leading-none overflow-hidden"
          style={{
            color: display === "Error" ? "#ef4444" : "var(--foreground)",
            fontSize: display.length > 10 ? "1.75rem" : display.length > 7 ? "2.25rem" : "3rem",
          }}
        >
          {display}
        </div>
      </div>

      {/* Button grid — flex rows that stretch to fill remaining height */}
      <div
        className="flex-1 flex flex-col"
        style={{ gap: 1, background: "var(--card-border)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="flex flex-1" style={{ gap: 1 }}>
            {row.map((btn) => {
              const isEq  = btn === "=";
              const isOp  = isOpBtn(btn);
              const isFn  = ["C", "+/-", "%"].includes(btn);
              const isDel = btn === "⌫";
              const active = isActive(btn);

              let bg    = "var(--card)";
              let color = "var(--foreground)";
              if (isEq)             { bg = "var(--accent)"; color = "#fff"; }
              else if (active)      { bg = "var(--accent)"; color = "#fff"; }
              else if (isOp)        { color = "var(--accent)"; }
              else if (isFn||isDel) { bg = "var(--muted)"; color = "var(--muted-foreground)"; }

              return (
                <button
                  key={btn + ri}
                  onClick={() => handleInput(btn)}
                  className="flex-1 flex items-center justify-center text-xl font-medium transition-opacity active:opacity-50 select-none"
                  style={{ background: bg, color }}
                >
                  {btn === "⌫" ? <Delete size={20} /> : btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
