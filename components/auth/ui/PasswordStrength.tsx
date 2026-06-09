"use client";

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const checks = [
    { label: "8+ chars", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Symbol", met: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.met).length;
  const bars = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"];
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const textCol = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600", "text-green-600"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${i < score ? bars[score] : ""}`} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {checks.map(c => (
            <span
              key={c.label}
              className={`text-xs flex items-center gap-1 ${c.met ? "text-green-600 dark:text-green-400" : "text-zinc-400 dark:text-zinc-600"}`}
            >
              {c.met ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-medium ${textCol[score]}`}>{labels[score]}</span>
      </div>
    </div>
  );
}