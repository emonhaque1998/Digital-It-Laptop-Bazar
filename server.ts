import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getAllLaptops,
  saveLaptop,
  deleteLaptop,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  trackOrder,
  getAllExpenses,
  saveExpense,
  deleteExpense,
  getShopSettings,
  saveShopSettings,
  getDbConnectionStatus,
} from './server/db';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Failed to initialize Gemini AI client:', e);
    }
  }
  return aiClient;
}

// =================== NEON POSTGRES DATABASE API ROUTES ===================

// Check Neon DB Connection Status
app.get('/api/db/status', (req, res) => {
  res.json(getDbConnectionStatus());
});

// Laptops: Fetch all
app.get('/api/laptops', async (req, res) => {
  try {
    const laptops = await getAllLaptops();
    res.json(laptops);
  } catch (error: any) {
    console.error('API Error in GET /api/laptops:', error);
    res.status(500).json({ error: 'Failed to fetch laptops' });
  }
});

// Laptops: Add or Update
app.post('/api/laptops', async (req, res) => {
  try {
    const laptop = req.body;
    if (!laptop || !laptop.id || !laptop.title) {
      return res.status(400).json({ error: 'Invalid laptop payload' });
    }
    const saved = await saveLaptop(laptop);
    res.json(saved);
  } catch (error: any) {
    console.error('API Error in POST /api/laptops:', error);
    res.status(500).json({ error: 'Failed to save laptop' });
  }
});

// Laptops: Update by ID
app.put('/api/laptops/:id', async (req, res) => {
  try {
    const laptop = { ...req.body, id: req.params.id };
    const saved = await saveLaptop(laptop);
    res.json(saved);
  } catch (error: any) {
    console.error('API Error in PUT /api/laptops/:id:', error);
    res.status(500).json({ error: 'Failed to update laptop' });
  }
});

