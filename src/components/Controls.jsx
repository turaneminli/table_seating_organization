export default function Controls({
  mode, setMode,
  tables, setTables,
  onShuffle, onUseExample, onUpload, onPrint,
  link,
}) {
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Link copied to clipboard!');
    }
  }

  return (
    <div className="panel controls">
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="random">Random</option>
        <option value="alternate">Alternate M/F</option>
        <option value="traditional">Partners: woman to right</option>
        <option value="opposite">Partners opposite</option>
      </select>

      <label>
        Tables:&nbsp;
        <input
          type="number"
          min="1"
          value={tables}
          onChange={e => setTables(Math.max(1, parseInt(e.target.value || '1')))}
        />
      </label>

      <button onClick={onShuffle}>Shuffle</button>
      <button onClick={onUseExample}>Use example</button>

      <label>Upload JSON
        <input
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            const txt = await f.text();
            try { onUpload(JSON.parse(txt)); } catch {}
          }}
        />
      </label>

      <button onClick={copyToClipboard}>Copy link</button>

      <button onClick={onPrint}>Print</button>
    </div>
  );
}
