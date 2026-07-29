interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        minHeight: "48px",
        padding: "0 16px",
        borderRadius: "999px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        color: "#0f172a",
        background: "#ffffff",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
        outline: "none",
      }}
    />
  );
}