import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          initial={false}
          animate={{
            backgroundColor: checked ? '#10b981' : '#e2e8f0',
            borderColor: checked ? '#10b981' : '#cbd5e1',
          }}
          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <motion.svg
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path d="M5 12l5 5L20 7" />
          </motion.svg>
        </motion.div>
      </div>
      {label && (
        <span className={`text-sm transition-colors ${checked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
}