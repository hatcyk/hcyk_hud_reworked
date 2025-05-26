import { Wifi, WifiOff, Mic, MicOff, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHudStore } from '../../store/hudStore';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

type StatusIconsModuleProps = {
  className?: string;
}

function StatusIconsModule({ className }: StatusIconsModuleProps) {
  const { modules } = useHudStore();
  const settings = modules.statusIcons;
  const [time, setTime] = useState(new Date());
  const [talking, setTalking] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Randomly toggle talking status for demo
      if (Math.random() > 0.9) {
        setTalking(prev => !prev);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!settings.enabled) return null;

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      className={cn(
        "hud-module p-3 flex gap-4 items-center",
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: settings.opacity, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1">
        <Timer className="h-4 w-4 text-white/80" />
        <span className="text-sm font-medium">{formattedTime}</span>
      </div>

      <motion.div
        className="flex items-center gap-1"
        animate={{
          color: talking ? 'rgb(74, 222, 128)' : 'rgb(255, 255, 255, 0.8)'
        }}
      >
        {talking ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </motion.div>

      <motion.div
        className="flex items-center gap-1"
        animate={{
          color: connected ? 'rgb(255, 255, 255, 0.8)' : 'rgb(239, 68, 68)'
        }}
      >
        {connected ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
      </motion.div>
    </motion.div>
  );
}

export default StatusIconsModule;
