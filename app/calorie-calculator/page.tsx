"use client";

import { useState } from "react";

type Gender = "male" | "female";

const ACTIVITY_OPTIONS = [
  { val: "sedentary",  label: "Sedentary (little or no exercise)",      multiplier: 1.2   },
  { val: "light",      label: "Light (exercise 1–3 days/week)",          multiplier: 1.375 },
  { val: "moderate",   label: "Moderate (exercise 3–5 days/week)",       multiplier: 1.55  },
  { val: "active",     label: "Active (exercise 6–7 days/week)",         multiplier: 1.725 },
  { val: "very-active",label: "Very active (hard exercise + physical job)", multiplier: 1.9 },
];

function calcBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export default function CalorieCalculatorPage() {
  const [imperial, setImperial] = useState(false);
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("25");
  const [weightLbs, setWeightLbs] = useState("154");
  const [weightKg, setWeightKg] = useState("70");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [heightCm, setHeightCm] = useState("175");
  const [activity, setActivity] = useState("moderate");
  const [results, setResults] = useState<{ bmr: number; tdee: number } | null>(null);

  const handleCalculate = () => {
    const ageNum = parseFloat(age);
    const multiplier = ACTIVITY_OPTIONS.find((o) => o.val === activity)?.multiplier ?? 1.55;

    let wKg: number;
    let hCm: number;

    if (imperial) {
      wKg = parseFloat(weightLbs) * 0.453592;
      hCm = (parseFloat(heightFt) * 12 + parseFloat(heightIn)) * 2.54;
    } else {
      wKg = parseFloat(weightKg);
      hCm = parseFloat(heightCm);
    }

    if (!ageNum || !wKg || !hCm) return;

    const bmr = calcBMR(gender, wKg, hCm, ageNum);
    const tdee = bmr * multiplier;
    setResults({ bmr, tdee });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "#fff",
    border: "1.5px solid var(--border)",
    borderRadius: 12,
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 15,
    color: "var(--text-primary)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ width: "100%", maxWidth: 680, paddingTop: 48 }}>
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <span style={{
          display: "inline-block",
          padding: "6px 18px",
          border: "1.5px solid var(--border)",
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 20,
        }}>
          Calorie Calculator
        </span>
        <h1 style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: "clamp(28px, 6vw, 42px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          marginBottom: 14,
        }}>
          Find Your Daily Calories
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>
          A personalized approach to understanding your body&apos;s energy needs
        </p>
      </div>

      {/* Input card */}
      <div style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 20,
        padding: "32px 28px",
        marginBottom: 24,
      }}>
        {/* Card header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border)", paddingBottom: 20, marginBottom: 28 }}>
          <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>
            Your Details
          </span>
          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
              {imperial ? "Imperial" : "Metric"}
            </span>
            <button
              onClick={() => setImperial((v) => !v)}
              aria-label="Toggle unit system"
              style={{
                width: 44,
                height: 24,
                borderRadius: 100,
                border: "none",
                background: imperial ? "var(--btn-primary)" : "#d4ccc6",
                cursor: "pointer",
                position: "relative",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: 3,
                left: imperial ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                transition: "left .2s",
              }} />
            </button>
          </div>
        </div>

        {/* Gender */}
        <div style={{ marginBottom: 24 }}>
          <span style={labelStyle}>Gender</span>
          <div style={{ display: "flex", gap: 20 }}>
            {(["male", "female"] as Gender[]).map((g) => (
              <label key={g} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15, color: "var(--text-primary)" }}>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  style={{ accentColor: "var(--brown-dark)", width: 16, height: 16, cursor: "pointer" }}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Fields row */}
        <div style={{ display: "grid", gridTemplateColumns: imperial ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
          </div>

          {imperial ? (
            <>
              <div>
                <label style={labelStyle}>Weight (lbs)</label>
                <input type="number" min={50} max={600} value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Height (ft)</label>
                <input type="number" min={3} max={8} value={heightFt} onChange={(e) => setHeightFt(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Height (in)</label>
                <input type="number" min={0} max={11} value={heightIn} onChange={(e) => setHeightIn(e.target.value)} style={inputStyle} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input type="number" min={20} max={300} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Height (cm)</label>
                <input type="number" min={100} max={250} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} style={inputStyle} />
              </div>
            </>
          )}
        </div>

        {/* Activity level */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Activity Level</label>
          <div style={{ position: "relative" }}>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              style={{
                ...inputStyle,
                appearance: "none",
                cursor: "pointer",
                paddingRight: 40,
              }}
            >
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o.val} value={o.val}>{o.label}</option>
              ))}
            </select>
            <svg
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width={16} height={16} viewBox="0 0 16 16" fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          style={{
            width: "100%",
            padding: "17px 24px",
            borderRadius: 100,
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            background: "var(--btn-primary)",
            color: "var(--btn-primary-text)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Calculate My Calories
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="animate-fadeUp">
          {/* BMR / TDEE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { tag: "BMR", value: results.bmr, sub: "calories/day at rest" },
              { tag: "TDEE", value: results.tdee, sub: "calories/day with activity" },
            ].map((card) => (
              <div key={card.tag} style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: 20,
                padding: "32px 24px",
                textAlign: "center",
              }}>
                <span style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: "var(--text-muted)",
                  marginBottom: 14,
                }}>
                  {card.tag}
                </span>
                <div style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "clamp(32px, 6vw, 46px)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {fmt(card.value)}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Goals */}
          <div style={{
            background: "#fff",
            border: "1.5px solid var(--border)",
            borderRadius: 20,
            padding: "28px 24px 32px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{
                display: "inline-block",
                padding: "4px 14px",
                border: "1.5px solid var(--border)",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
              }}>
                Your Goals
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Weight Loss", cal: results.tdee - 500, highlight: false },
                { label: "Maintain",    cal: results.tdee,       highlight: true  },
                { label: "Weight Gain", cal: results.tdee + 300, highlight: false },
              ].map((goal) => (
                <div key={goal.label} style={{
                  borderRadius: 14,
                  padding: "20px 12px",
                  textAlign: "center",
                  background: goal.highlight ? "var(--bg)" : "transparent",
                  border: goal.highlight ? "1.5px solid var(--border)" : "none",
                }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: 10,
                  }}>
                    {goal.label}
                  </div>
                  <div style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "clamp(24px, 4vw, 34px)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}>
                    {fmt(goal.cal)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>cal/day</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
