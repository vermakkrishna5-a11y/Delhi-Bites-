export type MenuCategory = 'chaap' | 'fastfood' | 'combos' | 'morning' | 'drinks';
export type MenuFilterTag = 'special' | 'spicy';
export type SpiceLevel = 'Mild' | 'Medium' | 'Extra Spicy';

export interface MenuVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit?: string;
  variants?: MenuVariant[];
  supportsSpice?: boolean;
  category: MenuCategory;
  subsection: string;
  tags: MenuFilterTag[];
  provenance: string;
  chefNote: string;
  pairing: string;
  featuredImage?: string;
  featuredLabel?: string;
}

export interface SeatingArea {
  id: 'cafe-hall' | 'family-booths' | 'tandoor-counter';
  name: string;
  detail: string;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'limited';
}

export const ORDER_SETTINGS = {
  freeDeliveryThreshold: 399,
  deliveryFee: 30,
  pickupPrepTime: '15–20 mins',
  deliveryEstTime: '30–40 mins',
};

export const SPICE_LEVELS: SpiceLevel[] = ['Mild', 'Medium', 'Extra Spicy'];

export const RESTAURANT_INFO = {
  brandShort: 'Delhi Bites',
  name: 'Delhi Bites Cafe & Restaurant',
  neighborhood: 'Nai Sarai, Near Shiv Mandir',
  city: 'New Delhi',
  addressLine1: 'Nai Sarai, Near Shiv Mandir',
  addressLine2: 'New Delhi, Delhi',
  phone: '+91 98110 42190',
  email: 'hello@delhibitescafe.in',
  eventsEmail: 'bookings@delhibitescafe.in',
  hoursSummary: 'Open Daily · 8:00 AM – 11:00 PM',
  morningNote: 'Breakfast from 8:00 AM · Charcoal Tandoor till 11:00 PM',
  specialtySummary: 'Signature Afghani Chaap & All Fast Food',
  heroImage: '/src/assets/images/delhi_bites_hero_cafe_1795586974318.jpg',
  storyImage: '/src/assets/images/delhi_bites_tandoor_kitchen_1795586985073.jpg',
};

