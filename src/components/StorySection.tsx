import { PRESS_NOTES, PROVENANCE_FACTS, RESTAURANT_INFO } from '../data/restaurant';
import { ResilientImage } from './ResilientImage';

export function StorySection() {
  return (
    <section id="story" className="py-20 lg:py-24 bg-[#EFEFED]/55 border-b border-[#E2E2DE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Editorial intro + wide 16:9 documentary tandoor kitchen frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-[#5A5C59] mb-2">
              Our Kitchen
              <span className="mx-2 text-[#C4C4BC]" aria-hidden="true">
                ·
              </span>
              {RESTAURANT_INFO.neighborhood}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#141514] text-balance mb-6">
              Live charcoal tandoor meets classic Delhi cafe comfort.
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-[#5A5C59]">
              <p>
                Located right near Shiv Mandir in Nai Sarai, {RESTAURANT_INFO.name} brings together
                the two flavors New Delhi craves most: rich, smoky charcoal-roasted Afghani Chaap
                and fresh, piping-hot cafe fast food made in a spotless open kitchen.
              </p>
              <p>
                We fire up the coffee bar and breakfast griddle at 8:00 AM sharp for morning kullad
                chai, bun maska, and stuffed parathas. By midday through 11:00 PM, our clay tandoor
                and high-flame wok turn out skewers of creamy Afghani Malai Chaap, Tandoori Momos,
                stone-baked pizzas, burgers, and thick cold coffee.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#E2E2DE] bg-[#EFEFED]">
              <ResilientImage
                src={RESTAURANT_INFO.storyImage}
                alt="Chef at Delhi Bites Cafe and Restaurant pulling sizzling skewers of golden Afghani Chaap fresh from the glowing charcoal clay tandoor oven"
                fallbackTitle="Delhi Bites Tandoor Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-[#5A5C59]">
              Freshly marinated Afghani Malai Chaap roasted over live charcoal embers in our Nai
              Sarai kitchen.
            </p>
          </div>
        </div>

        {/* Adjacent Provenance Proof Strip */}
        <div className="py-10 border-y border-[#E2E2DE] grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROVENANCE_FACTS.map((fact) => (
            <div key={fact.value}>
              <p className="font-display text-3xl font-medium text-[#141514] tabular-nums mb-2">
                {fact.value}
              </p>
              <p className="text-sm leading-relaxed text-[#5A5C59]">{fact.label}</p>
            </div>
          ))}
        </div>

        {/* Attributable Guest & Local Reviewer Notes */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {PRESS_NOTES.map((note) => (
            <figure
              key={note.author}
              className="p-7 bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm flex flex-col justify-between"
            >
              <blockquote className="font-display text-xl sm:text-[22px] leading-snug text-[#141514] italic mb-6">
                &ldquo;{note.quote}&rdquo;
              </blockquote>
              <figcaption className="text-xs text-[#5A5C59] pt-4 border-t border-[#E2E2DE]">
                <span className="font-medium text-[#141514]">{note.author}</span>
                <span className="mx-2 text-[#C4C4BC]" aria-hidden="true">
                  ·
                </span>
                <span>{note.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
