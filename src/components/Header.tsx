import { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { MenuCategory, RESTAURANT_INFO } from '../data/restaurant';

interface HeaderProps {
  bagCount: number;
  bagSubtotal: number;
  onOpenReservation: () => void;
  onOpenOrderBag: () => void;
  onSelectMenuTab: (tab: MenuCategory) => void;
}

export function Header({
  bagCount,
  bagSubtotal,
  onOpenReservation,
  onOpenOrderBag,
  onSelectMenuTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigateMenu = (tab: MenuCategory) => {
    onSelectMenuTab(tab);
    setMobileMenuOpen(false);
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F8F6]/95 backdrop-blur-sm border-b border-[#E2E2DE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-medium tracking-tight text-[#141514] whitespace-nowrap shrink-0"
        >
          {RESTAURANT_INFO.brandShort}
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A5C59]"
        >
          <button
            type="button"
            onClick={() => handleNavigateMenu('chaap')}
            className="hover:text-[#141514] hover:underline underline-offset-4 decoration-[#1E3A2F]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Afghani Chaap
          </button>
          <button
            type="button"
            onClick={() => handleNavigateMenu('fastfood')}
            className="hover:text-[#141514] hover:underline underline-offset-4 decoration-[#1E3A2F]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fast Food
          </button>
          <button
            type="button"
            onClick={() => handleNavigateMenu('combos')}
            className="hover:text-[#141514] hover:underline underline-offset-4 decoration-[#1E3A2F]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Combos
          </button>
          <a
            href="#visit"
            className="hover:text-[#141514] hover:underline underline-offset-4 decoration-[#1E3A2F]/50 transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Visit
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {bagCount > 0 ? (
            <button
              type="button"
              onClick={onOpenOrderBag}
              className="px-5 py-2.5 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
            >
              Order Bag ({bagCount}) · ₹{bagSubtotal}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenReservation}
              className="px-5 py-2.5 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book a Table
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2.5 text-[#141514] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8F8F6] border-b border-[#E2E2DE] px-6 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-[#E2E2DE]">
            <button
              type="button"
              onClick={() => handleNavigateMenu('chaap')}
              className="py-3 text-left text-base font-medium text-[#141514] cursor-pointer"
            >
              Afghani Chaap &amp; Tandoor
            </button>
            <button
              type="button"
              onClick={() => handleNavigateMenu('fastfood')}
              className="py-3 text-left text-base font-medium text-[#141514] cursor-pointer"
            >
              Fast Food &amp; Cafe Menu
            </button>
            <button
              type="button"
              onClick={() => handleNavigateMenu('combos')}
              className="py-3 text-left text-base font-medium text-[#141514] cursor-pointer"
            >
              Value Combos
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderBag();
              }}
              className="py-3 text-left text-base font-medium text-[#1E3A2F] cursor-pointer"
            >
              View Order Bag {bagCount > 0 ? `(${bagCount} · ₹${bagSubtotal})` : ''}
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('visit')}
              className="py-3 text-left text-base font-medium text-[#141514] cursor-pointer"
            >
              Visit &amp; Book a Table
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
