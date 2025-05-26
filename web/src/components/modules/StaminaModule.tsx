import { Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';
import { useHudStore } from '../../store/hudStore';
import { cn } from '../../lib/utils';

type StaminaModuleProps = {
  className?: string;
}

function StaminaModule({ className }: StaminaModuleProps) {
  const { playerData, modules } = useHudStore();
  const settings = modules.stamina;

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
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <ProgressBar
        value={playerData.stamina}
        variant="stamina"
        icon={<Wind className="text-green-500" />}
        label="Stamina"
        showLabel
      />
    </motion.div>
  );
}

export default StaminaModule;
