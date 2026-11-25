import { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
} from 'lucide-react';
import {
  MENU_ITEMS,
  MenuCategory,
  MenuFilterTag,
  MenuItem,
  SIGNATURE_DISHES,
  SPICE_LEVELS,
  SpiceLevel,
} from '../data/restaurant';
import { buildCartKey, ConfirmedOrder, OrderBagItem } from '../hooks/useOrderBag';
import { ResilientImage } from './ResilientImage';

interface MenuSectionProps {
  activeTab: MenuCategory;
  onTabChange: (tab: MenuCategory) => void;
  savedDishIds: string[];
  onToggleSaveDish: (dishId: string) => void;
  onReserveWithSaved: () => void;
  bagItems: OrderBagItem[];
  bagCount: number;
  bagSubtotal: number;
  lastOrder: ConfirmedOrder | null;
  onAddToBag: (
    dish: MenuItem,
    options?: { variantLabel?: string; unitPrice?: number; spiceLevel?: SpiceLevel }
  ) => void;
  onIncrementBagItem: (cartKey: string) => void;
  onDecrementBagItem: (cartKey: string) => void;
  onOpenOrderBag: () => void;
}

const CATEGORY_TABS: { id: MenuCategory; label: string }[] = [
  { id: 'chaap', label: 'Afghani & Tandoor' },
  { id: 'fastfood', label: 'Fast Food & Cafe' },
  { id: 'combos', label: 'Value Combos' },
  { id: 'morning', label: 'Morning & Bites' },
  { id: 'drinks', label: 'Chai, Coffee & Shakes' },
];

const MENU_FILTERS: { id: 'all' | MenuFilterTag; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'special', label: 'House Specials' },
  { id: 'spicy', label: 'Spicy' },
];

