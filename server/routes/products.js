const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Utility to load dataset from JSON file
function loadGroceryData() {
  const filePath = path.join(__dirname, '..', 'data', 'grocery.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

// GET /api/products
// Query params: category=Vegetables, name=rice (case-insensitive contains)
router.get('/', (req, res) => {
  try {
    let products = loadGroceryData();

    const { category, name } = req.query;

    if (category) {
      const cat = String(category).toLowerCase();
      products = products.filter(p => (p.category || '').toLowerCase() === cat);
    }

    if (name) {
      const q = String(name).toLowerCase();
      products = products.filter(p =>
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.name_bn && p.name_bn.toLowerCase().includes(q))
      );
    }

    // Future-ready: shape consistent fields
    const shaped = products.map(p => ({
      id: p.id,
      name_en: p.name_en,
      name_bn: p.name_bn,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      image: p.image
    }));

    res.json({ count: shaped.length, products: shaped });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

module.exports = router;