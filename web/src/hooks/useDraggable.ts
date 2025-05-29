import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  bounds?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
}

export const useDraggable = (options: UseDraggableOptions = {}) => {
  const [position, setPosition] = useState<Position>(
    options.initialPosition || { x: 100, y: 100 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    setIsDragging(true);
    
    // Prevent text selection and other interactions
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    let newX = clientX - offsetRef.current.x;
    let newY = clientY - offsetRef.current.y;

    // Apply bounds if specified
    if (options.bounds) {
      const { left = -Infinity, top = -Infinity, right = Infinity, bottom = Infinity } = options.bounds;
      newX = Math.max(left, Math.min(right, newX));
      newY = Math.max(top, Math.min(bottom, newY));
    }

    // Keep within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = dragRef.current?.offsetWidth || 0;
    const elementHeight = dragRef.current?.offsetHeight || 0;

    newX = Math.max(0, Math.min(viewportWidth - elementWidth, newX));
    newY = Math.max(0, Math.min(viewportHeight - elementHeight, newY));

    setPosition({ x: newX, y: newY });
  }, [isDragging, options.bounds]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    
    // Restore default styles
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  // Touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  // Global event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      // Handle edge cases
      document.addEventListener('mouseleave', handleEnd);
      window.addEventListener('blur', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseleave', handleEnd);
      window.removeEventListener('blur', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  return {
    position,
    isDragging,
    dragRef,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
    setPosition,
  };
};
