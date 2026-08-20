import { Laptop, Order, ShopSettings } from '../types';
import { INITIAL_LAPTOPS, INITIAL_ORDERS, INITIAL_SHOP_SETTINGS } from '../data/initialLaptops';

const LAPTOPS_KEY = 'laptophat_inventory_v1';
const ORDERS_KEY = 'laptophat_orders_v1';
const SETTINGS_KEY = 'laptophat_settings_v1';

export function getStoredLaptops(): Laptop[] {
  try {
    const saved = localStorage.getItem(LAPTOPS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored laptops:', e);
  }
  return INITIAL_LAPTOPS;
}

export function saveStoredLaptops(laptops: Laptop[]): void {
  try {
    localStorage.setItem(LAPTOPS_KEY, JSON.stringify(laptops));
  } catch (e) {
    console.error('Error saving stored laptops:', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored orders:', e);
  }
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving stored orders:', e);
  }
}

export function getStoredSettings(): ShopSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.shopName) {
        if (parsed.shopName === 'Digital IT Laptop Bazaar' || parsed.shopName === 'LaptopHat') {
          parsed.shopName = 'Laptop BAZAR';
          parsed.shopNameBn = 'ল্যাপটপ বাজার';
        }
        if (!parsed.phone || parsed.phone.includes('1711-234567')) {
          parsed.phone = '+880 1864-176956';
        }
        if (!parsed.whatsapp || parsed.whatsapp.includes('1711234567')) {
          parsed.whatsapp = '+8801864176956';
        }
        saveStoredSettings(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored settings:', e);
  }
  return INITIAL_SHOP_SETTINGS;
}

export function saveStoredSettings(settings: ShopSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving stored settings:', e);
  }
}
