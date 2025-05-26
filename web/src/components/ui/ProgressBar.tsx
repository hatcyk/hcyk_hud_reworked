import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressBarVariants = cva(
  'hud-bar',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
      },
      variant: {
        default: 'bg-surface/30',
        primary: 'bg-primary/20',
        secondary: 'bg-secondary/20',
        health: 'bg-red-500/20',
        armor: 'bg-blue-500/20',
        stamina: 'bg-green-500/20',
        hunger: 'bg-amber-500/20',
        thirst: 'bg-sky-500/20',
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    }
  }
);

const progressBarFillVariants = cva(
  'hud-bar-fill',
  {
    variants: {
      variant: {
        default: 'bg-white',
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        health: 'bg-red-500',
        armor: 'bg-blue-500',
        stamina: 'bg-green-500',
        hunger: 'bg-amber-500',
        thirst: 'bg-sky-500',
      }
    },
    defaultVariants: {
      variant: 'default',
    }
  }
);

type ProgressBarProps = {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
} & VariantProps<typeof progressBarVariants>;

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  label,
  icon,
  size,
  variant,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      {icon && <div className="hud-icon">{icon}</div>}

      <div className="flex-1">
        {(label || showLabel) && (
          <div className="flex justify-between items-center mb-1">
            <span className="hud-text">{label || `${Math.round(percentage)}%`}</span>
            {showLabel && label && (
              <span className="hud-text text-xs opacity-80">{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div className={progressBarVariants({ size, variant })}>
          <motion.div
            className={progressBarFillVariants({ variant })}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
