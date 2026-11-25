import { ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export function Hero({ onOpenReservation, onExploreMenu }: HeroProps) {
  return (
    <section id="top" className="border-b border-[#E2E2DE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* Balanced 2-column split with stretched height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Editorial left column */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#5A5C59] mb-6">
                {RESTAURANT_INFO.neighborhood}
                <span className="mx-2 text-[#C4C4BC]" aria-hidden="true">
                  ·
                </span>
                {RESTAURANT_INFO.city}
              </p>

              <h1 className="font-display text-[clamp(2.5rem,4.2vw,3.75rem)] font-medium leading-[1.06] tracking-tight text-[#141514] text-balance mb-6">
                Charcoal Afghani Chaap and all-day Delhi fast food.
              </h1>

              <p className="text-[15px] sm:text-base leading-relaxed text-[#5A5C59] max-w-md mb-9">
                Welcome to {RESTAURANT_INFO.name}. Order smoky Afghani Chaap, Tandoori Momos,
                burgers, value combos, and cold coffee for quick pickup, local Nai Sarai delivery,
                or dine-in from 8 AM to 11 PM.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="px-6 py-3 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Order Online &amp; Menu
                </button>
                <button
                  type="button"
                  onClick={onOpenReservation}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#141514] hover:text-[#1E3A2F] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer group"
                >
                  <span>Book a Table</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E2E2DE] flex items-baseline justify-between gap-4 text-xs text-[#5A5C59]">
              <span>Dine-In · Pickup · Free Delivery ₹399+</span>
              <span className="tabular-nums text-[#141514] font-medium">
                {RESTAURANT_INFO.hoursSummary}
              </span>
            </div>
          </div>

          {/* Dominant architectural focal image */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden rounded-sm border border-[#E2E2DE] bg-[#EFEFED]">
              <ResilientImage
                src={RESTAURANT_INFO.heroImage}
                alt="Delhi Bites Cafe and Restaurant interior in Nai Sarai, New Delhi, showing warm wood tables, pendant lights, burgers with fries, and cold coffee"
                fallbackTitle="Delhi Bites Cafe & Restaurant"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column service strip below hero split */}
        <div className="mt-12 pt-8 border-t border-[#E2E2DE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <p className="text-xs text-[#5A5C59] mb-1">Opening Hours</p>
            <p className="text-sm font-medium text-[#141514] tabular-nums">
              Every Day · 8:00 AM – 11:00 PM
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5A5C59] mb-1">Address</p>
            <p className="text-sm font-medium text-[#141514]">
              {RESTAURANT_INFO.addressLine1}, {RESTAURANT_INFO.city}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5A5C59] mb-1">Pickup &amp; Local Delivery</p>
            <p className="text-sm font-medium text-[#141514] tabular-nums">
              15–20 min Pickup · Free Delivery ₹399+
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5A5C59] mb-1">Direct Order &amp; Table Desk</p>
            <p className="text-sm font-medium text-[#141514] tabular-nums">
              {RESTAURANT_INFO.phone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
