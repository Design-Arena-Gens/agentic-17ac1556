"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

import styles from "./page.module.css";
import type { AnalysisResult } from "@/lib/analyzer";
import { analyzeMessage } from "@/lib/analyzer";

const demoMessage = `Hello team,

We received a request from someone claiming to be the CFO asking us to urgently update the supplier's bank account before today's wire. They included a link to download the new banking form and said not to call because they are in meetings all day. Should we proceed?`;

export default function Home() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [touched, setTouched] = useState(false);

  const riskBadgeClass = useMemo(() => {
    if (!analysis) return styles.badgeSafe;
    switch (analysis.riskLevel) {
      case "High Risk Fraud":
        return styles.badgeHigh;
      case "Suspicious":
        return styles.badgeSuspicious;
      default:
        return styles.badgeSafe;
    }
  }, [analysis]);

  const handleAnalyze = () => {
    setTouched(true);
    setAnalysis(analyzeMessage(input));
  };

  const handleReset = () => {
    setInput("");
    setAnalysis(null);
    setTouched(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <span className={styles.badge}>Advanced BI Agent</span>
          <h1 className={styles.title}>Business Communication Intelligence</h1>
          <p className={styles.subtitle}>
            Paste any business message, email, or inquiry. The agent will detect
            intent, evaluate fraud risk, surface business impact, and draft a
            decisive next step instantly.
          </p>
        </header>

        <section className={styles.form}>
          <div className={styles.labelRow}>
            <label htmlFor="message">Message to analyze</label>
            <button
              type="button"
              className={clsx(styles.button, styles.buttonSecondary)}
              onClick={() => setInput(demoMessage)}
            >
              Load sample
            </button>
          </div>
          <textarea
            id="message"
            className={styles.textarea}
            placeholder="Paste the full email, chat, or inquiry..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onBlur={() => setTouched(true)}
          />
          <div className={styles.buttonBar}>
            <button
              type="button"
              className={clsx(styles.button, styles.buttonSecondary)}
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className={clsx(styles.button, styles.buttonPrimary)}
              onClick={handleAnalyze}
              disabled={!input.trim()}
            >
              Analyze Message
            </button>
          </div>
          {touched && !input.trim() && (
            <span style={{ color: "#b91c1c", fontWeight: 600 }}>
              Please provide message content to analyze.
            </span>
          )}
        </section>

        {analysis && (
          <>
            <section className={styles.statusGrid}>
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Risk Level</span>
                <span className={clsx(styles.badge, riskBadgeClass)}>
                  {analysis.riskLevel}
                </span>
                <p className={styles.sectionBody}>{analysis.reason}</p>
              </div>
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Business Impact</span>
                <p className={styles.sectionBody}>{analysis.businessImpact}</p>
              </div>
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Recommended Action</span>
                <p className={styles.sectionBody}>
                  {analysis.recommendedAction}
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <span className={styles.sectionTitle}>Decision Support</span>
              <p className={styles.sectionBody}>{analysis.businessInsight}</p>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  Intent: {analysis.intentLabel}
                </span>
                <span className={styles.metaItem}>
                  Lead Score:{" "}
                  {analysis.leadQualityScore === null
                    ? "Not a lead"
                    : `${analysis.leadQualityScore}/10`}
                </span>
              </div>
            </section>

            {analysis.suggestedReply && (
              <section className={styles.section}>
                <span className={styles.sectionTitle}>Suggested Reply</span>
                <div className={styles.replyList}>
                  {Object.entries(analysis.suggestedReply)
                    .filter(([, text]) => Boolean(text))
                    .map(([tone, text]) => (
                      <div key={tone} className={styles.replyItem}>
                        <span className={styles.replyTone}>
                          {tone.replace(/^\w/, (char) => char.toUpperCase())}
                        </span>
                        <p className={styles.sectionBody}>{text}</p>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
