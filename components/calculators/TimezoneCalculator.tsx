"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";

// Curated list of common IANA timezones with friendly labels
const TIMEZONES = [
  { label: "UTC",                      tz: "UTC" },
  { label: "New York (ET)",            tz: "America/New_York" },
  { label: "Chicago (CT)",             tz: "America/Chicago" },
  { label: "Denver (MT)",              tz: "America/Denver" },
  { label: "Los Angeles (PT)",         tz: "America/Los_Angeles" },
  { label: "Anchorage (AKT)",          tz: "America/Anchorage" },
  { label: "Honolulu (HT)",            tz: "Pacific/Honolulu" },
  { label: "Toronto",                  tz: "America/Toronto" },
  { label: "São Paulo",                tz: "America/Sao_Paulo" },
  { label: "Buenos Aires",             tz: "America/Argentina/Buenos_Aires" },
  { label: "London (GMT/BST)",         tz: "Europe/London" },
  { label: "Paris / Berlin (CET)",     tz: "Europe/Paris" },
  { label: "Helsinki (EET)",           tz: "Europe/Helsinki" },
  { label: "Moscow (MSK)",             tz: "Europe/Moscow" },
  { label: "Dubai (GST)",              tz: "Asia/Dubai" },
  { label: "Karachi (PKT)",            tz: "Asia/Karachi" },
  { label: "Mumbai / Delhi (IST)",     tz: "Asia/Kolkata" },
  { label: "Dhaka (BST)",              tz: "Asia/Dhaka" },
  { label: "Bangkok (ICT)",            tz: "Asia/Bangkok" },
  { label: "Singapore / KL (SGT)",     tz: "Asia/Singapore" },
  { label: "Hong Kong (HKT)",          tz: "Asia/Hong_Kong" },
  { label: "Beijing / Shanghai (CST)", tz: "Asia/Shanghai" },
  { label: "Tokyo (JST)",              tz: "Asia/Tokyo" },
  { label: "Seoul (KST)",              tz: "Asia/Seoul" },
  { label: "Sydney (AEDT)",            tz: "Australia/Sydney" },
  { label: "Auckland (NZDT)",          tz: "Pacific/Auckland" },
];

function getOffsetHours(tz: string, date: Date): number {
  // Use Intl to find the UTC offset in minutes
  const utcStr  = new Intl.DateTimeFormat("en-US", { timeZone: "UTC",  hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  const tzStr   = new Intl.DateTimeFormat("en-US", { timeZone: tz,     hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  const [uh, um] = utcStr.split(":").map(Number);
  const [th, tm] = tzStr.split(":").map(Number);
  return (th * 60 + tm - uh * 60 - um) / 60;
}

function formatTime(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    weekday: "short",
  }).format(date);
}

function formatDate(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function TimezoneCalculator() {
  const [tzA, setTzA]   = useState("America/New_York");
  const [tzB, setTzB]   = useState("Asia/Tokyo");
  const [now, setNow]   = useState(new Date());
  const [useNow, setUseNow] = useState(true);
  const [inputTime, setInputTime] = useState("12:00");

  // Tick every 30s when showing live time
  useEffect(() => {
    if (!useNow) return;
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, [useNow]);

  // Build date from manual time input (today's date in zone A)
  const refDate = (() => {
    if (useNow) return now;
    const [h, m] = inputTime.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  })();

  const offsetA = getOffsetHours(tzA, refDate);
  const offsetB = getOffsetHours(tzB, refDate);
  const diff    = offsetB - offsetA;
  const diffStr = diff === 0 ? "Same time" :
    `${diff > 0 ? "+" : ""}${diff % 1 === 0 ? diff : diff.toFixed(1)}h`;

  // Business overlap (9 AM–5 PM in zone A → convert to zone B)
  const overlapStart = 9  - diff; // hour in zone B when it's 9 AM in A
  const overlapEnd   = 17 - diff; // hour in zone B when it's 5 PM in A
  const hasOverlap   = overlapEnd > 9 && overlapStart < 17;
  const overlapStartClamped = Math.max(overlapStart, 9);
  const overlapEndClamped   = Math.min(overlapEnd, 17);

  function fmtHour(h: number) {
    const clamped = ((h % 24) + 24) % 24;
    const suffix = clamped >= 12 ? "PM" : "AM";
    const h12 = clamped % 12 || 12;
    return `${h12}:00 ${suffix}`;
  }

  return (
    <Card>
      <CardTitle>Time Zone Calculator</CardTitle>

      {/* Zone selectors */}
      <div className="space-y-3">
        {[
          { label: "Zone A", value: tzA, set: setTzA },
          { label: "Zone B", value: tzB, set: setTzB },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</p>
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none appearance-none"
              style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
            >
              {TIMEZONES.map((t) => (
                <option key={t.tz} value={t.tz}>{t.label}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Time source toggle */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--card-border)" }}>
          {["Now", "Custom"].map((opt) => (
            <button
              key={opt}
              onClick={() => setUseNow(opt === "Now")}
              className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{
                background: (opt === "Now") === useNow ? "var(--accent)" : "var(--muted)",
                color:      (opt === "Now") === useNow ? "#fff" : "var(--muted-foreground)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {!useNow && (
          <input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
          />
        )}
      </div>

      <ResultBox>
        {/* Zone A */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
              {TIMEZONES.find((t) => t.tz === tzA)?.label ?? tzA}
            </p>
            <p className="font-mono text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {formatTime(refDate, tzA)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {formatDate(refDate, tzA)}
            </p>
          </div>
          {/* Offset badge */}
          <div
            className="px-3 py-1.5 rounded-xl text-sm font-bold self-center"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {diffStr}
          </div>
        </div>

        {/* Zone B */}
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {TIMEZONES.find((t) => t.tz === tzB)?.label ?? tzB}
          </p>
          <p className="font-mono text-2xl font-bold" style={{ color: "var(--result-text)" }}>
            {formatTime(refDate, tzB)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {formatDate(refDate, tzB)}
          </p>
        </div>

        {/* Business overlap */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--result-border)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
            9–5 Overlap (Zone A working hours in Zone B)
          </p>
          {hasOverlap ? (
            <p className="text-sm font-medium" style={{ color: "var(--result-text)" }}>
              {fmtHour(overlapStartClamped)} – {fmtHour(overlapEndClamped)} in Zone B
            </p>
          ) : (
            <p className="text-sm" style={{ color: "#ef4444" }}>No overlap — outside business hours</p>
          )}
        </div>
      </ResultBox>
    </Card>
  );
}
