import React, { useEffect, useMemo, useState } from 'react';
import { API_CONFIG, API_ENDPOINTS, handleApiError, handleApiResponse } from '../config/api';
import { motion } from 'framer-motion';
import { Search, Filter, Tag } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60';

const categories = [
  'All',
  'Rice',
  'Lentils',
  'Oil',
  'Fish',
  'Meat',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Beverages'
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('name', search);
        const base = (API_CONFIG.API_BASE_URL || '').replace(/\/$/, '');
        const url = `${base}/products${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        const data = await handleApiResponse(res);
        if (!data || !Array.isArray(data.products)) {
          throw new Error('Unexpected API response');
        }
        setProducts(data.products);
      } catch (err) {
        const e = handleApiError(err);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  const filteredCount = products.length;

  const onImgError = (e) => {
    e.currentTarget.src = FALLBACK_IMG;
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Grocery Products</h1>
          <p className="text-gray-600">Bangladesh-focused essentials with Bangla + English names</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name (rice / চাল / dal / ডাল)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">{filteredCount} products found</div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="relative h-44 bg-gray-100">
                  <img
                    src={`${p.image}?auto=format&fit=crop&w=600&q=60`}
                    alt={p.name_en}
                    onError={onImgError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    <span>{p.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900">{p.name_bn}</h3>
                  <p className="text-sm text-gray-500 mb-2">{p.name_en}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-700 font-bold">৳{p.price} <span className="text-gray-500 text-sm">/ {p.unit}</span></div>
                      <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;