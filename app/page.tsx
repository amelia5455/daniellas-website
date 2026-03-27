"use client";

import { useState, useCallback } from "react";

const TOTAL_QUESTIONS = 5;

const QUESTION_LABELS: Record<number, string> = {
  1: "Main Goal",
  2: "Age Range",
  3: "Fitness Level",
  4: "Biggest Motivation",
  5: "Openness to Coaching",
};

const ANSWER_LABELS: Record<string, string> = {
  strength:    "Build strength and feel powerful",
  "fat-loss":  "Lose body fat and feel leaner",
  health:      "Improve my overall health and energy",
  consistency: "Create consistency and a healthier lifestyle",
  "18-25":     "18–25",
  "26-35":     "26–35",
  "36-45":     "36–45",
  "46+":       "46+",
  new:         "New to fitness and need guidance",
  "some-exp":  "Worked out before but need structure",
  consistent:  "Consistent but want to level up",
  experienced: "Experienced but want accountability",
  confident:   "Feeling confident in my body",
  mental:      "Improving my mental health",
  example:     "Setting a healthy example for others",
  prove:       "Proving to myself I can commit",
  "very-open": "Very open — I want full guidance",
  somewhat:    "Somewhat open — I like some independence",
  plan:        "Just looking for a plan to follow",
  exploring:   "Not sure yet — still exploring",
};

const QUESTIONS = [
  {
    id: 1,
    title: "What's your main goal right now?",
    options: [
      { val: "strength",    label: "Build strength and feel powerful" },
      { val: "fat-loss",    label: "Lose body fat and feel leaner" },
      { val: "health",      label: "Improve my overall health and energy" },
      { val: "consistency", label: "Create consistency and a healthier lifestyle" },
    ],
  },
  {
    id: 2,
    title: "What age range do you fall into?",
    options: [
      { val: "18-25", label: "18–25" },
      { val: "26-35", label: "26–35" },
      { val: "36-45", label: "36–45" },
      { val: "46+",   label: "46+" },
    ],
  },
  {
    id: 3,
    title: "Which best describes you?",
    options: [
      { val: "new",         label: "I'm new to fitness and need guidance" },
      { val: "some-exp",    label: "I've worked out before but need structure" },
      { val: "consistent",  label: "I'm consistent but want to level up" },
      { val: "experienced", label: "I'm experienced but want accountability" },
    ],
  },
  {
    id: 4,
    title: "What's your biggest motivation?",
    options: [
      { val: "confident", label: "Feeling confident in my body" },
      { val: "mental",    label: "Improving my mental health" },
      { val: "example",   label: "Setting a healthy example for others" },
      { val: "prove",     label: "Proving to myself I can commit" },
    ],
  },
  {
    id: 5,
    title: "How open are you to coaching?",
    options: [
      { val: "very-open", label: "Very open — I want full guidance" },
      { val: "somewhat",  label: "Somewhat open — I like some independence" },
      { val: "plan",      label: "Just looking for a plan to follow" },
      { val: "exploring", label: "Not sure yet — still exploring" },
    ],
  },
];

function getProgress(step: number): number {
  if (step <= 1) return (1 / (TOTAL_QUESTIONS + 1)) * 100;
  if (step <= TOTAL_QUESTIONS) return (step / (TOTAL_QUESTIONS + 1)) * 100;
  if (step === 6) return 95;
  return 100;
}

const s = {
  shell: {
    width: "100%",
    maxWidth: 520,
    paddingTop: 40,
  } as React.CSSProperties,
  header: {
    textAlign: "center" as const,
    marginBottom: 28,
  },
  h1: {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 20,
    fontWeight: 500,
    color: "#262626",
    letterSpacing: "0.02em",
  } as React.CSSProperties,
  progressWrap: {
    height: 4,
    background: "var(--progress-track)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 44,
  } as React.CSSProperties,
  stepLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: 12,
  },
  questionTitle: {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: "clamp(22px, 5vw, 28px)",
    fontWeight: 700,
    color: "#262626",
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    marginBottom: 32,
  } as React.CSSProperties,
  optionsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    marginBottom: 36,
  },
  btnRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  } as React.CSSProperties,
  btnPrimary: (disabled: boolean) => ({
    padding: "15px 32px",
    borderRadius: 100,
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    background: "var(--btn-primary)",
    color: "var(--btn-primary-text)",
    border: "none",
    flex: 1,
    maxWidth: 280,
    opacity: disabled ? 0.45 : 1,
    transition: "opacity .2s",
  } as React.CSSProperties),
  btnSecondary: {
    padding: "15px 28px",
    borderRadius: 100,
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    background: "transparent",
    color: "var(--btn-secondary-text)",
    border: "1.5px solid var(--btn-secondary-border)",
    transition: "opacity .2s",
  } as React.CSSProperties,
};

