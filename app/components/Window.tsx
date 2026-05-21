"use client";

import { useRef, useEffect, useState } from "react";

interface WindowProps {
  id: string;
  title: string;
  emoji: string;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { w: number; h: number };
}

export default function Window({
  id, title, emoji, children, onClose, onFocus, zIndex, initialPosition, initialSize,
}: WindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initialPosition ?? { x: 100, y: 80 });
  const [size, setSize] = useState(initialSize ?? { w: 700, h: 500 });
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus(id);
  };

  const style = maximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 70px)", borderRadius: 0 }
    : { top: pos.y, left: pos.x, width: size.w, height: size.h };

  return (
    <div
      ref={ref}
      className="window"
      style={{ ...style, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title bar */}
      <div className="window-header" onMouseDown={onHeaderMouseDown}>
        <div style={{ display: "flex", gap: "6px", marginRight: "8px" }}>
          <div className="dot" style={{ background: "#ff5f56" }} onClick={() => onClose(id)} title="Close" />
          <div className="dot" style={{ background: "#ffbd2e" }} onClick={() => setMaximized(false)} title="Minimize" />
          <div className="dot" style={{ background: "#27c93f" }} onClick={() => setMaximized(m => !m)} title="Maximize" />
        </div>
        <span style={{ fontSize: "14px" }}>{emoji}</span>
        <span style={{ fontSize: "13px", color: "#c9d1d9", fontWeight: 500 }}>{title}</span>
      </div>
      {/* Content */}
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}