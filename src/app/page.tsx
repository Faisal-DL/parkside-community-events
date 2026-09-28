"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Lightbulb, Search, RotateCcw } from "lucide-react";
import { scenario as s } from "@/lib/scenario";
import { journeyEvent } from "@/lib/analytics";

type Screen = "home" | "primary" | "review" | "primary-done" | "lookup" | "lookup-done" | "suggest" | "suggest-done";
type Reservation = { code: string; name: string; detail: string };
type Suggestion = { code: string; subject: string; details: string };
const seed: Reservation = { code: s.seedReference, name: s.seedName, detail: s.seedDetail };
const storagePrefix = s.referencePrefix.toLowerCase();

function readStored<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]") as T[]; } catch { return []; }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [reservations, setReservations] = useState<Reservation[]>(() => typeof window === "undefined" ? [] : readStored<Reservation>(storagePrefix + "-reservations"));
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => typeof window === "undefined" ? [] : readStored<Suggestion>(storagePrefix + "-suggestions"));
  const [selected, setSelected] = useState<number | null>(null);
  const [reference, setReference] = useState<string>(s.seedReference);
  const [found, setFound] = useState<Reservation | null>(null);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => { localStorage.setItem(storagePrefix + "-reservations", JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem(storagePrefix + "-suggestions", JSON.stringify(suggestions)); }, [suggestions]);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  const home = () => { setError(""); setScreen("home"); };
  const startPrimary = () => { setSelected(null); setError(""); journeyEvent("reservation_started"); setScreen("primary"); };
  const review = () => {
    if (selected === null) { setError("Choose an available option to continue."); return; }
    setError(""); setScreen("review");
  };
  const saveReservation = () => {
    if (selected === null) return;
    const item = s.options[selected];
    const reservation: Reservation = { code: s.referencePrefix + "-" + (2043 + reservations.length), name: item.name, detail: item.detail };
    setReservations([reservation, ...reservations]); setNewCode(reservation.code);
    journeyEvent("reservation_completed", { option: item.name }); setScreen("primary-done");
  };
  const startLookup = () => { setReference(s.seedReference); setError(""); journeyEvent("lookup_started"); setScreen("lookup"); };
  const findReservation = () => {
    const match = [seed, ...reservations].find(item => item.code.toLowerCase() === reference.trim().toLowerCase());
    if (!match) { setError("Reference not found. Try " + s.seedReference + "."); return; }
    setFound(match); setError(""); journeyEvent("lookup_completed"); setScreen("lookup-done");
  };
  const startSuggestion = () => { setSubject(""); setDetails(""); setError(""); journeyEvent("suggestion_started"); setScreen("suggest"); };
  const saveSuggestion = () => {
    if (subject.trim().length < 5 || details.trim().length < 12) { setError("Add a short title and at least one sentence of detail."); return; }
    const suggestion: Suggestion = { code: "IDEA-" + (301 + suggestions.length), subject: subject.trim(), details: details.trim() };
    setSuggestions([suggestion, ...suggestions]); setNewCode(suggestion.code);
    setError(""); journeyEvent("suggestion_completed"); setScreen("suggest-done");
  };
  const reset = () => { setReservations([]); setSuggestions([]); setResetOpen(false); home(); };

  return <div className="shell" style={{ "--accent": s.accent } as React.CSSProperties}>
    <header className="topbar">
      <button className="brand" onClick={home} aria-label={s.name + " home"}><span className="brand-mark"><CalendarDays size={21} /></span><span><strong>{s.shortName}</strong><small>{s.name}</small></span></button>
      <span className="demo-pill"><span className="demo-dot" /> Demo mode</span>
    </header>
    <main className="main">
      {screen === "home" && <>
        <section className="hero surface"><div className="hero-copy"><span className="eyebrow">{s.tagline}</span><h1>{s.heroTitle}</h1><p>{s.heroDescription}</p></div><span className="hero-art"><span className="hero-orbit" /><span className="hero-icon"><CalendarDays size={42} /></span></span></section>
        <div className="section-heading"><span>CHOOSE A PATH</span><span>01 / 03</span></div>
        <section className="action-grid" aria-label="Services">
          <button className="action-card surface" onClick={startPrimary}><span className="action-icon"><Check size={23} /></span><span className="action-text"><strong>{s.primary}</strong><small>{s.primaryDescription}</small></span><span className="circle-arrow"><ArrowRight size={19} /></span></button>
          <button className="action-card surface" onClick={startLookup}><span className="action-icon peach"><Search size={23} /></span><span className="action-text"><strong>{s.lookup}</strong><small>{s.lookupDescription}</small></span><span className="circle-arrow"><ArrowRight size={19} /></span></button>
          <button className="action-card surface" onClick={startSuggestion}><span className="action-icon lilac"><Lightbulb size={23} /></span><span className="action-text"><strong>{s.third}</strong><small>{s.thirdDescription}</small></span><span className="circle-arrow"><ArrowRight size={19} /></span></button>
        </section>
      </>}
      {screen === "primary" && <><PageHead back={home} eyebrow={s.primary.toUpperCase()} title={s.primaryIntro} subtitle={s.primaryHint} /><section className="form-card surface"><div className="option-list" role="group" aria-label={s.primaryIntro}>{s.options.map((item, index) => <button key={item.name} type="button" className={"option " + (selected === index ? "selected" : "")} onClick={() => { if (item.full) { setError(s.unavailableError); return; } setSelected(index); setError(""); }} aria-pressed={selected === index}><span><strong>{item.name}</strong><small>{item.detail}</small></span><em>{item.full ? s.fullLabel : s.openLabel}</em></button>)}</div>{error && <p className="error" role="alert">{error}</p>}<button className="primary-button" onClick={review}>Continue <ArrowRight size={18} /></button></section></>}
      {screen === "review" && selected !== null && <><PageHead back={() => setScreen("primary")} eyebrow="ONE LAST LOOK" title={s.primaryReview} subtitle="Make sure this is the option you want." /><section className="form-card surface"><div className="summary"><span>SELECTED</span><strong>{s.options[selected].name}</strong><p>{s.options[selected].detail}</p></div><div className="review-actions"><button className="text-button" onClick={() => setScreen("primary")}>Change option</button><button className="primary-button" onClick={saveReservation}>Confirm <ArrowRight size={18} /></button></div></section></>}
      {screen === "primary-done" && <><Success title={s.primaryDone} subtitle="Keep this reference to check your details later." /><section className="form-card surface success-card"><span className="caption">YOUR REFERENCE</span><strong className="reference">{newCode}</strong><button className="primary-button" onClick={() => { setReference(newCode); setFound(reservations[0]); setScreen("lookup-done"); }}>View details <ArrowRight size={18} /></button></section><button className="below-link" onClick={home}>Back to home</button></>}
      {screen === "lookup" && <><PageHead back={home} eyebrow={s.lookup.toUpperCase()} title={s.lookupTitle} subtitle={s.lookupHint} /><section className="form-card surface"><label htmlFor="reference">Reference</label><input id="reference" value={reference} onChange={e => { setReference(e.target.value); setError(""); }} onKeyDown={e => { if (e.key === "Enter") findReservation(); }} placeholder={s.seedReference} /><p className="field-hint">Demo reference: {s.seedReference}</p>{error && <p className="error" role="alert">{error}</p>}<button className="primary-button" onClick={findReservation}>Find details <ArrowRight size={18} /></button></section></>}
      {screen === "lookup-done" && found && <><PageHead back={() => setScreen("lookup")} eyebrow="YOUR UPDATE" title={s.lookupDone} subtitle={"Reference " + found.code} /><section className="form-card surface"><span className="status">{s.seedStatus}</span><h2>{found.name}</h2><p className="result-detail">{found.detail}</p><div className="timeline"><span className="timeline-dot"><Check size={13} /></span><div><strong>Request received</strong><small>We saved your selection.</small></div></div></section><button className="below-link" onClick={home}>Back to home</button></>}
      {screen === "suggest" && <><PageHead back={home} eyebrow={s.third.toUpperCase()} title={s.thirdTitle} subtitle="One or two details will help us understand your idea." /><section className="form-card surface"><label htmlFor="subject">{s.thirdSubject}</label><input id="subject" value={subject} onChange={e => { setSubject(e.target.value); setError(""); }} placeholder={s.thirdSubjectPlaceholder} /><label htmlFor="details">{s.thirdDetails}</label><textarea id="details" value={details} onChange={e => { setDetails(e.target.value); setError(""); }} placeholder={s.thirdDetailsPlaceholder} rows={5} />{error && <p className="error" role="alert">{error}</p>}<button className="primary-button" onClick={saveSuggestion}>Send suggestion <ArrowRight size={18} /></button></section></>}
      {screen === "suggest-done" && <><Success title={s.thirdDone} subtitle="Your idea is saved on this device." /><section className="form-card surface success-card"><span className="caption">YOUR REFERENCE</span><strong className="reference">{newCode}</strong></section><button className="below-link" onClick={home}>Back to home</button></>}
    </main>
    <footer className="footer"><span>{s.name} · {s.demoNote}</span><button onClick={() => setResetOpen(true)}><RotateCcw size={15} /> Reset demo</button></footer>
    {resetOpen && <div className="modal-backdrop"><section className="modal surface" role="dialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">Start fresh?</h2><p>This clears your new reservations and suggestions on this device. The demo reference remains available.</p><div className="modal-actions"><button className="text-button" onClick={() => setResetOpen(false)}>Keep my work</button><button className="primary-button" onClick={reset}>Reset demo</button></div></section></div>}
  </div>;
}

function PageHead({ back, eyebrow, title, subtitle }: { back: () => void; eyebrow: string; title: string; subtitle: string }) {
  return <div className="page-head"><button className="back-button" onClick={back}><ArrowLeft size={18} /> Back</button><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>;
}
function Success({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="success-head"><span className="success-icon"><CheckCircle2 size={34} /></span><span className="eyebrow">ALL DONE</span><h1>{title}</h1><p>{subtitle}</p></div>;
}
