import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  HelpCircle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { ConditionGrade, Laptop, LaptopBrand, LaptopCategory } from '../types';

interface AdminAddEditLaptopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (laptop: Laptop) => void;
  initialLaptop?: Laptop | null;
}

export const AdminAddEditLaptopModal: React.FC<AdminAddEditLaptopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLaptop,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialLaptop);

  const [title, setTitle] = useState(initialLaptop?.title || '');
  const [brand, setBrand] = useState<LaptopBrand>(initialLaptop?.brand || 'Lenovo');
  const [series, setSeries] = useState(initialLaptop?.series || 'ThinkPad Series');
  const [processor, setProcessor] = useState(initialLaptop?.processor || 'Intel Core i5-8350U (Quad Core up to 3.6GHz)');
  const [generation, setGeneration] = useState(initialLaptop?.generation || '8th Gen');
  const [ram, setRam] = useState(initialLaptop?.ram || '16GB DDR4');
  const [storage, setStorage] = useState(initialLaptop?.storage || '512GB NVMe M.2 SSD');
  const [display, setDisplay] = useState(initialLaptop?.display || '14.0" Full HD (1920x1080) IPS Anti-Glare');
  const [graphics, setGraphics] = useState(initialLaptop?.graphics || 'Intel UHD Graphics 620');
  const [batteryHealth, setBatteryHealth] = useState(initialLaptop?.batteryHealth || 92);
  const [batteryBackup, setBatteryBackup] = useState(initialLaptop?.batteryBackup || '4 to 5 Hours');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>(initialLaptop?.conditionGrade || 'A+');
  const [bodyNotes, setBodyNotes] = useState(initialLaptop?.bodyNotes || 'Pristine cosmetic condition, zero scratches on screen, original charger included.');
  const [price, setPrice] = useState(initialLaptop?.price || 28000);
  const [originalPrice, setOriginalPrice] = useState(initialLaptop?.originalPrice || 33000);
  const [stock, setStock] = useState(initialLaptop?.stock || 3);
  const [warranty, setWarranty] = useState(initialLaptop?.warranty || '15 Days Replacement + 2 Years Free Service Warranty');
  const [category, setCategory] = useState<LaptopCategory>(initialLaptop?.category || 'Business');
  const [description, setDescription] = useState(initialLaptop?.description || 'Tested high-performance used laptop. Excellent thermal profile, responsive keyboard, fast NVMe boot.');
  const [ports, setPorts] = useState(initialLaptop?.ports || '2x USB 3.0, 1x Type-C, 1x HDMI, Audio combo, SD reader');
  const [images, setImages] = useState<string[]>(
    initialLaptop?.images && initialLaptop.images.length > 0
      ? initialLaptop.images
      : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle template pre-filling
  const handleApplyTemplate = (templateType: string) => {
    if (templateType === 'thinkpad') {
      setTitle('Lenovo ThinkPad T480 - Core i5 8th Gen / 16GB / 512GB SSD');
      setBrand('Lenovo');
      setSeries('ThinkPad T Series');
      setProcessor('Intel Core i5-8350U (Quad Core, up to 3.60 GHz)');
      setGeneration('8th Gen');
      setRam('16GB DDR4');
      setStorage('512GB NVMe M.2 SSD');
      setDisplay('14.0" FHD (1920x1080) IPS Anti-Glare');
      setGraphics('Intel UHD Graphics 620');
      setBatteryHealth(94);
      setBatteryBackup('4.5 to 5.5 Hours (Dual Battery)');
      setConditionGrade('A+');
      setPrice(28500);
      setOriginalPrice(34000);
      setCategory('Business');
      setStock(5);
      setImages([
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80'
      ]);
    } else if (templateType === 'macbook') {
      setTitle('Apple MacBook Air M1 (2020) - 8GB / 256GB SSD - Space Gray');
      setBrand('Apple');
      setSeries('MacBook Air');
      setProcessor('Apple M1 Chip (8-Core CPU / 7-Core GPU)');
      setGeneration('Apple Silicon M1');
      setRam('8GB Unified Memory');
      setStorage('256GB Ultra-Fast SSD');
      setDisplay('13.3" Retina Display True Tone (2560x1600)');
      setGraphics('Apple 7-Core GPU');
      setBatteryHealth(92);
      setBatteryBackup('10 to 12 Hours');
      setConditionGrade('A+');
      setPrice(68000);
      setOriginalPrice(78000);
      setCategory('MacBook');
      setStock(2);
      setImages([
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
      ]);
    } else if (templateType === 'hp') {
      setTitle('HP EliteBook 840 G6 - Core i7 8th Gen / 16GB / 512GB SSD');
      setBrand('HP');
      setSeries('EliteBook Series');
      setProcessor('Intel Core i7-8665U (up to 4.80 GHz)');
      setGeneration('8th Gen');
      setRam('16GB DDR4');
      setStorage('512GB NVMe SSD');
      setDisplay('14.0" FHD (1920x1080) IPS');
      setGraphics('Intel UHD Graphics 620');
      setBatteryHealth(89);
      setBatteryBackup('3.5 to 4.5 Hours');
      setConditionGrade('A');
      setPrice(33500);
      setOriginalPrice(39000);
      setCategory('Business');
      setStock(4);
      setImages([
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80'
      ]);
    } else if (templateType === 'dell') {
      setTitle('Dell Latitude 7490 - Core i5 8th Gen / 16GB / 256GB SSD');
      setBrand('Dell');
      setSeries('Latitude 7000 Series');
      setProcessor('Intel Core i5-8350U (up to 3.6GHz)');
      setGeneration('8th Gen');
      setRam('16GB DDR4');
      setStorage('256GB M.2 SSD');
      setDisplay('14.0" FHD WVA Anti-Glare');
      setGraphics('Intel UHD Graphics 620');
      setBatteryHealth(88);
      setBatteryBackup('3.5 to 4 Hours');
      setConditionGrade('A');
      setPrice(24500);
      setOriginalPrice(29000);
      setCategory('Budget Student');
      setStock(5);
      setImages([
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80'
      ]);
    }
  };

  // AI Auto Generator for Laptop Info
  const handleAiAutoFill = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-laptop-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: series || title,
          brand,
          processor,
          ram,
          storage,
          conditionGrade,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.bodyNotes) setBodyNotes(data.bodyNotes);
        if (data.category) setCategory(data.category);
        if (data.ports) setPorts(data.ports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Handle local image file upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages([reader.result, ...images]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter laptop model title');
      return;
    }

    if (!price || price <= 0) {
      setErrorMsg('Please enter a valid selling price');
      return;
    }

    const laptopToSave: Laptop = {
      id: initialLaptop?.id || `lap-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      brand,
      series: series.trim(),
      processor: processor.trim(),
      generation: generation.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      display: display.trim(),
      graphics: graphics.trim(),
      batteryHealth: Number(batteryHealth) || 90,
      batteryBackup: batteryBackup.trim(),
      conditionGrade,
      bodyNotes: bodyNotes.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      stock: Number(stock) || 1,
      warranty: warranty.trim(),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'],
      isFeatured: initialLaptop?.isFeatured ?? true,
      isBestSeller: initialLaptop?.isBestSeller ?? false,
      category,
      testedChecklist: initialLaptop?.testedChecklist || {
        displayTested: true,
        keyboardTested: true,
        batteryTested: true,
        thermalPerformance: true,
        originalCharger: true,
        portsTested: true,
        webcamMicTested: true,
      },
      description: description.trim(),
      ports: ports.trim(),
      createdAt: initialLaptop?.createdAt || new Date().toISOString(),
    };

    onSave(laptopToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#1E293B]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-600/40 text-blue-400 flex items-center justify-center font-black">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-black text-[#F8FAFC] text-base sm:text-lg uppercase tracking-wide">
                {isEditing ? 'Edit Laptop Information' : 'Upload New Used Laptop (নতুন ল্যাপটপ যুক্ত করুন)'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Upload specs, photos, condition grade, and pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-black uppercase tracking-wide">
              {errorMsg}
            </div>
          )}

          {/* Quick Auto-Fill Templates */}
          {!isEditing && (
            <div className="p-3.5 bg-[#1E293B] rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                ⚡ Quick Auto-Fill Common Models:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('thinkpad')}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-blue-950 border border-slate-700 hover:border-blue-500 rounded-lg text-xs font-black uppercase tracking-wide text-slate-300 hover:text-white transition-colors"
                >
                  Lenovo ThinkPad T480
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('macbook')}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-blue-950 border border-slate-700 hover:border-blue-500 rounded-lg text-xs font-black uppercase tracking-wide text-slate-300 hover:text-white transition-colors"
                >
                  MacBook Air M1
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('hp')}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-blue-950 border border-slate-700 hover:border-blue-500 rounded-lg text-xs font-black uppercase tracking-wide text-slate-300 hover:text-white transition-colors"
                >
                  HP EliteBook 840 G6
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('dell')}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-blue-950 border border-slate-700 hover:border-blue-500 rounded-lg text-xs font-black uppercase tracking-wide text-slate-300 hover:text-white transition-colors"
                >
                  Dell Latitude 7490
                </button>
              </div>
            </div>
          )}

          {/* Main Title & AI Button */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                Laptop Full Title / Display Name <span className="text-cyan-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiGenerating}
                className="text-xs font-black uppercase tracking-wide text-cyan-300 hover:text-cyan-200 flex items-center gap-1 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-600/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'AI Generating...' : 'Auto-Generate AI Specs & Description'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lenovo ThinkPad T480 - Core i5 8th Gen / 16GB / 512GB SSD"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#1E293B] text-sm font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Brand */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-bold text-white"
              >
                <option value="Lenovo">Lenovo</option>
                <option value="Apple">Apple</option>
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="Asus">Asus</option>
                <option value="Acer">Acer</option>
                <option value="MSI">MSI</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Series */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Series / Model Name</label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="e.g. ThinkPad T480 / EliteBook G6"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-bold text-white"
              >
                <option value="Business">Business</option>
                <option value="Ultrabook">Ultrabook</option>
                <option value="Gaming">Gaming</option>
                <option value="Budget Student">Budget Student</option>
                <option value="MacBook">MacBook</option>
                <option value="Workstation">Workstation</option>
              </select>
            </div>
          </div>

          {/* Processor, RAM, Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Processor</label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="Intel Core i5-8350U (up to 3.6GHz)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">RAM</label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="16GB DDR4"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Storage (SSD / NVMe)</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="512GB NVMe M.2 SSD"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>
          </div>

          {/* Display & Graphics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Display</label>
              <input
                type="text"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder='14.0" FHD (1920x1080) IPS Anti-Glare'
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Graphics</label>
              <input
                type="text"
                value={graphics}
                onChange={(e) => setGraphics(e.target.value)}
                placeholder="Intel UHD Graphics 620 / RTX 3050 4GB"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>
          </div>

          {/* Condition, Battery, Price & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Condition Grade</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-black text-cyan-300"
              >
                <option value="A+">Grade A+ (Like New 99%)</option>
                <option value="A">Grade A (Pristine 95%)</option>
                <option value="B">Grade B (Minor Scratches)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Battery Health (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-black text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Selling Price (BDT ৳) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-black text-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">In-Stock Qty</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs font-black text-white"
              />
            </div>
          </div>

          {/* Physical Body Notes & Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Cosmetic & Body Notes</label>
              <input
                type="text"
                value={bodyNotes}
                onChange={(e) => setBodyNotes(e.target.value)}
                placeholder="Pristine condition, original 65W charger included"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Warranty Coverage</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="15 Days Replacement + 2 Years Service Warranty"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Product Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-[#1E293B] text-xs leading-relaxed text-white font-medium"
            />
          </div>

          {/* Images Section: URLs + File Upload */}
          <div className="space-y-3 p-4 bg-[#1E293B] rounded-2xl border border-slate-800">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
              Laptop Images ({images.length})
            </label>

            {/* Add Image Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File upload */}
              <div>
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer text-xs font-black uppercase tracking-wide text-slate-300 hover:text-white transition-colors shadow-2xs">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload Image File from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL add */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="flex-1 px-3 py-2 bg-[#0F172A] rounded-xl border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wide"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Image Preview Grid */}
            <div className="flex flex-wrap gap-2 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 group bg-[#0F172A]">
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-black uppercase tracking-wide text-xs hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wide text-xs shadow-xl shadow-blue-950/50 transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Publish Laptop to Store (আপলোড সম্পন্ন করুন)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
