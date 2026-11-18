import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isDark = variant === 'dark';
  return (
    <Link href="/" className={`inline-flex items-center gap-2 group tracking-tight select-none ${className}`}>
      <span
        className={`w-8 h-8 rounded flex items-center justify-center font-bold text-lg font-heading transition-colors ${
          isDark
            ? 'bg-[#242522] text-[#F5F4F0] group-hover:bg-[#D96B3A]'
            : 'bg-[#D96B3A] text-[#F5F4F0] group-hover:bg-[#BF582D]'
        }`}
      >
        M
      </span>
      <span className="flex flex-col">
        <span
          className={`font-heading font-extrabold text-xl leading-none tracking-wider ${
            isDark ? 'text-[#242522]' : 'text-white'
          }`}
        >
          MELTUNE
        </span>
        <span
          className={`text-[9px] uppercase tracking-widest font-medium ${
            isDark ? 'text-[#777871]' : 'text-neutral-400'
          }`}
        >
          Automotive Service & Parts
        </span>
      </span>
    </Link>
  );
}
