import { MenuCategory, RESTAURANT_INFO } from '../data/restaurant';
import { ReservationForm } from './ReservationForm';

interface VisitSectionProps {
  savedDishIds: string[];
  onRemoveSavedDish: (dishId: string) => void;
  onSelectMenuTab: (tab: MenuCategory) => void;
}

export function VisitSection({
  savedDishIds,
  onRemoveSavedDish,
  onSelectMenuTab,
}: VisitSectionProps) {
  const handleFooterMenuNav = (tab: MenuCategory) => {
    onSelectMenuTab(tab);
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="visit" className="py-20 lg:py-24 border-b border-[#E2E2DE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Visit, Hours & Group Bookings Info */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <p className="text-xs font-medium text-[#5A5C59] mb-2">
                  Visit &amp; Table Booking
                  <span className="mx-2 text-[#C4C4BC]" aria-hidden="true">
                    ·
                  </span>
                  {RESTAURANT_INFO.city}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#141514] text-balance mb-4">
                  Drop by Nai Sarai, near Shiv Mandir.
                </h2>
                <p className="text-[15px] leading-relaxed text-[#5A5C59]">
                  Whether it is an 8:00 AM chai and breakfast stop, an afternoon burger and cold
                  coffee hangout, or a family dinner centered around sizzling Afghani Chaap, our
                  doors stay open every day until 11:00 PM.
                </p>
              </div>

              <div className="divide-y divide-[#E2E2DE] border-y border-[#E2E2DE]">
                <div className="py-5 grid grid-cols-12 gap-4">
                  <span className="col-span-4 text-xs text-[#5A5C59]">Address</span>
                  <div className="col-span-8 text-sm text-[#141514]">
                    <p className="font-medium">{RESTAURANT_INFO.name}</p>
                    <p className="text-[#5A5C59]">{RESTAURANT_INFO.addressLine1}</p>
                    <p className="text-[#5A5C59]">{RESTAURANT_INFO.addressLine2}</p>
                    <p className="text-xs text-[#5A5C59] mt-1.5">
                      Landmark: Directly near Shiv Mandir · Convenient dine-in, counter pickup &amp;
                      local delivery
                    </p>
                  </div>
                </div>

                <div className="py-5 grid grid-cols-12 gap-4">
                  <span className="col-span-4 text-xs text-[#5A5C59]">Hours</span>
                  <div className="col-span-8 text-sm text-[#141514] space-y-1 tabular-nums">
                    <p>
                      <span className="font-medium">Monday – Sunday:</span> 8:00 AM – 11:00 PM
                    </p>
                    <p className="text-xs text-[#5A5C59] pt-0.5">
                      {RESTAURANT_INFO.morningNote}
                    </p>
                  </div>
                </div>

                <div className="py-5 grid grid-cols-12 gap-4">
                  <span className="col-span-4 text-xs text-[#5A5C59]">Parties &amp; Groups</span>
                  <div className="col-span-8 text-sm text-[#141514]">
                    <p className="leading-relaxed text-[#5A5C59]">
                      Hosting a birthday, college meetup, or family get-together for up to 25
                      guests? Choose &ldquo;Group / Birthday Party (9–25)&rdquo; in the booking
                      form or write to{' '}
                      <a
                        href={`mailto:${RESTAURANT_INFO.eventsEmail}`}
                        className="text-[#141514] underline underline-offset-4 hover:text-[#1E3A2F]"
                      >
                        {RESTAURANT_INFO.eventsEmail}
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="py-5 grid grid-cols-12 gap-4">
                  <span className="col-span-4 text-xs text-[#5A5C59]">Direct Contact</span>
                  <div className="col-span-8 text-sm text-[#141514] space-y-1 tabular-nums">
                    <p>
                      <a
                        href="tel:+919811042190"
                        className="hover:text-[#1E3A2F] transition-colors duration-150"
                      >
                        {RESTAURANT_INFO.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${RESTAURANT_INFO.email}`}
                        className="text-[#5A5C59] hover:text-[#141514] transition-colors duration-150"
                      >
                        {RESTAURANT_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Reservation Module */}
            <div className="lg:col-span-7">
              <ReservationForm
                savedDishIds={savedDishIds}
                onRemoveSavedDish={onRemoveSavedDish}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="py-12 pb-20 md:pb-12 bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <a href="#top" className="font-display text-2xl font-medium text-[#141514]">
              {RESTAURANT_INFO.name}
            </a>
            <span className="text-xs text-[#5A5C59]">
              {RESTAURANT_INFO.addressLine1}, {RESTAURANT_INFO.city} · 8:00 AM – 11:00 PM
            </span>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#5A5C59]"
          >
            <button
              type="button"
              onClick={() => handleFooterMenuNav('chaap')}
              className="hover:text-[#141514] transition-colors duration-150 cursor-pointer"
            >
              Afghani Chaap
            </button>
            <button
              type="button"
              onClick={() => handleFooterMenuNav('fastfood')}
              className="hover:text-[#141514] transition-colors duration-150 cursor-pointer"
            >
              Fast Food
            </button>
            <button
              type="button"
              onClick={() => handleFooterMenuNav('combos')}
              className="hover:text-[#141514] transition-colors duration-150 cursor-pointer"
            >
              Value Combos
            </button>
            <button
              type="button"
              onClick={() => handleFooterMenuNav('drinks')}
              className="hover:text-[#141514] transition-colors duration-150 cursor-pointer"
            >
              Chai &amp; Shakes
            </button>
          </nav>

          <p className="text-xs text-[#5A5C59]">
            &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
