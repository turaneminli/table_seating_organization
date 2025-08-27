import SeatCircle from './SeatCircle.jsx';

/** returns indices for top/right/bottom/left based on seat count */
function getLayoutIndices(n) {
  // 6 seats -> 3 top, 3 bottom (no left/right)
  if (n === 6) {
    return {
      top:   [0, 1, 2],
      right: [],
      bottom:[3, 4, 5],
      left:  []
    };
  }

  // 12 seats -> 3 per side
  if (n === 12) {
    return {
      top:   [0, 1, 2],
      right: [3, 4, 5],
      bottom:[6, 7, 8],
      left:  [9, 10, 11]
    };
  }

  // Fallback: spread as evenly as possible (keeps app functional)
  const base = Math.floor(n / 4);
  const rem  = n - base * 4;
  const counts = [base, base, base, base];
  for (let i = 0; i < rem; i++) counts[i]++;
  let k = 0;
  const take = (c) => Array.from({ length: c }, () => k++);
  return {
    top:   take(counts[0]),
    right: take(counts[1]),
    bottom:take(counts[2]),
    left:  take(counts[3]),
  };
}

export default function TableView({ seats, title }) {
  const n = seats.length;
  const { top, right, bottom, left } = getLayoutIndices(n);

  return (
    <div className="table">
      {/* Row above table (TOP) */}
      <div></div>
      <div className="row">
        {top.map(i => (
          <SeatCircle key={i} label={seats[i]?.name || ''} index={i} />
        ))}
      </div>
      <div></div>

      {/* Middle row: LEFT | TABLE | RIGHT */}
      <div className="col">
        {left.slice().reverse().map(i => (
          <SeatCircle key={i} label={seats[i]?.name || ''} index={i} />
        ))}
      </div>
      <div className="rect"></div>
      <div className="col" style={{ alignItems: 'end' }}>
        {right.map(i => (
          <SeatCircle key={i} label={seats[i]?.name || ''} index={i} />
        ))}
      </div>

      {/* Row below table (BOTTOM) */}
      <div></div>
      <div className="row">
        {/* For 6 seats, keep left->right order to match your sketch */}
        {bottom.map(i => (
          <SeatCircle key={i} label={seats[i]?.name || ''} index={i} />
        ))}
      </div>
      <div></div>
    </div>
  );
}
