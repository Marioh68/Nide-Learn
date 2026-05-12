'use client';

import { useEffect, useRef } from 'react';

export interface MicroContentData {
  id: string;
  title: string;
  body: string;
}

interface MicroContentProps {
  content: MicroContentData;
  onClose: () => void;
}

export function MicroContent({ content, onClose }: MicroContentProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="mc-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mc-title"
        className="mc-panel"
      >
        <div className="mc-header">
          <span id="mc-title" className="mc-title">{content.title}</span>
          <button ref={closeRef} className="mc-close" onClick={onClose} aria-label="Sulje">×</button>
        </div>
        <div className="mc-body">
          <p>{content.body}</p>
        </div>
      </div>
    </>
  );
}
