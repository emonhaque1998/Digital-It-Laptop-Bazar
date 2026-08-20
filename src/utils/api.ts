import { Laptop, Order, ShopSettings, ShopExpense } from '../types';
import {
  getStoredLaptops,
  saveStoredLaptops,
  getStoredOrders,
  saveStoredOrders,
  getStoredSettings,
  saveStoredSettings,
  getStoredExpenses,
  saveStoredExpenses,
} from './storage';

export interface DbStatus {
  connected: boolean;
  provider: string;
  urlConfigured: boolean;
}

// Fetch DB connection health
export async function checkDbStatus(): Promise<DbStatus> {
  try {
    const res = await fetch('/api/db/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not check Neon DB status, working in cached mode:', err);
  }
  return { connected: false, provider: 'Neon PostgreSQL', urlConfigured: true };
}

// =================== LAPTOPS ===================

export async function fetchLaptops(): Promise<Laptop[]> {
  try {
    const res = await fetch('/api/laptops');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveStoredLaptops(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from Neon DB /api/laptops, using local cache:', err);
  }
  return getStoredLaptops();
}

export async function apiSaveLaptop(laptop: Laptop): Promise<Laptop> {
  // Update local storage immediately for responsive UI
  const current = getStoredLaptops();
  const idx = current.findIndex((l) => l.id === laptop.id);
  let updatedList: Laptop[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = laptop;
  } else {
    updatedList = [laptop, ...current];
  }
  saveStoredLaptops(updatedList);

  // Sync to Neon PostgreSQL
  try {
    const res = await fetch('/api/laptops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laptop),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to sync laptop to Neon PostgreSQL:', err);
  }
  return laptop;
}

export async function apiDeleteLaptop(id: string): Promise<boolean> {
  const current = getStoredLaptops();
  saveStoredLaptops(current.filter((l) => l.id !== id));

  try {
    const res = await fetch(`/api/laptops/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete laptop from Neon PostgreSQL:', err);
    return false;
  }
}

// =================== ORDERS ===================

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveStoredOrders(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch orders from Neon DB, using cache:', err);
  }
  return getStoredOrders();
}

export async function apiCreateOrder(order: Order): Promise<Order> {
  // Save locally first
  const current = getStoredOrders();
  saveStoredOrders([order, ...current]);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to sync new order to Neon PostgreSQL:', err);
  }
  return order;
}

export async function apiUpdateOrderStatus(id: string, status: string): Promise<Order | null> {
  const current = getStoredOrders();
  const idx = current.findIndex((o) => o.id === id);
  if (idx >= 0) {
    current[idx].status = status as any;
    current[idx].updatedAt = new Date().toISOString();
    saveStoredOrders([...current]);
  }

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to update order status in Neon DB:', err);
  }
  return idx >= 0 ? current[idx] : null;
}

export async function apiTrackOrder(query: string): Promise<Order[]> {
  try {
    const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to query Neon order tracking endpoint, checking local storage:', err);
  }
  const current = getStoredOrders();
  const cleaned = query.trim().toLowerCase();
  return current.filter(
    (o) => o.id.toLowerCase() === cleaned || o.phone.includes(cleaned)
  );
}

// =================== SETTINGS ===================

export async function fetchSettings(): Promise<ShopSettings> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.shopName) {
        saveStoredSettings(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch settings from Neon, using cached:', err);
  }
  return getStoredSettings();
}

export async function apiSaveSettings(settings: ShopSettings): Promise<ShopSettings> {
  saveStoredSettings(settings);
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to save settings to Neon DB:', err);
  }
  return settings;
}
