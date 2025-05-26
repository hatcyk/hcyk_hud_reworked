import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';
import { useHudStore } from '../../store/hudStore';
import { cn } from '../../lib/utils';

type ThirstModuleProps = {
  className?: string;
}

function ThirstModule({ className }: ThirstModuleProps) {
  const { playerData, modules } = useHudStore();
  const settings = modules.thirst;

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
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <ProgressBar
        value={playerData.thirst}
        variant="thirst"
        icon={<Droplets className="text-sky-500" />}
        label="Thirst"
        showLabel
      />
    </motion.div>
  );
}

export default ThirstModule;
