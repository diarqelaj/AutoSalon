"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Lecturer, LectureCreateDto } from "@/types/lecturers";

type Props = {
  lecturers: Lecturer[];
  onSaved: () => Promise<void> | void;
};

function getErrorMessage(err: unknown): string {
  const maybeAxios = err as { response?: { data?: unknown } };
  if (maybeAxios?.response?.data) {
    if (typeof maybeAxios.response.data === "string") return maybeAxios.response.data;
    try {
      return JSON.stringify(maybeAxios.response.data);
    } catch {
      /* ignore */
    }
  }
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export default function LectureForm({ lecturers, onSaved }: Props) {
  const [lectureName, setLectureName] = useState("");
  const [lecturerID, setLecturerID] = useState<number | "">("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // keep explicit selection (no auto-select)
  }, [lecturers.length]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lectureName.trim() || lecturerID === "") {
      alert("Enter lecture name and choose a lecturer.");
      return;
    }
    try {
      setBusy(true);
      const payload: LectureCreateDto = {
        lectureName: lectureName.trim(),
        lecturerID: Number(lecturerID),
      };
      await api.post("/lectures", payload);
      setLectureName("");
      setLecturerID("");
      await onSaved();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={card}>
      <h2 style={h2}>Add Lecture</h2>
      <div style={grid}>
        <label style={label}>
          <span style={labelText}>Lecture Name</span>
          <input
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            placeholder="e.g., Operating Systems"
            required
            style={input}
          />
        </label>

        <label style={label}>
          <span style={labelText}>Lecturer</span>
          <select
            value={lecturerID}
            onChange={(e) =>
              setLecturerID(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
            style={input}
          >
            <option value="">-- select lecturer --</option>
            {lecturers.map((l) => (
              <option key={l.lecturerID} value={l.lecturerID}>
                {l.lecturerName} — {l.department}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button disabled={busy} type="submit" style={primaryBtn(busy)}>
        Create Lecture
      </button>
    </form>
  );
}

/* ===== minimal, neutral styles (no fancy colors) ===== */
const card: React.CSSProperties = {
  border: "1px solid #2a2f3a",
  borderRadius: 12,
  padding: 16,
  background: "#141821",
  color: "#e6e8ec",
};

const h2: React.CSSProperties = { marginTop: 0, marginBottom: 12, fontSize: 18 };

const grid: React.CSSProperties = { display: "grid", gap: 12, marginBottom: 12 };

const label: React.CSSProperties = { display: "grid", gap: 6 };

const labelText: React.CSSProperties = { fontSize: 13, color: "#b5bac6" };

const input: React.CSSProperties = {
  background: "#0f1320",
  color: "#e6e8ec",
  border: "1px solid #343a46",
  borderRadius: 10,
  padding: "10px 12px",
  outlineColor: "#5f6a7a",
};

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? "#2e3650" : "#39415a",
  color: "#ffffff",
  border: "1px solid #434b66",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: disabled ? "not-allowed" : "pointer",
  width: "100%",
  fontWeight: 600,
});
