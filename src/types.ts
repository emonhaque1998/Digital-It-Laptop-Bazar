export type LaptopBrand = 'Apple' | 'Dell' | 'HP' | 'Lenovo' | 'Asus' | 'Acer' | 'MSI' | 'Microsoft' | 'Other';

export type ConditionGrade = 'A+' | 'A' | 'B';

export type LaptopCategory = 'Business' | 'Ultrabook' | 'Gaming' | 'Budget Student' | 'MacBook' | 'Workstation';

export interface TestedChecklist {
  displayTested: boolean;
  keyboardTested: boolean;
  batteryTested: boolean;
  thermalPerformance: boolean;
  originalCharger: boolean;
  portsTested: boolean;
  webcamMicTested: boolean;
}

export interface Laptop {
  id: string;
  title: string;
  brand: LaptopBrand;
  series: string;
  processor: string;
  generation: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  batteryHealth: number; // e.g. 92%
  batteryBackup: string; // e.g. "4-5 Hours"
  conditionGrade: ConditionGrade;
  bodyNotes: string;
  buyingPrice?: number; // Secret admin cost price (never shown to customers)
  price: number; // in BDT (primary) or USD
  originalPrice: number;
  stock: number;
  warranty: string;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  category: LaptopCategory;
  testedChecklist: TestedChecklist;
  description: string;
  ports?: string;
  weight?: string;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Quality Checked' | 'Shipped' | 'Delivered' | 'Cancelled';

export type ExpenseCategory =
  | 'Shop Rent'          // দোকান ভাড়া
  | 'Electricity Bill'   // বিদ্যুৎ বিল
  | 'Staff Salary'       // কর্মচারীর বেতন
  | 'Internet & WiFi'    // ইন্টারনেট ও ওয়াইফাই
  | 'Packaging & Bags'   // বক্স ও প্যাকেজিং ব্যাগ
  | 'Transportation'     // যাতায়াত ও ডেলিভারি খরচ
  | 'Tea & Refreshment'  // চা ও আপ্যায়ন খরচ
  | 'Marketing & Ads'    // অনলাইন বিজ্ঞাপন ও বুস্টিং
  | 'Shop Maintenance'   // দোকান সংস্কার ও মেরামত
  | 'Other';             // অন্যান্য বিবিধ খরচ

export interface ShopExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'bKash / Nagad' | 'Bank Transfer' | 'Other';
  voucherNumber?: string;
  notes?: string;
  createdByName?: string;
  createdAt: string;
}

export interface OrderItem {
  laptopId: string;
  laptopTitle: string;
  laptopBrand: LaptopBrand;
  price: number;
  quantity: number;
  image: string;
  ram?: string;
  storage?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  alternativePhone?: string;
  deliveryAddress: string;
  cityDistrict: string;
  deliveryNotes?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash / Nagad' | 'Store Pickup (Showroom)';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  shopName: string;
  shopNameBn: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  announcement: string;
  showAnnouncement: boolean;
  adminEmail?: string;
  adminPassword?: string;
  adminPin?: string;
  currency: 'BDT' | 'USD';
  bdtToUsdRate: number; // e.g. 120 BDT = 1 USD
}
