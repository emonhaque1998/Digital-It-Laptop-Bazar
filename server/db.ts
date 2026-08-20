import { Pool } from 'pg';
import { INITIAL_LAPTOPS, INITIAL_SHOP_SETTINGS } from '../src/data/initialLaptops';
import { Laptop, Order, ShopSettings } from '../src/types';

// Connection string from environment variable with user provided Neon connection string fallback
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_9YTAxCDXlaw7@ep-twilight-sound-ayjymvwj-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

let pool: Pool | null = null;
let isDbConnected = false;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle Neon PostgreSQL client:', err);
    });
  }
  return pool;
}

// In-memory fallback in case of transient network isolation
let inMemoryLaptops: Laptop[] = [...INITIAL_LAPTOPS];
let inMemoryOrders: Order[] = [];
let inMemorySettings: ShopSettings = { ...INITIAL_SHOP_SETTINGS };

export async function initDatabase(): Promise<boolean> {
  try {
    const db = getDbPool();
    console.log('Connecting to Neon PostgreSQL database...');

    // 1. Create Laptops Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS laptops (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        brand TEXT NOT NULL,
        series TEXT,
        processor TEXT,
        generation TEXT,
        ram TEXT,
        storage TEXT,
        display TEXT,
        graphics TEXT,
        battery_health INT DEFAULT 90,
        battery_backup TEXT,
        condition_grade TEXT DEFAULT 'A+',
        body_notes TEXT,
        price NUMERIC NOT NULL,
        original_price NUMERIC,
        stock INT DEFAULT 1,
        warranty TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        is_featured BOOLEAN DEFAULT false,
        is_best_seller BOOLEAN DEFAULT false,
        category TEXT DEFAULT 'Business',
        tested_checklist JSONB DEFAULT '{}'::jsonb,
        description TEXT,
        ports TEXT,
        weight TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Create Orders Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        alternative_phone TEXT,
        delivery_address TEXT NOT NULL,
        city_district TEXT NOT NULL,
        delivery_notes TEXT,
        payment_method TEXT NOT NULL,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal NUMERIC NOT NULL,
        delivery_fee NUMERIC NOT NULL,
        discount NUMERIC DEFAULT 0,
        total NUMERIC NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Create Shop Settings Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS shop_settings (
        id INT PRIMARY KEY DEFAULT 1,
        settings JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Check if laptops table is empty, if so seed initial laptops
    const laptopsCountRes = await db.query('SELECT COUNT(*) FROM laptops');
    const laptopCount = parseInt(laptopsCountRes.rows[0].count, 10);

    if (laptopCount === 0) {
      console.log('Seeding initial laptops into Neon PostgreSQL...');
      for (const laptop of INITIAL_LAPTOPS) {
        await db.query(
          `INSERT INTO laptops (
            id, title, brand, series, processor, generation, ram, storage,
            display, graphics, battery_health, battery_backup, condition_grade,
            body_notes, price, original_price, stock, warranty, images,
            is_featured, is_best_seller, category, tested_checklist,
            description, ports, weight, created_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
          ON CONFLICT (id) DO NOTHING`,
          [
            laptop.id,
            laptop.title,
            laptop.brand,
            laptop.series,
            laptop.processor,
            laptop.generation,
            laptop.ram,
            laptop.storage,
            laptop.display,
            laptop.graphics,
            laptop.batteryHealth,
            laptop.batteryBackup,
            laptop.conditionGrade,
            laptop.bodyNotes,
            laptop.price,
            laptop.originalPrice,
            laptop.stock,
            laptop.warranty,
            JSON.stringify(laptop.images || []),
            laptop.isFeatured || false,
            laptop.isBestSeller || false,
            laptop.category,
            JSON.stringify(laptop.testedChecklist || {}),
            laptop.description,
            laptop.ports || '',
            laptop.weight || '',
            laptop.createdAt || new Date().toISOString(),
          ]
        );
      }
      console.log(`Seeded ${INITIAL_LAPTOPS.length} laptops into Neon.`);
    }

    // Check settings table
    const settingsRes = await db.query('SELECT settings FROM shop_settings WHERE id = 1');
    if (settingsRes.rows.length === 0) {
      await db.query(
        'INSERT INTO shop_settings (id, settings, updated_at) VALUES (1, $1, NOW()) ON CONFLICT (id) DO NOTHING',
        [JSON.stringify(INITIAL_SHOP_SETTINGS)]
      );
      console.log('Seeded initial shop settings into Neon.');
    } else {
      const current = typeof settingsRes.rows[0].settings === 'string'
        ? JSON.parse(settingsRes.rows[0].settings)
        : settingsRes.rows[0].settings;
      let needsUpdate = false;
      if (current.phone?.includes('1711-234567') || current.whatsapp?.includes('1711234567')) {
        current.phone = '+880 1864-176956';
        current.whatsapp = '+8801864176956';
        needsUpdate = true;
      }
      if (!current.adminEmail || !current.adminPassword) {
        current.adminEmail = current.adminEmail || 'emonhaque.net@gmail.com';
        current.adminPassword = current.adminPassword || 'Emon@1998';
        needsUpdate = true;
      }
      if (needsUpdate) {
        await db.query(
          'UPDATE shop_settings SET settings = $1, updated_at = NOW() WHERE id = 1',
          [JSON.stringify(current)]
        );
        console.log('Updated Neon shop settings with contact numbers & admin credentials.');
      }
    }

    isDbConnected = true;
    console.log('Successfully connected and initialized Neon PostgreSQL database!');
    return true;
  } catch (error) {
    console.error('Failed to initialize Neon PostgreSQL database:', error);
    isDbConnected = false;
    return false;
  }
}

// Convert DB row to Laptop model
function mapRowToLaptop(row: any): Laptop {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    series: row.series || '',
    processor: row.processor || '',
    generation: row.generation || '',
    ram: row.ram || '',
    storage: row.storage || '',
    display: row.display || '',
    graphics: row.graphics || '',
    batteryHealth: Number(row.battery_health) || 90,
    batteryBackup: row.battery_backup || '',
    conditionGrade: row.condition_grade || 'A+',
    bodyNotes: row.body_notes || '',
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    stock: Number(row.stock),
    warranty: row.warranty || '',
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    isFeatured: Boolean(row.is_featured),
    isBestSeller: Boolean(row.is_best_seller),
    category: row.category || 'Business',
    testedChecklist: typeof row.tested_checklist === 'string' ? JSON.parse(row.tested_checklist) : (row.tested_checklist || {}),
    description: row.description || '',
    ports: row.ports || '',
    weight: row.weight || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

// Convert DB row to Order model
function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    alternativePhone: row.alternative_phone || '',
    deliveryAddress: row.delivery_address,
    cityDistrict: row.city_district,
    deliveryNotes: row.delivery_notes || '',
    paymentMethod: row.payment_method,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    discount: Number(row.discount || 0),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

// ======================= LAPTOPS OPERATIONS =======================

export async function getAllLaptops(): Promise<Laptop[]> {
  try {
    const db = getDbPool();
    const result = await db.query('SELECT * FROM laptops ORDER BY created_at DESC');
    return result.rows.map(mapRowToLaptop);
  } catch (err) {
    console.error('Error fetching laptops from Neon, using memory cache:', err);
    return inMemoryLaptops;
  }
}

export async function saveLaptop(laptop: Laptop): Promise<Laptop> {
  try {
    const db = getDbPool();
    await db.query(
      `INSERT INTO laptops (
        id, title, brand, series, processor, generation, ram, storage,
        display, graphics, battery_health, battery_backup, condition_grade,
        body_notes, price, original_price, stock, warranty, images,
        is_featured, is_best_seller, category, tested_checklist,
        description, ports, weight, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        brand = EXCLUDED.brand,
        series = EXCLUDED.series,
        processor = EXCLUDED.processor,
        generation = EXCLUDED.generation,
        ram = EXCLUDED.ram,
        storage = EXCLUDED.storage,
        display = EXCLUDED.display,
        graphics = EXCLUDED.graphics,
        battery_health = EXCLUDED.battery_health,
        battery_backup = EXCLUDED.battery_backup,
        condition_grade = EXCLUDED.condition_grade,
        body_notes = EXCLUDED.body_notes,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        stock = EXCLUDED.stock,
        warranty = EXCLUDED.warranty,
        images = EXCLUDED.images,
        is_featured = EXCLUDED.is_featured,
        is_best_seller = EXCLUDED.is_best_seller,
        category = EXCLUDED.category,
        tested_checklist = EXCLUDED.tested_checklist,
        description = EXCLUDED.description,
        ports = EXCLUDED.ports,
        weight = EXCLUDED.weight`,
      [
        laptop.id,
        laptop.title,
        laptop.brand,
        laptop.series,
        laptop.processor,
        laptop.generation,
        laptop.ram,
        laptop.storage,
        laptop.display,
        laptop.graphics,
        laptop.batteryHealth,
        laptop.batteryBackup,
        laptop.conditionGrade,
        laptop.bodyNotes,
        laptop.price,
        laptop.originalPrice,
        laptop.stock,
        laptop.warranty,
        JSON.stringify(laptop.images || []),
        laptop.isFeatured || false,
        laptop.isBestSeller || false,
        laptop.category,
        JSON.stringify(laptop.testedChecklist || {}),
        laptop.description,
        laptop.ports || '',
        laptop.weight || '',
        laptop.createdAt || new Date().toISOString(),
      ]
    );

    // Update in-memory fallback
    const idx = inMemoryLaptops.findIndex((l) => l.id === laptop.id);
    if (idx >= 0) inMemoryLaptops[idx] = laptop;
    else inMemoryLaptops.unshift(laptop);

    return laptop;
  } catch (err) {
    console.error('Error saving laptop to Neon:', err);
    // Fallback to memory
    const idx = inMemoryLaptops.findIndex((l) => l.id === laptop.id);
    if (idx >= 0) inMemoryLaptops[idx] = laptop;
    else inMemoryLaptops.unshift(laptop);
    return laptop;
  }
}

export async function deleteLaptop(id: string): Promise<boolean> {
  try {
    const db = getDbPool();
    await db.query('DELETE FROM laptops WHERE id = $1', [id]);
    inMemoryLaptops = inMemoryLaptops.filter((l) => l.id !== id);
    return true;
  } catch (err) {
    console.error('Error deleting laptop from Neon:', err);
    inMemoryLaptops = inMemoryLaptops.filter((l) => l.id !== id);
    return true;
  }
}

// ======================= ORDERS OPERATIONS =======================

export async function getAllOrders(): Promise<Order[]> {
  try {
    const db = getDbPool();
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    return result.rows.map(mapRowToOrder);
  } catch (err) {
    console.error('Error fetching orders from Neon:', err);
    return inMemoryOrders;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  try {
    const db = getDbPool();
    await db.query(
      `INSERT INTO orders (
        id, customer_name, phone, alternative_phone, delivery_address,
        city_district, delivery_notes, payment_method, items, subtotal,
        delivery_fee, discount, total, status, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = NOW()`,
      [
        order.id,
        order.customerName,
        order.phone,
        order.alternativePhone || '',
        order.deliveryAddress,
        order.cityDistrict,
        order.deliveryNotes || '',
        order.paymentMethod,
        JSON.stringify(order.items || []),
        order.subtotal,
        order.deliveryFee,
        order.discount || 0,
        order.total,
        order.status || 'Pending',
        order.createdAt || new Date().toISOString(),
        order.updatedAt || new Date().toISOString(),
      ]
    );

    // Decrement stock in database for purchased laptops
    for (const item of order.items) {
      await db.query(
        'UPDATE laptops SET stock = GREATEST(0, stock - $1) WHERE id = $2',
        [item.quantity, item.laptopId]
      );
    }

    inMemoryOrders.unshift(order);
    return order;
  } catch (err) {
    console.error('Error creating order in Neon:', err);
    inMemoryOrders.unshift(order);
    return order;
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  try {
    const db = getDbPool();
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) {
      const order = mapRowToOrder(result.rows[0]);
      const idx = inMemoryOrders.findIndex((o) => o.id === id);
      if (idx >= 0) inMemoryOrders[idx] = order;
      return order;
    }
    return null;
  } catch (err) {
    console.error('Error updating order status in Neon:', err);
    const order = inMemoryOrders.find((o) => o.id === id);
    if (order) {
      order.status = status as any;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return null;
  }
}

export async function trackOrder(query: string): Promise<Order[]> {
  try {
    const db = getDbPool();
    const cleaned = query.trim();
    const result = await db.query(
      `SELECT * FROM orders 
       WHERE LOWER(id) = LOWER($1) 
          OR phone LIKE $2 
          OR alternative_phone LIKE $2
       ORDER BY created_at DESC`,
      [cleaned, `%${cleaned}%`]
    );
    return result.rows.map(mapRowToOrder);
  } catch (err) {
    console.error('Error tracking order in Neon:', err);
    const cleaned = query.trim().toLowerCase();
    return inMemoryOrders.filter(
      (o) => o.id.toLowerCase() === cleaned || o.phone.includes(cleaned)
    );
  }
}

// ======================= SETTINGS OPERATIONS =======================

export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const db = getDbPool();
    const result = await db.query('SELECT settings FROM shop_settings WHERE id = 1');
    if (result.rows.length > 0) {
      const parsed = typeof result.rows[0].settings === 'string'
        ? JSON.parse(result.rows[0].settings)
        : result.rows[0].settings;
      return { ...INITIAL_SHOP_SETTINGS, ...parsed };
    }
    return inMemorySettings;
  } catch (err) {
    console.error('Error getting settings from Neon:', err);
    return inMemorySettings;
  }
}

export async function saveShopSettings(settings: ShopSettings): Promise<ShopSettings> {
  try {
    const db = getDbPool();
    await db.query(
      `INSERT INTO shop_settings (id, settings, updated_at) 
       VALUES (1, $1, NOW()) 
       ON CONFLICT (id) DO UPDATE SET settings = EXCLUDED.settings, updated_at = NOW()`,
      [JSON.stringify(settings)]
    );
    inMemorySettings = settings;
    return settings;
  } catch (err) {
    console.error('Error saving settings to Neon:', err);
    inMemorySettings = settings;
    return settings;
  }
}

export function getDbConnectionStatus() {
  return {
    connected: isDbConnected,
    provider: 'Neon PostgreSQL (AWS US-East-2)',
    urlConfigured: Boolean(process.env.DATABASE_URL || connectionString),
  };
}
