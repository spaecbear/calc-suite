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
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

export default function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<string | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [justEvaled, setJustEvaled] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const compute = (a: string, b: string, operation: Op): string => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return "Error";
    switch (operation) {
      case "+": return fmt(String(x + y));
      case "-": return fmt(String(x - y));
      case "×": return fmt(String(x * y));
      case "÷": return y === 0 ? "Error" : fmt(String(x / y));
      default: return b;
    }
  };

  const handleInput = useCallback((btn: string) => {
    if (btn === "C") {
      setDisplay("0");
      setStored(null);
      setOp(null);
      setJustEvaled(false);
      setWaitingForOperand(false);
      return;
    }

    if (btn === "⌫") {
      if (display === "Error" || waitingForOperand) { setDisplay("0"); return; }
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }

    if (btn === "+/-") {
      if (display === "0" || display === "Error") return;
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
      return;
    }

    if (btn === "%") {
      const num = parseFloat(display);
      if (!isNaN(num)) setDisplay(fmt(String(num / 100)));
      return;
    }

    if (["÷", "×", "-", "+"].includes(btn)) {
      // Chain: if there's already a pending op and we have fresh input, compute first
      if (op && stored !== null && !waitingForOperand) {
        const result = compute(stored, display, op);
        setStored(result);
        setDisplay(result);
      } else {
        setStored(display);
      }
      setOp(btn as Op);
      setJustEvaled(false);
      setWaitingForOperand(true);
      return;
    }

    if (btn === "=") {
      if (op && stored !== null) {
        const result = compute(stored, display, op);
        setDisplay(result);
        setStored(null);
        setOp(null);
        setJustEvaled(true);
        setWaitingForOperand(false);
      }
      return;
    }

    // Decimal point
    if (btn === ".") {
      const base = waitingForOperand || justEvaled ? "0" : display;
      if (!base.includes(".")) {
        setDisplay(base === "Error" ? "0." : base + ".");
        setJustEvaled(false);
        setWaitingForOperand(false);
      }
      return;
    }

    // Digit
    const replaceDisplay = waitingForOperand || justEvaled || display === "0" || display === "Error";
    const next = replaceDisplay ? btn : display + btn;
    if (next.replace(".", "").replace("-", "").length > 12) return;
    setDisplay(next);
    setJustEvaled(false);
    setWaitingForOperand(false);
  }, [display, stored, op, justEvaled, waitingForOperand]);

  // Keyboard support
  useEffect(() => {
    const map: Record<string, string> = {
      "0":"0","1":"1","2":"2","3":"3","4":"4",
      "5":"5","6":"6","7":"7","8":"8","9":"9",
      ".":".", "Enter":"=", "=":"=",
      "+":"+", "-":"-", "*":"×", "/":"÷",
      "Backspace":"⌫", "Escape":"C", "%":"%",
    };
    const handler = (e: KeyboardEvent) => {
      const btn = map[e.key];
      if (btn) { e.preventDefault(); handleInput(btn); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleInput]);

  const isOpBtn = (btn: string) => ["÷", "×", "-", "+"].includes(btn);
  const isActive = (btn: string) => btn === op && stored !== null && waitingForOperand;

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      {/* Display */}
      <div className="px-5 pt-6 pb-4" style={{ background: "var(--muted)" }}>
        <div className="text-right h-5 mb-1">
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

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-px p-px" style={{ background: "var(--card-border)" }}>
        {BUTTONS.flat().map((btn, i) => {
          const isEq = btn === "=";
          const isOp = isOpBtn(btn);
          const isFn = ["C", "+/-", "%"].includes(btn);
          const isDel = btn === "⌫";
          const active = isActive(btn);

          let bg = "var(--card)";
          let color = "var(--foreground)";

          if (isEq)        { bg = "var(--accent)"; color = "#fff"; }
          else if (active) { bg = "var(--accent)"; color = "#fff"; }
          else if (isOp)   { bg = "var(--card)";   color = "var(--accent)"; }
          else if (isFn || isDel) { bg = "var(--muted)"; color = "var(--muted-foreground)"; }

          return (
            <button
              key={i}
              onClick={() => handleInput(btn)}
              className="flex items-center justify-center h-16 text-lg font-medium transition-opacity active:opacity-60 hover:opacity-80 select-none"
              style={{ background: bg, color }}
            >
              {btn === "⌫" ? <Delete size={18} /> : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
