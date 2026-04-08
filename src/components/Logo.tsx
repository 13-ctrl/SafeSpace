import logoImg from '../assets/logo.png';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Safe Space Logo"
      className={`object-contain ${className}`}
    />
  );
}
