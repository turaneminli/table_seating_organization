export default function SeatCircle({ label, index }) {
  return (
    <div className="seat">
      <div className="dot">{index + 1}</div>
      <div
        style={{
          maxWidth: 180,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={label}
      >
        {label}
      </div>
    </div>
  );
}
