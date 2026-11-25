import { useEffect } from 'react';
import { X } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant';
import { ReservationForm } from './ReservationForm';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDishIds: string[];
  onRemoveSavedDish: (dishId: string) => void;
}

export function ReservationModal({
  isOpen,
  onClose,
  savedDishIds,
  onRemoveSavedDish,
}: ReservationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-[#141514]/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-8 py-5 bg-[#F8F8F6] border-b border-[#E2E2DE]">
          <div>
            <p className="text-xs text-[#5A5C59] mb-0.5">
              {RESTAURANT_INFO.name} · {RESTAURANT_INFO.neighborhood}
            </p>
            <h2
              id="reservation-modal-title"
              className="font-display text-2xl sm:text-3xl font-medium text-[#141514]"
            >
              Book a Table
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="p-2.5 text-[#5A5C59] hover:text-[#141514] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <ReservationForm
            savedDishIds={savedDishIds}
            onRemoveSavedDish={onRemoveSavedDish}
            compact
          />
        </div>
      </div>
    </div>
  );
}
