"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { Lecturer } from "@/types/lecturers";
import LecturerForm from "@/components/lecturers/LecturerForm";
import LectureForm from "@/components/lecturers/LectureForm";
import LecturerCard from "@/components/lecturers/LecturerCard";

// --- tiny theme tokens ---
const COLORS = {
  pageBg: "#0b0f14",       // page background
  gradientA: "#0b1220",
  gradientB: "#0f1629",
  surface: "#0f172a",      // cards/forms bg
  border: "#1f2937",       // subtle line
  text: "#e5e7eb",         // primary text
  textSoft: "#9ca3af",     // secondary
  accent: "#7c3aed",       // purple accent
  accentSoft: "#a78bfa",
  danger: "#ef4444",
};

function getErrorMessage(err: unknown): string {
  const maybeAxios = err as { response?: { data?: unknown } };
  if (maybeAxios?.response?.data) {
    if (typeof maybeAxios.response.data === "string") return maybeAxios.response.data;
    try { return JSON.stringify(maybeAxios.response.data); } catch {}
  }
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Lecturer | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await api.get<Lecturer[]>("/lecturers");
      setLecturers(r.data);
      setErr(null);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const onDeleteLecture = async (lectureID: number) => {
    if (!confirm("Delete this lecture?")) return;
    try {
      await api.delete(`/lectures/${lectureID}`);
      await load();
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };
  const onDeleteLecturer = async (lecturerID: number) => {
  if (!confirm("Delete this lecturer and all their lectures?")) return;
  try {
    await api.delete(`/lecturers/${lecturerID}`);
    await load();
  } catch (e: unknown) {
    alert(getErrorMessage(e));
  }
};

  const headerStyle = useMemo<React.CSSProperties>(() => ({
    background: `linear-gradient(180deg, ${COLORS.gradientA}, ${COLORS.gradientB})`,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "28px 20px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: COLORS.text,
  }), []);

  return (
    <main
      style={{
        maxWidth: 1120,
        margin: "32px auto",
        padding: 16,
        color: COLORS.text,
        background: COLORS.pageBg,
        minHeight: "100dvh",
      }}
    >
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Lecturers & Lectures</h1>
          <span style={{ color: COLORS.textSoft, fontSize: 14 }}>
            Manage lecturers, attach lectures, and edit inline.
          </span>
        </div>
        {loading && <p style={{ marginTop: 10, color: COLORS.textSoft }}>Loading…</p>}
        {err && <p style={{ marginTop: 10, color: COLORS.danger }}>{err}</p>}
      </header>

      {/* forms row */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 20,
          marginTop: 22,
        }}
      >
        {/* On desktop, place them side by side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <LecturerForm
            editing={editing}
            onCancelEdit={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              await load();
            }}
          />
          <LectureForm lecturers={lecturers} onSaved={load} />
        </div>
      </section>

      {/* list */}
      <section
        style={{
          marginTop: 22,
          border: `1px solid ${COLORS.border}`,
          padding: 16,
          borderRadius: 16,
          background: COLORS.surface,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>All Lecturers</h2>
          <div
            style={{
              height: 6,
              width: 72,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
              opacity: 0.8,
            }}
          />
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "16px 0 0 0",
            display: "grid",
            gap: 12,
          }}
        >
          {lecturers.map((l) => (
            <LecturerCard
                key={l.lecturerID}
                data={l}
                onEdit={(lec) => setEditing(lec)}
                onDeleteLecture={onDeleteLecture}
                onDeleteLecturer={onDeleteLecturer}
                />

          ))}
        </ul>
      </section>

    </main>
  );
}
