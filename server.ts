import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store for server session (seeded from client / initial data)
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

// AI Laptop Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { userBudget, purpose, preferredBrand, inventory } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback smart recommendation if API key is not ready
      return res.json({
        recommendation: `Based on your budget of ৳${userBudget || 'flexible'} for "${purpose || 'General Work'}", we recommend looking at laptops with at least 16GB RAM and SSD storage. Our Lenovo ThinkPad T480 and Dell Latitude series offer exceptional reliability, battery longevity, and comfortable typing for long work hours.`,
        suggestedLaptopIds: (inventory && inventory.length > 0) ? [inventory[0].id] : [],
        tips: [
          'Choose 16GB RAM for smooth multitasking in Chrome & Office.',
          'NVMe SSD ensures 5x faster boot time compared to old HDDs.',
          'Always check battery health percentage and physical condition grade.'
        ]
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
      category: l.category
    }));

    const prompt = `You are an expert used/refurbished laptop sales advisor at a trusted laptop showroom in Bangladesh.
A customer asks for recommendations with:
- Budget: ${userBudget ? `৳${userBudget} BDT` : 'Not specified'}
- Purpose / Work: ${purpose || 'General productivity, office, browsing, or coding'}
- Preferred Brand: ${preferredBrand || 'Any good brand'}

Here is our current in-stock used laptop inventory:
${JSON.stringify(inventorySummary, null, 2)}

Provide a helpful, friendly, and expert response in JSON format with:
1. "recommendation": A 2-3 paragraph detailed recommendation explaining which laptop(s) from our stock fit their needs and why, plus practical advice on why used business/refurbished laptops (like ThinkPad, EliteBook, Latitude, MacBook) give the best value for money in Bangladesh. You can write in clean English with a warm tone or bilingual touches.
2. "suggestedLaptopIds": An array of matching laptop IDs from the provided inventory (maximum 3 best matches).
3. "tips": Array of 3 short, actionable buyer tips (e.g. regarding RAM expansion, thermal test, warranty).

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const parsed = JSON.parse(text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in AI recommend:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      recommendation: 'Based on our inventory, our top recommendations are the Lenovo ThinkPad T480 for programming/office and Dell XPS 13 or MacBook Air for executive portability.'
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
        category: 'Business'
      });
    }

    const prompt = `You are a professional laptop specialist. An admin is uploading a used laptop with details:
Brand: ${brand || ''}
Model: ${modelName || ''}
Processor: ${processor || ''}
RAM: ${ram || ''}
Storage: ${storage || ''}
Condition Grade: ${conditionGrade || 'A+'}

Generate an engaging, technically accurate product listing for this used laptop.
Return JSON with:
1. "title": Catchy standard title format (e.g., "Lenovo ThinkPad T480 - Core i5 8th Gen / 16GB / 512GB SSD / Grade A+")
2. "description": 2-3 engaging sentences describing the laptop performance, build quality, target audience (programmers, students, freelancers, office), and reliability.
3. "bodyNotes": A brief realistic condition summary (e.g. "Clean cosmetic condition, tested original charger, no display spots").
4. "category": One of ["Business", "Ultrabook", "Gaming", "Budget Student", "MacBook", "Workstation"]
5. "ports": Typical ports for this model (e.g., "2x USB 3.0, 1x Type-C, 1x HDMI, Audio Combo")

Respond strictly with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
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
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
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
    console.log(`LaptopHat Server running on http://localhost:${PORT}`);
  });
}

startServer();