export default function IntakePage() {
  const [screen, setScreen] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [animKey, setAnimKey] = useState(0);

  const showScreen = useCallback((n: number) => {
    setScreen(n);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submitForm = async () => {
    setSubmitting(true);
    setError("");

    const payload: Record<string, string> = { name, email, phone };
    for (const [q, val] of Object.entries(answers)) {
      payload[QUESTION_LABELS[Number(q)]] = ANSWER_LABELS[val] || val;
    }

    try {
      const res = await fetch("/api/submit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showScreen(7);
      } else {
        const data = await res.json();
        throw new Error(data?.error || "Submission failed");
      }
    } catch (err) {
      setError("Something went wrong — please try again or email Daniella directly.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = getProgress(screen);
  const formValid = name.trim() && email.trim() && phone.trim();

  return (
    <div style={s.shell}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.h1}>Daniella Mendoza</h1>
      </div>

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div
          style={{
            height: "100%",
            background: "var(--progress-fill)",
            borderRadius: 2,
            width: `${progress}%`,
            transition: "width 0.45s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>

      {/* Quiz questions Q1–Q5 */}
      {QUESTIONS.map((q) =>
        screen === q.id ? (
          <div key={`q-${animKey}`} className="animate-fadeUp">
            <p style={s.stepLabel}>Question {q.id} of {TOTAL_QUESTIONS}</p>
            <h2 style={s.questionTitle}>{q.title}</h2>
            <div style={s.optionsList}>
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.val;
                return (
                  <div
                    key={opt.val}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.val }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 20px",
                      background: "var(--card-bg)",
                      border: `1.5px solid ${selected ? "var(--border-selected)" : "var(--border)"}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      boxShadow: selected ? "0 2px 16px rgba(45,26,14,.10)" : undefined,
                      fontSize: 15,
                      fontWeight: 400,
                      color: "#262626",
                      userSelect: "none",
                      transition: "border-color .2s, box-shadow .2s, background .2s",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, minWidth: 20,
                      borderRadius: "50%",
                      border: `1.5px solid ${selected ? "#262626" : "#c7b9ac"}`,
                      background: selected ? "var(--brown-dark)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "border-color .2s",
                    }}>
                      {selected && (
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white", display: "block" }} />
                      )}
                    </span>
                    {opt.label}
                  </div>
                );
              })}
            </div>
            <div style={s.btnRow}>
              {q.id > 1 && (
                <button onClick={() => showScreen(q.id - 1)} style={s.btnSecondary}>Back</button>
              )}
              <button
                onClick={() => showScreen(q.id + 1)}
                disabled={!answers[q.id]}
                style={s.btnPrimary(!answers[q.id])}
              >
                Continue
              </button>
            </div>
          </div>
        ) : null
      )}

      {/* Contact form — screen 6 */}
      {screen === 6 && (
        <div key={`form-${animKey}`} className="animate-fadeUp">
          <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(24px, 6vw, 30px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#262626", marginBottom: 6 }}>
            Almost there!
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
            Enter your details so Daniella can reach out.
          </p>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#602C01", marginBottom: 7, letterSpacing: "0.01em" }}>Name</label>
            <input id="name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "15px 18px", background: "var(--card-bg)", border: "1.5px solid var(--border)", borderRadius: 14, fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#262626", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#602C01", marginBottom: 7, letterSpacing: "0.01em" }}>Email</label>
            <input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "15px 18px", background: "var(--card-bg)", border: "1.5px solid var(--border)", borderRadius: 14, fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#262626", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="phone" style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#602C01", marginBottom: 7, letterSpacing: "0.01em" }}>Phone</label>
            <input id="phone" type="tel" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: "15px 18px", background: "var(--card-bg)", border: "1.5px solid var(--border)", borderRadius: 14, fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#262626", outline: "none" }} />
          </div>

          {error && (
            <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>
          )}

          <div style={{ ...s.btnRow, marginTop: 8 }}>
            <button onClick={() => showScreen(5)} style={s.btnSecondary}>Back</button>
            <button
              onClick={submitForm}
              disabled={!formValid || submitting}
              style={s.btnPrimary(!formValid || submitting)}
            >
              {submitting ? "Sending…" : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation — screen 7 */}
      {screen === 7 && (
        <div
          key={`confirm-${animKey}`}
          className="animate-fadeUp-slow"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}
        >
          <div style={{ width: 72, height: 72, background: "#F3F1F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#602C01" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "#262626", marginBottom: 12 }}>
            You&apos;re all set!
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 320, marginBottom: 32 }}>
            Thank you for completing the quiz. Daniella will review your answers and reach out to you soon.
          </p>
          <a
            href="https://www.daniellamendozafit.com/"
            style={{
              display: "inline-block",
              padding: "15px 36px",
              borderRadius: 100,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              background: "var(--btn-primary)",
              color: "var(--btn-primary-text)",
              textDecoration: "none",
              transition: "opacity .2s",
            }}
          >
            Back to website
          </a>
        </div>
      )}
    </div>
  );
}