export function MenuSection({
  activeTab,
  onTabChange,
  savedDishIds,
  onToggleSaveDish,
  onReserveWithSaved,
  bagItems,
  bagCount,
  bagSubtotal,
  lastOrder,
  onAddToBag,
  onIncrementBagItem,
  onDecrementBagItem,
  onOpenOrderBag,
}: MenuSectionProps) {
  const [filterTag, setFilterTag] = useState<'all' | MenuFilterTag>('all');
  const [expandedDishId, setExpandedDishId] = useState<string | null>('afghani-malai-chaap');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<Record<string, number>>({});
  const [selectedSpice, setSelectedSpice] = useState<Record<string, SpiceLevel>>({});

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (item.category !== activeTab) return false;
      if (filterTag === 'all') return true;
      return item.tags.includes(filterTag);
    });
  }, [activeTab, filterTag]);

  const groupedBySubsection = useMemo(() => {
    const groups: { title: string; items: MenuItem[] }[] = [];
    for (const item of filteredItems) {
      const existing = groups.find((g) => g.title === item.subsection);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ title: item.subsection, items: [item] });
      }
    }
    return groups;
  }, [filteredItems]);

  const getActiveConfig = (dish: MenuItem) => {
    const idx = selectedVariantIdx[dish.id] ?? 0;
    const variant = dish.variants?.[idx];
    const variantLabel = variant?.label ?? dish.unit ?? 'Standard';
    const unitPrice = variant?.price ?? dish.price;
    const spiceLevel = dish.supportsSpice ? (selectedSpice[dish.id] ?? 'Medium') : undefined;
    const cartKey = buildCartKey(dish.id, variantLabel, spiceLevel);
    const bagEntry = bagItems.find((entry) => entry.cartKey === cartKey);

    return { idx, variantLabel, unitPrice, spiceLevel, cartKey, bagEntry };
  };

  const handleInspectSignatureDish = (dish: MenuItem) => {
    onTabChange(dish.category);
    setFilterTag('all');
    setExpandedDishId(dish.id);
    const listEl = document.getElementById('full-menu-list');
    if (listEl) {
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="menu" className="py-20 lg:py-24 border-b border-[#E2E2DE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-medium text-[#5A5C59] mb-2">
              Order Online or Dine In
              <span className="mx-2 text-[#C4C4BC]" aria-hidden="true">
                ·
              </span>
              8:00 AM – 11:00 PM
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#141514] text-balance">
              Signature Afghani Chaap &amp; Delhi fast food
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#5A5C59] max-w-md">
            Choose half or full plates, pick your spice level, and add straight to your Order Bag
            for 15-minute counter pickup or local Nai Sarai delivery.
          </p>
        </div>

        {/* Signature Plates Visual Triptych (uniform 4:3 cards, identical field order) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {SIGNATURE_DISHES.map((dish) => {
            const { variantLabel, unitPrice, spiceLevel, cartKey, bagEntry } =
              getActiveConfig(dish);
            return (
              <article
                key={dish.id}
                className="flex flex-col bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFEFED] border-b border-[#E2E2DE]">
                  <ResilientImage
                    src={dish.featuredImage || ''}
                    alt={`${dish.name} — ${dish.description}`}
                    fallbackTitle={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs text-[#5A5C59] mb-2">
                      <span>{dish.featuredLabel}</span>
                      <span className="font-medium text-[#141514] tabular-nums">
                        ₹{unitPrice}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-medium text-[#141514] leading-snug mb-2">
                      {dish.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A5C59] mb-5">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E2DE] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleInspectSignatureDish(dish)}
                      className="text-xs font-medium text-[#5A5C59] hover:text-[#141514] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap cursor-pointer"
                    >
                      Customize &amp; details
                    </button>

                    {bagEntry ? (
                      <div className="inline-flex items-center border border-[#1E3A2F] bg-[#1E3A2F] text-[#F8F8F6] rounded-sm">
                        <button
                          type="button"
                          onClick={() => onDecrementBagItem(cartKey)}
                          aria-label={`Remove one ${dish.name}`}
                          className="px-2.5 py-1.5 hover:bg-[#152921] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium tabular-nums">
                          {bagEntry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrementBagItem(cartKey)}
                          aria-label={`Add one more ${dish.name}`}
                          className="px-2.5 py-1.5 hover:bg-[#152921] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onAddToBag(dish, { variantLabel, unitPrice, spiceLevel })
                        }
                        className="px-4 py-1.5 text-xs font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        Add to Order
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Full Interactive Menu */}
        <div id="full-menu-list" className="scroll-mt-24">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-6 border-b border-[#E2E2DE]">
            {/* Category Tabs (functional segmented buttons) */}
            <div
              role="tablist"
              aria-label="Menu categories"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm self-start"
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      onTabChange(tab.id);
                      setExpandedDishId(null);
                    }}
                    className={`px-3.5 py-2 text-sm font-medium rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#F8F8F6] text-[#141514] shadow-xs'
                        : 'text-[#5A5C59] hover:text-[#141514]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Menu Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-[#5A5C59]">Filter:</span>
              <div className="inline-flex items-center gap-1">
                {MENU_FILTERS.map((filter) => {
                  const active = filterTag === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setFilterTag(filter.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#1E3A2F] text-[#F8F8F6]'
                          : 'text-[#5A5C59] hover:text-[#141514] hover:bg-[#EFEFED]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Order Bag Summary Bar (or Last Receipt Link) */}
          {bagCount > 0 ? (
            <div className="mt-6 px-5 py-3.5 bg-[#EFEFED] border border-[#1E3A2F]/25 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-[#141514]">
                <ShoppingBag className="w-4 h-4 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                <p>
                  <span className="font-medium tabular-nums">
                    {bagCount} {bagCount === 1 ? 'item' : 'items'}
                  </span>{' '}
                  in your Order Bag ·{' '}
                  <span className="font-medium tabular-nums">₹{bagSubtotal}</span>
                  {bagSubtotal >= 399
                    ? ' — Free local delivery unlocked'
                    : ` — Add ₹${399 - bagSubtotal} for free Nai Sarai delivery`}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenOrderBag}
                className="px-4 py-2 text-xs font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
              >
                View Order Bag &amp; Checkout
              </button>
            </div>
          ) : lastOrder ? (
            <div className="mt-6 px-5 py-3.5 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-sm text-[#141514]">
                <ReceiptText className="w-4 h-4 text-[#1E3A2F] shrink-0" aria-hidden="true" />
                <p>
                  Recent order{' '}
                  <span className="font-medium tabular-nums">#{lastOrder.orderId}</span>{' '}
                  confirmed ({lastOrder.fulfillmentMode === 'pickup' ? 'Pickup' : 'Local Delivery'} ·{' '}
                  <span className="tabular-nums">₹{lastOrder.total}</span>).
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenOrderBag}
                className="text-xs font-medium text-[#1E3A2F] hover:text-[#152921] underline underline-offset-4 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
              >
                View Receipt
              </button>
            </div>
          ) : null}

          {/* Saved Table Notes Notification Bar */}
          {savedDishIds.length > 0 && (
            <div className="mt-4 px-5 py-3 bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#5A5C59]">
                <span className="font-medium text-[#141514] tabular-nums">
                  {savedDishIds.length}
                </span>{' '}
                {savedDishIds.length === 1 ? 'dish' : 'dishes'} noted for dine-in table booking.
              </p>
              <button
                type="button"
                onClick={onReserveWithSaved}
                className="text-xs sm:text-sm font-medium text-[#1E3A2F] hover:text-[#152921] underline underline-offset-4 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Book Table with Notes
              </button>
            </div>
          )}

          {/* Menu Items List */}
          {groupedBySubsection.length === 0 ? (
            <div className="py-16 text-center border-b border-[#E2E2DE]">
              <p className="font-display text-2xl text-[#141514] mb-2">
                No items match that filter in this category.
              </p>
              <p className="text-sm text-[#5A5C59] mb-5">
                Spice levels can be adjusted mild, medium, or extra spicy on every order.
              </p>
              <button
                type="button"
                onClick={() => setFilterTag('all')}
                className="px-4 py-2 text-sm font-medium text-[#141514] border border-[#E2E2DE] bg-[#EFEFED] hover:bg-[#E2E2DE] rounded-sm transition-colors duration-150 cursor-pointer"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-14">
              {groupedBySubsection.map((group) => (
                <div key={group.title}>
                  <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#141514]/15 mb-2">
                    <h3 className="font-display text-2xl font-medium text-[#141514]">
                      {group.title}
                    </h3>
                    <span className="text-xs text-[#5A5C59] tabular-nums">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="divide-y divide-[#E2E2DE]">
                    {group.items.map((item) => {
                      const isExpanded = expandedDishId === item.id;
                      const isSaved = savedDishIds.includes(item.id);
                      const { idx, variantLabel, unitPrice, spiceLevel, cartKey, bagEntry } =
                        getActiveConfig(item);
                      const tagMarkers = [
                        item.tags.includes('special') ? 'House Special' : null,
                        item.tags.includes('spicy') ? 'Spicy' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ');

                      return (
                        <div key={item.id} className="py-5">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedDishId(isExpanded ? null : item.id)
                                }
                                aria-expanded={isExpanded}
                                className="text-left group cursor-pointer"
                              >
                                <div className="flex items-baseline gap-2.5 flex-wrap">
                                  <span className="font-display text-xl sm:text-[22px] font-medium text-[#141514] group-hover:text-[#1E3A2F] transition-colors duration-150">
                                    {item.name}
                                  </span>
                                  {tagMarkers && (
                                    <span className="text-xs text-[#5A5C59]">
                                      — {tagMarkers}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#5A5C59] leading-relaxed mt-1 max-w-2xl">
                                  {item.description}
                                </p>
                              </button>

                              {/* Inline Half / Full Variant Toggle */}
                              {item.variants && item.variants.length > 1 && (
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <span className="text-xs text-[#5A5C59]">Portion:</span>
                                  <div className="inline-flex items-center gap-1 p-0.5 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm">
                                    {item.variants.map((variant, vIdx) => {
                                      const activeVariant = idx === vIdx;
                                      return (
                                        <button
                                          key={variant.label}
                                          type="button"
                                          onClick={() =>
                                            setSelectedVariantIdx((prev) => ({
                                              ...prev,
                                              [item.id]: vIdx,
                                            }))
                                          }
                                          className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap tabular-nums cursor-pointer ${
                                            activeVariant
                                              ? 'bg-[#F8F8F6] text-[#141514] shadow-xs'
                                              : 'text-[#5A5C59] hover:text-[#141514]'
                                          }`}
                                        >
                                          {variant.label} · ₹{variant.price}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Price + Quick-Add Stepper + Expand */}
                            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-0.5">
                              <div className="text-left md:text-right">
                                <span className="text-sm font-medium text-[#141514] tabular-nums">
                                  ₹{unitPrice}
                                </span>
                                {!item.variants && item.unit && (
                                  <p className="text-xs text-[#5A5C59] tabular-nums">
                                    {item.unit}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {bagEntry ? (
                                  <div className="inline-flex items-center border border-[#1E3A2F] bg-[#1E3A2F] text-[#F8F8F6] rounded-sm">
                                    <button
                                      type="button"
                                      onClick={() => onDecrementBagItem(cartKey)}
                                      aria-label={`Remove one ${item.name}`}
                                      className="px-2.5 py-1.5 hover:bg-[#152921] transition-colors cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-6 text-center text-xs font-medium tabular-nums">
                                      {bagEntry.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => onIncrementBagItem(cartKey)}
                                      aria-label={`Add one more ${item.name}`}
                                      className="px-2.5 py-1.5 hover:bg-[#152921] transition-colors cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onAddToBag(item, {
                                        variantLabel,
                                        unitPrice,
                                        spiceLevel,
                                      })
                                    }
                                    className="px-4 py-1.5 text-xs font-medium text-[#141514] bg-[#EFEFED] hover:bg-[#1E3A2F] hover:text-[#F8F8F6] border border-[#E2E2DE] hover:border-[#1E3A2F] rounded-sm transition-colors duration-150 whitespace-nowrap cursor-pointer"
                                  >
                                    Add
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedDishId(isExpanded ? null : item.id)
                                  }
                                  aria-label={
                                    isExpanded
                                      ? `Hide details for ${item.name}`
                                      : `Show details for ${item.name}`
                                  }
                                  className="p-2 text-[#5A5C59] hover:text-[#141514] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-[#E2E2DE]/70 grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#EFEFED]/60 p-4 sm:p-5 rounded-sm">
                              <div className="md:col-span-4 space-y-3">
                                <div>
                                  <p className="text-xs text-[#5A5C59] mb-1">Preparation</p>
                                  <p className="text-sm text-[#141514]">{item.provenance}</p>
                                </div>
                                {item.supportsSpice && (
                                  <div>
                                    <p className="text-xs text-[#5A5C59] mb-1.5">Spice Level</p>
                                    <div className="inline-flex items-center gap-1 p-0.5 bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm">
                                      {SPICE_LEVELS.map((level) => {
                                        const activeSpice =
                                          (selectedSpice[item.id] ?? 'Medium') === level;
                                        return (
                                          <button
                                            key={level}
                                            type="button"
                                            onClick={() =>
                                              setSelectedSpice((prev) => ({
                                                ...prev,
                                                [item.id]: level,
                                              }))
                                            }
                                            className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                                              activeSpice
                                                ? 'bg-[#1E3A2F] text-[#F8F8F6]'
                                                : 'text-[#5A5C59] hover:text-[#141514]'
                                            }`}
                                          >
                                            {level}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="md:col-span-4">
                                <p className="text-xs text-[#5A5C59] mb-1">Kitchen Note</p>
                                <p className="text-sm text-[#141514] leading-relaxed">
                                  {item.chefNote}
                                </p>
                              </div>

                              <div className="md:col-span-4 flex flex-col justify-between gap-3">
                                <div>
                                  <p className="text-xs text-[#5A5C59] mb-1">
                                    Recommended With
                                  </p>
                                  <p className="text-sm text-[#141514]">{item.pairing}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onToggleSaveDish(item.id)}
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-sm border transition-colors duration-150 cursor-pointer ${
                                      isSaved
                                        ? 'bg-[#1E3A2F] text-[#F8F8F6] border-[#1E3A2F]'
                                        : 'bg-[#F8F8F6] text-[#141514] border-[#E2E2DE] hover:border-[#141514]/40'
                                    }`}
                                  >
                                    {isSaved ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span>Noted for Dine-In</span>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span>Note for Dine-In</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quiet Menu Footnote */}
          <p className="mt-10 text-xs text-[#5A5C59] leading-relaxed">
            All prices are in Indian Rupees (₹). Counter pickup is ready in 15–20 minutes near Shiv
            Mandir. Local Nai Sarai delivery is free on orders ₹399 and above (₹30 flat below ₹399).
          </p>
        </div>
      </div>
    </section>
  );
}