// Laptops: Delete by ID
app.delete('/api/laptops/:id', async (req, res) => {
  try {
    await deleteLaptop(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/laptops/:id:', error);
    res.status(500).json({ error: 'Failed to delete laptop' });
  }
});

// Orders: Fetch all (for Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error: any) {
    console.error('API Error in GET /api/orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Orders: Create new order (Customer Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.id || !order.customerName || !order.phone) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }
    const saved = await createOrder(order);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('API Error in POST /api/orders:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Orders: Update status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error('API Error in PATCH /api/orders/:id/status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Orders: Customer tracking by Order ID or Phone
app.get('/api/orders/track', async (req, res) => {
  try {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.json([]);
    }
    const orders = await trackOrder(query);
    res.json(orders);
  } catch (error: any) {
    console.error('API Error in GET /api/orders/track:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Expenses: Fetch all (for Admin)
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (error: any) {
    console.error('API Error in GET /api/expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Expenses: Create new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const expense = req.body;
    if (!expense || !expense.id || !expense.title || expense.amount === undefined) {
      return res.status(400).json({ error: 'Missing required expense fields' });
    }
    const saved = await saveExpense(expense);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('API Error in POST /api/expenses:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Expenses: Update expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = { ...req.body, id: req.params.id };
    const saved = await saveExpense(expense);
    res.json(saved);
  } catch (error: any) {
    console.error('API Error in PUT /api/expenses/:id:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Expenses: Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await deleteExpense(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/expenses/:id:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Shop Settings: Get
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getShopSettings();
    res.json(settings);
  } catch (error: any) {
    console.error('API Error in GET /api/settings:', error);
    res.status(500).json({ error: 'Failed to get shop settings' });
  }
});

// Shop Settings: Update
app.put('/api/settings', async (req, res) => {
  try {
    const settings = req.body;
    const saved = await saveShopSettings(settings);
    res.json(saved);
  } catch (error: any) {
    console.error('API Error in PUT /api/settings:', error);
    res.status(500).json({ error: 'Failed to save shop settings' });
  }
});

// =================== GEMINI AI ADVISOR ENDPOINTS ===================

// AI Laptop Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { userBudget, purpose, preferredBrand, inventory } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        recommendation: `Based on your budget of ৳${userBudget || 'flexible'} for "${purpose || 'General Work'}", we recommend looking at laptops with at least 16GB RAM and SSD storage. Our Lenovo ThinkPad T480 and Dell Latitude series offer exceptional reliability, battery longevity, and comfortable typing for long work hours.`,
        suggestedLaptopIds: inventory && inventory.length > 0 ? [inventory[0].id] : [],
        tips: [
          'Choose 16GB RAM for smooth multitasking in Chrome & Office.',
          'NVMe SSD ensures 5x faster boot time compared to old HDDs.',
          'Always check battery health percentage and physical condition grade.',
        ],
      });
    }

    const inventorySummary = (inventory || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      brand: l.brand,
      priceBDT: l.price,
      processor: l.processor,
      ram: l.ram,
      storage: l.storage,
      conditionGrade: l.conditionGrade,
      batteryHealth: l.batteryHealth,
      category: l.category,
    }));

    const prompt = `You are an expert used/refurbished laptop sales advisor at a trusted laptop showroom in Bangladesh named Laptop BAZAR.
A customer asks for recommendations with:
- Budget: ${userBudget ? `৳${userBudget} BDT` : 'Not specified'}
- Purpose / Work: ${purpose || 'General productivity, office, browsing, or coding'}
- Preferred Brand: ${preferredBrand || 'Any good brand'}

Here is our current in-stock used laptop inventory:
${JSON.stringify(inventorySummary, null, 2)}

Provide a helpful, friendly, and expert response in JSON format with:
1. "recommendation": A 2-3 paragraph detailed recommendation explaining which laptop(s) from our stock fit their needs and why, plus practical advice on why used business/refurbished laptops (like ThinkPad, EliteBook, Latitude, MacBook) give the best value for money in Bangladesh.
2. "suggestedLaptopIds": An array of matching laptop IDs from the provided inventory (maximum 3 best matches).
3. "tips": Array of 3 short, actionable buyer tips (e.g. regarding RAM expansion, thermal test, warranty).

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    const parsed = JSON.parse(text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in AI recommend:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      recommendation:
        'Based on our inventory, our top recommendations are the Lenovo ThinkPad T480 for programming/office and Dell Latitude or MacBook Air for executive portability.',
    });
  }
});

// AI Auto-Generate Laptop Description & Spec Highlights for Admin Upload
app.post('/api/ai/generate-laptop-info', async (req, res) => {
  try {
    const { modelName, brand, processor, ram, storage, conditionGrade } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        title: `${brand || 'Brand'} ${modelName || 'Laptop'} - ${processor || 'Intel Core i5'} / ${ram || '16GB'} / ${storage || '512GB SSD'}`,
        description: `Premium grade ${conditionGrade || 'A+'} used ${brand || ''} laptop in pristine physical and functional condition. Thoroughly tested on 12-point quality check. Ideal for professional office work, freelancing, programming, and multimedia tasks. Comes with original charger and full warranty coverage.`,
        bodyNotes: '100% genuine condition, no internal repair history, clean display and keyboard.',
        category: 'Business',
      });
    }

    const prompt = `You are a professional laptop specialist at Laptop BAZAR. An admin is uploading a used laptop with details:
Brand: ${brand || ''}
Model: ${modelName || ''}
Processor: ${processor || ''}
RAM: ${ram || ''}
Storage: ${storage || ''}
Condition Grade: ${conditionGrade || 'A+'}

Generate an engaging, technically accurate product listing for this used laptop.
Return JSON with:
1. "title": Catchy standard title format (e.g., "Lenovo ThinkPad T480 - Core i5 8th Gen / 16GB / 512GB SSD / Grade A+")
2. "description": 2-3 engaging sentences describing the laptop performance, build quality, target audience, and reliability.
3. "bodyNotes": A brief realistic condition summary (e.g. "Clean cosmetic condition, tested original charger, no display spots").
4. "category": One of ["Business", "Ultrabook", "Gaming", "Budget Student", "MacBook", "Workstation"]
5. "ports": Typical ports for this model (e.g., "2x USB 3.0, 1x Type-C, 1x HDMI, Audio Combo")

Respond strictly with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in AI generate laptop info:', error);
    res.status(500).json({ error: 'Failed to generate info' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), db: getDbConnectionStatus() });
});

async function startServer() {
  // Initialize Neon PostgreSQL database
  try {
    await initDatabase();
  } catch (e) {
    console.error('Database initialization caught error:', e);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Laptop BAZAR Server running on http://localhost:${PORT}`);
  });
}

startServer();
