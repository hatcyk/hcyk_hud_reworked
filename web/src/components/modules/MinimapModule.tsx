import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHudStore } from '../../store/hudStore';
import { cn } from '../../lib/utils';

type MinimapModuleProps = {
  className?: string;
}

function MinimapModule({ className }: MinimapModuleProps) {
  const { playerData, modules } = useHudStore();
  const settings = modules.minimap;

  if (!settings.enabled) return null;

  return (
    <motion.div
      className={cn(
        "hud-module p-0 overflow-hidden w-64 h-48",
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: settings.opacity, scale: settings.scale }}
      transition={{ duration: 0.3 }}
    >
      {/* This is a placeholder. In FiveM, the minimap would be displayed here */}
      <div className="bg-surface/40 backdrop-blur-md w-full h-full relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-sm">Minimap Placeholder</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-sm p-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <div className="text-xs font-medium">
              <div>{playerData.street}</div>
              <div className="opacity-70 text-[10px]">{playerData.area}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MinimapModule;
