import { useEffect, useMemo, useState } from 'react';
import { Controls, TableView, generateSeating, encodePlan, decodePlan } from './seating/index';
import example from './seating/example-data.json';
import { snapTables } from './utils/validator.js';
import './index.css';

const DEFAULT = example;

export default function App() {
  const [data, setData]   = useState(DEFAULT);                
  const [mode, setMode]   = useState('opposite');
  const [tables, setTables] = useState(DEFAULT.settings.numberOfTable);
  const [seed, setSeed]   = useState(1);                      

  useEffect(() => {
  const read = () => {
    const h = window.location.hash.slice(1);
    if (!h) return;
    const plan = decodePlan(h);
    if (!plan) return;

    if (Array.isArray(plan.guests)) {
      setData(prev => ({ ...prev, guests: plan.guests }));
    }
    if (plan.settings?.mode) setMode(plan.settings.mode);

    const nTables = Number(plan.settings?.numberOfTable);
    if (Number.isFinite(nTables)) setTables(nTables);

    const nSeed = Number(plan.seed);
    if (Number.isFinite(nSeed)) setSeed(nSeed);
  };
  read();
  window.addEventListener('hashchange', read);
  return () => window.removeEventListener('hashchange', read);
}, []);

  const mustBeEven = mode !== 'random';
  const { tables: safeTables, perTable, warning } = useMemo(
    () => snapTables(data.guests.length, tables, { requireEvenPerTable: mustBeEven }),
    [data.guests.length, tables, mustBeEven]
  );

  const seating = useMemo(
    () => generateSeating(data.guests, safeTables, mode, seed),
    [data, mode, safeTables, seed]
  );

const shareObj = { guests: data.guests, settings: { mode, numberOfTable: safeTables }, seed };
const base = `${window.location.origin}${window.location.pathname}${window.location.search}`;
const shareUrl = `${base}#${encodePlan(shareObj)}`;


  return (
    <div className="container">
      <div style={{ marginBottom: 8 }}>
        <h1>Party Seating Planner</h1>
        <p className="meta">
          Seats/table kept integer {mustBeEven ? 'and even' : ''}.
          {' '}Total guests: {data.guests.length}
        </p>
      </div>

      <Controls
        mode={mode} setMode={setMode}
        tables={tables} setTables={setTables}
        onShuffle={() => setSeed(s => s + 1)}
        onUseExample={() => { setData(DEFAULT); setMode('opposite'); setTables(DEFAULT.settings.numberOfTable); setSeed(1); }}
        onUpload={(obj) => setData(obj)}
        onPrint={() => window.print()}
        link={shareUrl}   
      />

      {warning && <div className="panel warn">{warning}</div>}

      <div className="grid">
        {seating.tables.map((t, i) => (
          <div className="panel" key={i}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Table {i + 1}</div>
            <TableView seats={t.seats} title={`Table ${i + 1}`} />
          </div>
        ))}
      </div>

      <footer className="meta">Mode: {mode} · Tables: {safeTables} · Seats/table: {perTable} · Seed: {seed}</footer>
    </div>
  );
}
