// src/app/test-drive/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

type ContactChannel = "SMS" | "WhatsApp" | "PhoneCall" | "Email";
type CreateTestDrive = {
  fullName: string;
  phone: string;
  email?: string;
  vehicleName: string;
  vehicleId?: number | null;
  preferredAt: string; // UTC ISO
  notes?: string;
  preferredChannel: number; // 1=SMS, 2=WhatsApp, 3=PhoneCall, 4=Email (matches backend)
};

const toUtcIso = (date: string, time: string) => {
  // combine local date+time -> UTC ISO
  const local = new Date(`${date}T${time || "09:00"}:00`);
  // convert to UTC without changing the wall-clock chosen by user
  const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return utc.toISOString();
};

export default function TestDrivePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleId, setVehicleId] = useState<string>(""); // keep as string for the input
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("SMS");

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setOk(false);

    if (!fullName || !phone || !vehicleName || !date) {
      setErr("Please fill Full name, Phone, Vehicle and Date.");
      setSubmitting(false);
      return;
    }

    const payload: CreateTestDrive = {
      fullName,
      phone,
      email: email || undefined,
      vehicleName,
      vehicleId: vehicleId.trim() === "" ? undefined : Number(vehicleId),
      preferredAt: toUtcIso(date, time || "09:00"),
      notes: notes || undefined,
      preferredChannel: channel === "SMS" ? 1 : channel === "WhatsApp" ? 2 : channel === "PhoneCall" ? 3 : 4,
    };

    try {
      await api.post("/testdrives", payload);
      setOk(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setVehicleName("");
      setVehicleId("");
      setDate("");
      setTime("");
      setNotes("");
      setChannel("SMS");
    } catch {
      setErr("Could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold">Book a Test Drive</h1>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Pick a car, date, and time — we’ll confirm by {channel === "Email" ? "email" : "SMS or WhatsApp"}.
      </p>

      <div className="mt-8 rounded-xl border border-border p-6 bg-card">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="md:col-span-2"
          />
          <Input
            placeholder="Vehicle (e.g. BMW 3 Series)"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
          <Input
            placeholder="Vehicle ID (optional)"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          {/* Preferred contact (plain radios, no extra imports) */}
          <div className="md:col-span-2">
            <div className="mb-2 text-sm font-medium">Preferred contact</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["SMS", "WhatsApp", "PhoneCall", "Email"] as ContactChannel[]).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer ${
                    channel === opt ? "ring-1 ring-luxury-gold" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="contact"
                    className="accent-luxury-gold"
                    checked={channel === opt}
                    onChange={() => setChannel(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <Textarea
            className="md:col-span-2"
            placeholder="Anything we should know?"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" disabled={submitting} className="md:col-span-2">
            {submitting ? "Requesting…" : "Request Slot"}
          </Button>

          {ok && (
            <div className="md:col-span-2 flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" /> Request received. We’ll get back to you shortly.
            </div>
          )}
          {err && <div className="md:col-span-2 text-destructive">{err}</div>}
        </form>
      </div>
    </section>
  );
}
