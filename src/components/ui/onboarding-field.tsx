"use client";

interface OnboardingFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email" | "tel" | "password";
  autoFocus?: boolean;
}

export function OnboardingField({
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: OnboardingFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full border-none bg-transparent text-2xl font-medium text-ink placeholder:text-placeholder focus:outline-none"
    />
  );
}
