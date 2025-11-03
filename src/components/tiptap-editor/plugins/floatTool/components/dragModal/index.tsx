import React, { useEffect, useMemo, useRef, useState } from 'react';
import './draggableModal.css';

export interface DraggableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  renderContent?: (bindEvent: any, setCanCloseOutclick: any, close: () => void)=>React.ReactNode;
  initialPosition?: { top: number | string; left: number | string; transform?: string };
  showTip?: boolean;
  onAdopt?: () => void;
  onDiscard?: () => void;
}

export const DraggableModal: React.FC<DraggableModalProps> = ({
  open,
  onClose,
  children,
  renderContent,
  initialPosition,
  onAdopt,
  onDiscard,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  // 是否可以点击外部关闭
  const [canCloseOutclick, setCanCloseOutclick] = useState(true);

  const [position, setPosition] = useState<{
    top: number | string;
    left: number | string;
    transform?: string;
  }>(initialPosition ?? {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });
  const startPosRef = useRef<{
    x: number;
    y: number;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging || !startPosRef.current) return;
      const { x, y, top, left } = startPosRef.current;
      const dx = e.clientX - x; // 水平位移
      const dy = e.clientY - y; // 垂直位移（向下为正）

      const card = cardRef.current;
      const w = card?.offsetWidth || 0;
      const h = card?.offsetHeight || 0;
      const maxOffset = window.innerHeight - h; // bottom/top 的最大像素范围

      let nextLeft = left + dx;
      let nextTop = top + dy; // top 随向下移动而增大

      // 边界限制
      nextLeft = Math.max(0, Math.min(nextLeft, window.innerWidth - w));
      nextTop = Math.max(0, Math.min(nextTop, maxOffset));

      setPosition({ top: nextTop, left: nextLeft });
    };

    const onMouseUp = () => {
      setDragging(false);
      startPosRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [open, dragging]);

  const onContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // 切换到像素定位（bottom/left）并移除 transform
    const topPx = rect.top;
    setPosition({ top: topPx, left: rect.left });
    startPosRef.current = { x: e.clientX, y: e.clientY, top: topPx, left: rect.left };
    setDragging(true);
  };

  // 每次打开时，如果提供了 initialPosition，则重置位置
  useEffect(() => {
    if (open && initialPosition) {
      setPosition(initialPosition);
    }
  }, [open, initialPosition]);

  const ContentWithDrag = useMemo(() => {
    return renderContent ? renderContent(
      onContentMouseDown,
      setCanCloseOutclick,
      onClose
    ) : <div onMouseDown={onContentMouseDown}>{children}</div>
  }, [renderContent, onContentMouseDown])
  
  if (!open) return null;

  return (
    <div className="dm-overlay" onClick={() => {
      if (canCloseOutclick) onClose();
    }}>
      <div
        className="dm-card"
        ref={cardRef}
        style={{
          position: 'fixed',
          zIndex: 1000,
          top: position.top as any,
          left: position.left as any,
          transform: position.transform
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dm-content">
          {ContentWithDrag}
        </div>
      </div>
    </div>
  );
};