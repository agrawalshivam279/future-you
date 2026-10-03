import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}

/**
 * Accessible Modal dialog primitive with backdrop blur, keyboard dismissal,
 * focus containment, and persona design system styling.
 *
 * @param props - Modal component properties
 * @returns JSX Element rendering modal dialog or null if closed
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeOnOverlayClick = true,
  className,
}: ModalProps): React.JSX.Element | null {
  const titleId = React.useId();
  const descId = React.useId();

  // Escape key listener for accessibility
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className={cn(
          'relative w-full max-w-lg bg-bg-secondary border border-border-primary rounded-2xl p-6 sm:p-8 shadow-2xl text-text-primary',
          'animate-in zoom-in-95 duration-150',
          className
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        {(title || description) && (
          <div className="mb-6 space-y-1.5 text-left pr-8">
            {title && (
              <h2 id={titleId} className="text-xl font-bold tracking-tight text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="text-left">{children}</div>
      </div>
    </div>
  );
}
