import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';
import { useHudStore } from '../../store/hudStore';
import { cn } from '../../lib/utils';

type HealthModuleProps = {
  className?: string;
}

function HealthModule({ className }: HealthModuleProps) {
  const { playerData, modules } = useHudStore();
  const settings = modules.health;

  if (!settings.enabled) return null;

  return (
    <motion.div
      className={cn(
        "hud-module p-3",
        settings.position && "hud-module-draggable",
        className
      )}
      style={{
        opacity: settings.opacity,
        transform: `scale(${settings.scale})`,
        ...(settings.position && {
          top: settings.position.y,
          left: settings.position.x,
          position: 'absolute',
        }),
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: settings.opacity, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ProgressBar
        value={playerData.health}
        variant="health"
        icon={<Heart className="text-red-500" />}
        label="Health"
        showLabel
      />
    </motion.div>
  );
}

export default HealthModule;
