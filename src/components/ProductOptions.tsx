"use client";

interface Option {
  label: string;
  choices: string[];
}

interface Props {
  options: Option[];
  selected: Record<string, string>;
  onChange: (label: string, choice: string) => void;
}

export default function ProductOptions({ options, selected, onChange }: Props) {
  if (!options.length) return null;

  return (
    <div className="space-y-4 mb-6">
      {options.map((opt) => (
        <div key={opt.label}>
          <label
            className="block font-body text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: "var(--muted)" }}
          >
            {opt.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {opt.choices.map((choice) => {
              const isSelected = selected[opt.label] === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onChange(opt.label, choice)}
                  className="font-body text-sm tracking-wider px-4 py-2 transition-all duration-150"
                  style={{
                    background: isSelected ? "var(--primary)" : "transparent",
                    color: isSelected ? "var(--bg)" : "var(--text)",
                    border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
