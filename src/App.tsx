import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { MenuCategory } from './data/restaurant';
import { useOrderBag } from './hooks/useOrderBag';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { StorySection } from './components/StorySection';
import { VisitSection } from './components/VisitSection';
import { ReservationModal } from './components/ReservationModal';
import { OrderBagDrawer } from './components/OrderBagDrawer';

export default function App() {
  const [activeMenuTab, setActiveMenuTab] = useState<MenuCategory>('chaap');
  const [savedDishIds, setSavedDishIds] = useState<string[]>([]);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isOrderBagOpen, setIsOrderBagOpen] = useState(false);

  const {
    items: bagItems,
    totalItems: bagCount,
    subtotal: bagSubtotal,
    lastOrder,
    setLastOrder,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearBag,
  } = useOrderBag();

  const handleToggleSaveDish = (dishId: string) => {
    setSavedDishIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const handleRemoveSavedDish = (dishId: string) => {
    setSavedDishIds((prev) => prev.filter((id) => id !== dishId));
  };

  const handleExploreMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#141514]">
      <Header
        bagCount={bagCount}
        bagSubtotal={bagSubtotal}
        onOpenReservation={() => setIsReservationModalOpen(true)}
        onOpenOrderBag={() => setIsOrderBagOpen(true)}
        onSelectMenuTab={setActiveMenuTab}
      />

      <main>
        <Hero
          onOpenReservation={() => setIsReservationModalOpen(true)}
          onExploreMenu={handleExploreMenu}
        />

        <MenuSection
          activeTab={activeMenuTab}
          onTabChange={setActiveMenuTab}
          savedDishIds={savedDishIds}
          onToggleSaveDish={handleToggleSaveDish}
          onReserveWithSaved={() => setIsReservationModalOpen(true)}
          bagItems={bagItems}
          bagCount={bagCount}
          bagSubtotal={bagSubtotal}
          lastOrder={lastOrder}
          onAddToBag={addItem}
          onIncrementBagItem={incrementItem}
          onDecrementBagItem={decrementItem}
          onOpenOrderBag={() => setIsOrderBagOpen(true)}
        />

        <StorySection />

        <VisitSection
          savedDishIds={savedDishIds}
          onRemoveSavedDish={handleRemoveSavedDish}
          onSelectMenuTab={setActiveMenuTab}
        />
      </main>

      {/* Slim mobile-only sticky bar when items are in bag (48px height, well under 15% mobile cap) */}
      {bagCount > 0 && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#1E3A2F] text-[#F8F8F6] border-t border-[#152921] px-4 h-12 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-medium tabular-nums">
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>
              {bagCount} {bagCount === 1 ? 'item' : 'items'} · ₹{bagSubtotal}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setIsOrderBagOpen(true)}
            className="text-xs font-medium underline underline-offset-4 whitespace-nowrap cursor-pointer"
          >
            View Order Bag
          </button>
        </div>
      )}

      <OrderBagDrawer
        isOpen={isOrderBagOpen}
        onClose={() => setIsOrderBagOpen(false)}
        items={bagItems}
        subtotal={bagSubtotal}
        lastOrder={lastOrder}
        onSetLastOrder={setLastOrder}
        onAddQuickItem={(dish) => addItem(dish)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onClearBag={clearBag}
      />

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        savedDishIds={savedDishIds}
        onRemoveSavedDish={handleRemoveSavedDish}
      />
    </div>
  );
}
