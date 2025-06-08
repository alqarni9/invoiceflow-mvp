import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Link href="/" className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        ProDoc
      </span>
    </Link>
  );
} 