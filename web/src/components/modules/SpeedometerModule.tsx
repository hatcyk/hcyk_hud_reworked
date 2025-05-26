import { Gauge, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHudStore } from '../../store/hudStore';
import { cn, formatNumber } from '../../lib/utils';
import ProgressBar from '../ui/ProgressBar';

type SpeedometerModuleProps = {
  className?: string;
}

function SpeedometerModule({ className }: SpeedometerModuleProps) {
  const { playerData, modules } = useHudStore();
  const settings = modules.speedometer;

  if (!settings.enabled) return null;

  return (
    <motion.div
      className={cn(
        "hud-module p-4 w-64",
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
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold">{formatNumber(playerData.speed, 0)}</span>
          <span className="text-xs opacity-70">MPH</span>
        </div>

        <div className="flex items-center gap-1">
          <Fuel className="w-4 h-4 text-orange-500" />
          <span className="text-sm">{formatNumber(playerData.fuel, 0)}%</span>
        </div>
      </div>

      <ProgressBar
        value={playerData.fuel}
        variant="default"
        size="sm"
        className="mb-1"
      />

      <div className="relative h-2 bg-surface/50 rounded-full overflow-hidden mt-3">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary"
          animate={{
            width: `${(playerData.speed / 180) * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="flex justify-between mt-1 text-[10px] opacity-70">
        <span>0</span>
        <span>45</span>
        <span>90</span>
        <span>135</span>
        <span>180</span>
      </div>
    </motion.div>
  );
}

export default SpeedometerModule;