export const SIGNATURE_DISHES: MenuItem[] = [
  {
    id: 'afghani-malai-chaap',
    name: 'Signature Afghani Malai Chaap',
    description:
      'Tender soya chaap marinated overnight in rich cashew cream, green cardamom, and hung curd, roasted over live charcoal and finished with butter and chaat masala.',
    price: 240,
    unit: 'Full Plate (8 pcs) · Half ₹140',
    variants: [
      { label: 'Full Plate (8 pcs)', price: 240 },
      { label: 'Half Plate (4 pcs)', price: 140 },
    ],
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Charcoal Afghani & Soya Chaap',
    tags: ['special'],
    provenance: 'Marinated fresh each morning · Charcoal clay tandoor',
    chefNote:
      'Slow-charred on iron skewers for smoky edges while staying melt-in-the-mouth creamy inside. Served with pickled onions and house mint chutney.',
    pairing: 'Pair with soft Rumali Roti and Fresh Mint Virgin Mojito',
    featuredImage: '/src/assets/images/dish_afghani_chaap_1795586978393.jpg',
    featuredLabel: 'House Signature · Tandoor',
  },
  {
    id: 'tandoori-momos',
    name: 'Smoky Delhi Tandoori Momos',
    description:
      'Hand-folded vegetable and paneer dumplings glazed in spiced yogurt marinade, roasted in the clay tandoor, and tossed with melted butter and fresh coriander.',
    price: 180,
    unit: 'Full (8 pcs) · Half ₹110',
    variants: [
      { label: 'Full (8 pcs)', price: 180 },
      { label: 'Half (5 pcs)', price: 110 },
    ],
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Tandoori Starters & Momos',
    tags: ['special', 'spicy'],
    provenance: 'House-ground Kashmiri chilli & roasted cumin marinade',
    chefNote:
      'Crisped over glowing coals and served piping hot with our fiery red chilli-garlic dip and cooling pudina chutney.',
    pairing: 'Pair with Frosted Cold Coffee or Masala Shikanji',
    featuredImage: '/src/assets/images/dish_tandoori_momos_1795586981645.jpg',
    featuredLabel: 'Bestseller · Charcoal Grill',
  },
  {
    id: 'paneer-burger-combo',
    name: 'Spiced Paneer Cafe Burger & Fries',
    description:
      'Crisp golden herb-spiced paneer patty layered with melted cheddar, pickled onions, tomato, and house tandoori mayo on a toasted sesame bun with peri-peri fries.',
    price: 210,
    unit: 'Served with Peri-Peri Fries',
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Burgers, Sandwiches & Fries',
    tags: ['special'],
    provenance: 'Fresh malai paneer · Baked-daily brioche buns',
    chefNote:
      'Prepared to order on our flat-top griddle so the paneer stays crisp under warm melted cheese.',
    pairing: 'Pair with Signature Frosted Cold Coffee (₹140)',
    featuredImage: '/src/assets/images/dish_cafe_fastfood_platter_1795586978509.jpg',
    featuredLabel: 'All-Day Cafe · Fast Food',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // Tab 1: Afghani & Tandoor
  SIGNATURE_DISHES[0],
  {
    id: 'masala-soya-chaap',
    name: 'Old Delhi Masala Soya Chaap',
    description:
      'Charcoal-roasted soya chaap tossed in roasted red chilli, roasted gram flour, ginger-garlic, and tangy lemon butter glaze.',
    price: 220,
    unit: 'Full Plate · Half ₹130',
    variants: [
      { label: 'Full Plate (8 pcs)', price: 220 },
      { label: 'Half Plate (4 pcs)', price: 130 },
    ],
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Charcoal Afghani & Soya Chaap',
    tags: ['spicy'],
    provenance: 'House-roasted whole spice blend',
    chefNote:
      'Bold, smoky, and warmly spiced—our go-to plate for guests who prefer a punchier tandoori finish.',
    pairing: 'Pair with Butter Naan or Rumali Roti',
  },
  {
    id: 'achari-chaap',
    name: 'Punjabi Achari Chaap',
    description:
      'Skewered chaap marinated with mustard oil, fennel, kalonji, and tangy pickled spice masala, roasted crisp in the clay oven.',
    price: 230,
    unit: 'Full Plate · Half ₹135',
    variants: [
      { label: 'Full Plate (8 pcs)', price: 230 },
      { label: 'Half Plate (4 pcs)', price: 135 },
    ],
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Charcoal Afghani & Soya Chaap',
    tags: ['spicy'],
    provenance: 'Cold-pressed mustard oil & whole pickle spices',
    chefNote:
      'Finished with a squeeze of fresh lime and crisp laccha pyaz right before leaving the tandoor.',
    pairing: 'Pair with Sweet Lassi or Masala Soda',
  },
  {
    id: 'afghani-chaap-roll',
    name: 'Afghani Malai Chaap Rumali Roll',
    description:
      'Smoky Afghani chaap chunks wrapped hot inside hand-stretched rumali roti with mint chutney, cream drizzle, and crunchy red onions.',
    price: 160,
    unit: 'Jumbo Roll',
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Charcoal Afghani & Soya Chaap',
    tags: ['special'],
    provenance: 'Griddle-baked rumali roti made fresh per order',
    chefNote:
      'Our fastest takeaway and evening snack favorite near Shiv Mandir.',
    pairing: 'Pair with Adrak Elaichi Masala Chai',
  },
  SIGNATURE_DISHES[1],
  {
    id: 'afghani-paneer-tikka',
    name: 'Afghani Malai Paneer Tikka',
    description:
      'Thick-cut malai paneer cubes and bell peppers steeped in white pepper, cashew paste, and saffron cream, charred over coals.',
    price: 260,
    unit: '6 Skewered Pieces',
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Tandoori Starters & Momos',
    tags: ['special'],
    provenance: 'Fresh Delhi dairy paneer delivered daily at 7:00 AM',
    chefNote:
      'Soft, delicately smoky, and mild enough for the whole family.',
    pairing: 'Pair with Fresh Lime Mint Mojito',
  },
  {
    id: 'kurkure-momos',
    name: 'Crispy Kurkure Momos',
    description:
      'Crunchy spiced-crumb coated vegetable momos fried golden and dusted with signature Delhi chaat masala.',
    price: 160,
    unit: '8 Pieces',
    supportsSpice: true,
    category: 'chaap',
    subsection: 'Tandoori Starters & Momos',
    tags: ['spicy'],
    provenance: 'Served with schezwan & creamy tandoori dips',
    chefNote:
      'Extra crisp outer shell with a juicy cabbage, carrot, and ginger filling.',
    pairing: 'Pair with Iced Lemon Tea or Cold Coffee',
  },

  // Tab 2: Fast Food & Cafe
  SIGNATURE_DISHES[2],
  {
    id: 'double-cheese-burger',
    name: 'Delhi Bites Double Aloo Tikki Burger',
    description:
      'Twin crisp spiced potato patties with melted cheddar, crisp lettuce, sliced onion, and smoky chipotle sauce.',
    price: 130,
    unit: 'Single · With Fries ₹185',
    variants: [
      { label: 'Burger Only', price: 130 },
      { label: 'With Masala Fries', price: 185 },
    ],
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Burgers, Sandwiches & Fries',
    tags: [],
    provenance: 'Freshly toasted sesame buns',
    chefNote:
      'A classic neighborhood favorite served hot from 11:00 AM through 11:00 PM.',
    pairing: 'Pair with KitKat Thick Shake',
  },
  {
    id: 'peri-peri-loaded-fries',
    name: 'Loaded Peri-Peri Cheese Fries',
    description:
      'Golden skin-on French fries tossed in fiery peri-peri seasoning and drizzled with warm cheddar sauce and jalapeños.',
    price: 150,
    unit: 'Regular · Large ₹210',
    variants: [
      { label: 'Regular Basket', price: 150 },
      { label: 'Large Shareable', price: 210 },
    ],
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Burgers, Sandwiches & Fries',
    tags: ['spicy'],
    provenance: 'Double-fried for lasting crunch',
    chefNote:
      'Built for sharing across the table with friends over shakes and coffee.',
    pairing: 'Pair with Hazelnut Cold Coffee',
  },
  {
    id: 'grilled-bombay-club',
    name: 'Triple-Decker Cheese Grilled Sandwich',
    description:
      'Three-layer jumbo toast stuffed with spiced potato, cucumber, tomato, capsicum, green chutney, and bubbling mozzarella.',
    price: 155,
    unit: '4 Cut Triangles',
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Burgers, Sandwiches & Fries',
    tags: [],
    provenance: 'Butter-pressed on cast-iron grill',
    chefNote:
      'Served crisp with house tomato ketchup and mint chutney.',
    pairing: 'Pair with Cutting Masala Chai',
  },
  {
    id: 'tandoori-paneer-pizza',
    name: 'Smoky Tandoori Paneer Pizza',
    description:
      'Crisp hand-stretched crust topped with spiced makhani tomato sauce, tandoor-roasted paneer, red onions, capsicum, and mozzarella.',
    price: 290,
    unit: '10-Inch · 12-Inch ₹380',
    variants: [
      { label: '10-Inch (6 Slices)', price: 290 },
      { label: '12-Inch (8 Slices)', price: 380 },
    ],
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Cafe Pizzas, Pasta & Indo-Chinese',
    tags: ['special'],
    provenance: 'Stone-deck baked to order',
    chefNote:
      'Combines our signature charcoal paneer tikka with golden stretchy mozzarella.',
    pairing: 'Pair with Virgin Mint Mojito',
  },
  {
    id: 'white-sauce-pasta',
    name: 'Creamy Alfredo Penne Pasta',
    description:
      'Al dente penne tossed in slow-simmered roasted garlic cream sauce with sautéed broccoli, sweet corn, olives, and Italian herbs.',
    price: 220,
    unit: 'Served with 2 Garlic Breads',
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Cafe Pizzas, Pasta & Indo-Chinese',
    tags: ['special'],
    provenance: 'Finished with grated parmesan and cracked black pepper',
    chefNote:
      'Pink Arrabbiata mixed-sauce preparation also available on request.',
    pairing: 'Pair with Classic Cold Coffee',
  },
  {
    id: 'honey-chilli-potato',
    name: 'Crispy Honey Chilli Potato',
    description:
      'Wok-tossed crunchy potato fingers glazed in roasted sesame seeds, wildflower honey, spring onion, and fiery red chilli sauce.',
    price: 175,
    unit: 'Full Plate',
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Cafe Pizzas, Pasta & Indo-Chinese',
    tags: ['special', 'spicy'],
    provenance: 'High-flame iron wok preparation',
    chefNote:
      'Sweet, spicy, and ultra-crispy—one of our highest-ordered evening plates.',
    pairing: 'Pair with Veg Hakka Chowmein',
  },
  {
    id: 'delhi-chowmein',
    name: 'Street-Style Chilli Garlic Chowmein',
    description:
      'Smoky wok-tossed noodles with julienned cabbage, bell peppers, crisp carrots, toasted garlic, and dark soy.',
    price: 165,
    unit: 'Full Plate',
    supportsSpice: true,
    category: 'fastfood',
    subsection: 'Cafe Pizzas, Pasta & Indo-Chinese',
    tags: ['spicy'],
    provenance: 'Seasoned carbon-steel wok',
    chefNote:
      'Available with crisp Veg Manchurian gravy on the side.',
    pairing: 'Pair with Crispy Spring Rolls',
  },

  // Tab 3: Value Combos
  {
    id: 'combo-afghani-feast',
    name: 'Afghani Chaap & Rumali Feast for 2',
    description:
      'Full Plate Signature Afghani Malai Chaap, 2 soft Rumali Rotis, 4 Smoky Tandoori Momos, pickled onions, mint chutney, and 2 Fresh Mint Mojitos.',
    price: 440,
    unit: 'Saves ₹110 · Serves 2',
    supportsSpice: true,
    category: 'combos',
    subsection: 'Tandoor & Group Platters',
    tags: ['special'],
    provenance: 'Packed hot in insulated takeaway boxes or served sizzling at your table',
    chefNote:
      'Our most popular evening combo for couples and friends in Nai Sarai—qualifies automatically for free local delivery.',
    pairing: 'Upgrade Mojitos to Frosted Cold Coffee for ₹40 at checkout',
  },
  {
    id: 'combo-evening-friends',
    name: 'Delhi Bites Friends Platter (Serves 4)',
    description:
      'Full Afghani Malai Chaap, Full Old Delhi Masala Chaap, 8 Tandoori Momos, Crispy Honey Chilli Potato, 4 Rumali Rotis, and 4 Kullad Chai or Coolers.',
    price: 780,
    unit: 'Saves ₹195 · Serves 4',
    supportsSpice: true,
    category: 'combos',
    subsection: 'Tandoor & Group Platters',
    tags: ['special', 'spicy'],
    provenance: 'Freshly roasted to order in 20 minutes',
    chefNote:
      'Designed for college groups, family dinners, and birthday meetups near Shiv Mandir.',
    pairing: 'Includes double portions of green mint and red chilli-garlic chutneys',
  },
  {
    id: 'combo-cafe-burger-coffee',
    name: 'Cafe Burger, Fries & Cold Coffee Combo',
    description:
      'Crisp Spiced Paneer Cafe Burger on toasted brioche, golden Peri-Peri Masala Fries, house dip, and a tall glass of Frosted Cold Coffee.',
    price: 315,
    unit: 'Saves ₹65 · Solo Meal',
    supportsSpice: true,
    category: 'combos',
    subsection: 'Cafe & All-Day Meals',
    tags: ['special'],
    provenance: 'Served 11:00 AM – 11:00 PM',
    chefNote:
      'The complete solo cafe lunch or late-afternoon snack.',
    pairing: 'Add Crispy Kurkure Momos to share',
  },
  {
    id: 'combo-morning-shiv-mandir',
    name: 'Morning Chai & Paratha Breakfast Platter',
    description:
      'Two Tandoori Aloo Pyaz Parathas with white makkhan & chilled curd, one Toasted Bun Maska, and two Kullad Adrak Elaichi Masala Chais.',
    price: 210,
    unit: 'Saves ₹50 · 8:00 AM – 12:00 PM',
    supportsSpice: false,
    category: 'combos',
    subsection: 'Cafe & All-Day Meals',
    tags: ['special'],
    provenance: 'Prepared fresh from 8:00 AM daily',
    chefNote:
      'A hearty morning breakfast for two right after visiting Shiv Mandir.',
    pairing: 'Swap one Kullad Chai for Sweet Punjabi Lassi on request',
  },

  // Tab 4: Morning & Bites (8 AM onwards)
  {
    id: 'bun-maska-chai',
    name: 'Toasted Bun Maska & Cutting Chai',
    description:
      'Warm butter-slathered sweet milk bun lightly griddled and served alongside a piping hot glass of ginger-cardamom chai.',
    price: 95,
    unit: 'Served 8:00 AM – 12:00 PM',
    supportsSpice: false,
    category: 'morning',
    subsection: 'Morning Breakfast (8:00 AM – 12:00 PM)',
    tags: ['special'],
    provenance: 'Fresh morning bakery buns · Assam CTC tea leaves',
    chefNote:
      'The neighborhood morning ritual right after visiting Shiv Mandir.',
    pairing: 'Add extra Kullad Masala Chai for ₹55',
  },
  {
    id: 'aloo-paratha-platter',
    name: 'Tandoori Aloo Pyaz Paratha & Curd',
    description:
      'Two crisp stuffed whole-wheat parathas topped with white makkhan butter, served with chilled curd and homemade mango pickle.',
    price: 140,
    unit: '2 Parathas',
    supportsSpice: true,
    category: 'morning',
    subsection: 'Morning Breakfast (8:00 AM – 12:00 PM)',
    tags: [],
    provenance: 'Chakki-ground whole wheat atta',
    chefNote:
      'Paneer and Gobhi stuffed parathas available every morning until noon.',
    pairing: 'Pair with Sweet Punjabi Lassi or Masala Chai',
  },
  {
    id: 'chole-kulche',
    name: 'Old Delhi Butter Chole Kulche',
    description:
      'Slow-simmered tangy spiced chickpeas with ginger juliennes and green chillies, served with two butter-toasted soft kulchas.',
    price: 135,
    unit: 'Full Plate',
    supportsSpice: true,
    category: 'morning',
    subsection: 'Morning Breakfast (8:00 AM – 12:00 PM)',
    tags: ['spicy'],
    provenance: 'Traditional Delhi spice blend with amchur & roasted jeera',
    chefNote:
      'Freshly tossed per order with crisp onions, tomatoes, and lemon.',
    pairing: 'Pair with Fresh Nimbu Shikanji',
  },
  {
    id: 'masala-cheese-maggi',
    name: 'Tadka Vegetable & Cheese Maggi',
    description:
      'Comforting wok-simmered noodles with buttered onions, green peas, sweet corn, house spice tadka, and melted cheddar.',
    price: 110,
    unit: 'All-Day Quick Bite',
    supportsSpice: true,
    category: 'morning',
    subsection: 'All-Day Quick Bites',
    tags: [],
    provenance: 'Prepared hot in 8 minutes',
    chefNote:
      'Loved by students and evening regulars alongside cold coffee.',
    pairing: 'Pair with Frosted Cold Coffee',
  },

  // Tab 5: Chai, Coffee & Shakes
  {
    id: 'signature-cold-coffee',
    name: 'Delhi Bites Frosted Cold Coffee',
    description:
      'Rich roasted espresso blended thick with chilled milk, vanilla bean cream, and a dusting of dark Dutch cocoa.',
    price: 140,
    unit: 'Classic · With Ice Cream ₹170',
    variants: [
      { label: 'Classic (350ml)', price: 140 },
      { label: 'With Vanilla Scoop', price: 170 },
    ],
    supportsSpice: false,
    category: 'drinks',
    subsection: 'Coffee & Signature Shakes',
    tags: ['special'],
    provenance: '100% Chikmagalur Arabica medium-dark roast',
    chefNote:
      'Blended thick to order with zero ice dilution.',
    pairing: 'Goes effortlessly with Spiced Paneer Burger or Fries',
  },
  {
    id: 'brownie-shake',
    name: 'Belgian Chocolate Brownie Thick Shake',
    description:
      'Fudgy warm chocolate brownie spun with dark cocoa, chilled milk, and whipped cream.',
    price: 170,
    unit: '350ml Glass',
    supportsSpice: false,
    category: 'drinks',
    subsection: 'Coffee & Signature Shakes',
    tags: ['special'],
    provenance: 'House-baked walnut-free dark chocolate brownies',
    chefNote:
      'KitKat Crunch and Oreo Cookie thick shakes also blended to order.',
    pairing: 'Ideal finish after Afghani Chaap or Pizza',
  },
  {
    id: 'masala-chai',
    name: 'Kullad Adrak Elaichi Masala Chai',
    description:
      'Slow-brewed Assam tea simmered with crushed fresh ginger, green cardamom pods, and full-cream milk in an earthen kullad.',
    price: 55,
    unit: 'Served 8:00 AM – 11:00 PM',
    supportsSpice: false,
    category: 'drinks',
    subsection: 'Chai & Coolers',
    tags: ['special'],
    provenance: 'Freshly brewed every 15 minutes',
    chefNote:
      'Low-sugar or jaggery (gur) sweetness available on request.',
    pairing: 'Pair with Bun Maska or Grilled Sandwich',
  },
  {
    id: 'virgin-mojito',
    name: 'Fresh Mint & Lime Virgin Mojito',
    description:
      'Muddled garden mint leaves, fresh kagzi lime juice, black salt pinch, crushed ice, and sparkling soda.',
    price: 120,
    unit: 'Chilled Cooler',
    supportsSpice: false,
    category: 'drinks',
    subsection: 'Chai & Coolers',
    tags: [],
    provenance: 'Freshly muddled per glass',
    chefNote:
      'Green Apple, Watermelon, and Kala Khatta coolers also available.',
    pairing: 'Cuts cleanly through rich Afghani Malai Chaap and Tandoori Momos',
  },
];

export const PROVENANCE_FACTS = [
  {
    value: '8 AM – 11 PM',
    label: 'Open every single day from morning bun maska and chai through late-night charcoal tandoor',
  },
  {
    value: 'Live Tandoor',
    label: 'Authentic charcoal-fired clay oven roasting fresh Afghani Chaap and Momos to order',
  },
  {
    value: 'Free Delivery',
    label: 'Complimentary local delivery across Nai Sarai on orders ₹399 and above, or 15-min counter pickup',
  },
];

export const PRESS_NOTES = [
  {
    quote:
      'The Afghani Malai Chaap at Delhi Bites is unmatched in the neighborhood—smoky straight off the charcoal skewers, drenched in rich cashew cream, and served with crisp onions and vibrant mint chutney.',
    author: 'Rohan Malhotra',
    role: 'Regular Guest · Nai Sarai, New Delhi',
  },
  {
    quote:
      'Whether you stop by at 8:30 AM for kullad chai and parathas near Shiv Mandir or bring friends at 9 PM for Tandoori Momos, burgers, and cold coffee, the kitchen delivers hot, consistent food every single time.',
    author: 'Priya Sharma',
    role: 'Local Food Writer · Delhi NCR',
  },
];

export const SEATING_AREAS: SeatingArea[] = [
  {
    id: 'cafe-hall',
    name: 'Indoor Cafe Hall',
    detail: 'Air-conditioned teak wood tables ideal for friends and coffee meetups',
  },
  {
    id: 'family-booths',
    name: 'Family Dining Booths',
    detail: 'Spacious cushioned seating for groups, birthdays, and family dinners',
  },
  {
    id: 'tandoor-counter',
    name: 'Quick Bite & Counter',
    detail: 'Fast casual seating near the grill & coffee bar for solo diners and snacks',
  },
];

export const TIME_SLOTS_BY_AREA: Record<SeatingArea['id'], TimeSlot[]> = {
  'cafe-hall': [
    { time: '9:00 AM', status: 'available' },
    { time: '12:30 PM', status: 'available' },
    { time: '4:30 PM', status: 'available' },
    { time: '6:30 PM', status: 'limited' },
    { time: '8:00 PM', status: 'limited' },
    { time: '9:30 PM', status: 'available' },
  ],
  'family-booths': [
    { time: '1:00 PM', status: 'available' },
    { time: '5:30 PM', status: 'available' },
    { time: '7:00 PM', status: 'limited' },
    { time: '8:30 PM', status: 'limited' },
    { time: '9:45 PM', status: 'available' },
  ],
  'tandoor-counter': [
    { time: '11:30 AM', status: 'available' },
    { time: '3:00 PM', status: 'available' },
    { time: '6:00 PM', status: 'available' },
    { time: '7:45 PM', status: 'limited' },
    { time: '9:15 PM', status: 'available' },
  ],
};
