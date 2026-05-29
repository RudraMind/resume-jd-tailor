const VARIANTS = {
  purple: 'bg-purple-100 text-purple-800',
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-green-100 text-green-800',
  amber:  'bg-amber-100 text-amber-800',
  red:    'bg-red-100 text-red-800',
  teal:   'bg-teal-100 text-teal-800',
  gray:   'bg-gray-100 text-gray-700',
};

export default function Pill({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant] ?? VARIANTS.gray} ${className}`}>
      {children}
    </span>
  );
}
