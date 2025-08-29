import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Package, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import LocationSelector from '../components/common/LocationSelector';

const CreateOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    totalQuantity: '',
    unit: '',
    minimumThreshold: '',
    pricePerUnit: '',
    retailPrice: '',
    deadline: '',
    location: {},
    image: null,
    tags: []
  });

  const [errors, setErrors] = useState({});

  // Bangladesh-specific categories and units
  const categories = [
    { value: 'চাল', label: 'চাল (Rice)', english: 'Rice' },
    { value: 'ডাল', label: 'ডাল (Lentils)', english: 'Lentils' },
    { value: 'আটা', label: 'আটা (Flour)', english: 'Flour' },
    { value: 'চিনি', label: 'চিনি (Sugar)', english: 'Sugar' },
    { value: 'তেল', label: 'তেল (Oil)', english: 'Oil' },
    { value: 'মসলা', label: 'মসলা (Spices)', english: 'Spices' },
    { value: 'দুধ', label: 'দুধ (Milk)', english: 'Milk' },
    { value: 'চা', label: 'চা (Tea)', english: 'Tea' },
    { value: 'সবজি', label: 'সবজি (Vegetables)', english: 'Vegetables' },
    { value: 'ফল', label: 'ফল (Fruits)', english: 'Fruits' },
    { value: 'মাংস', label: 'মাংস (Meat)', english: 'Meat' },
    { value: 'মাছ', label: 'মাছ (Fish)', english: 'Fish' },
    { value: 'ডিম', label: 'ডিম (Eggs)', english: 'Eggs' },
    { value: 'রুটি', label: 'রুটি (Bread)', english: 'Bread' },
    { value: 'অন্যান্য', label: 'অন্যান্য (Others)', english: 'Others' }
  ];

  const units = [
    { value: 'কেজি', label: 'কেজি (KG)', english: 'Kilogram' },
    { value: 'গ্রাম', label: 'গ্রাম (Gram)', english: 'Gram' },
    { value: 'লিটার', label: 'লিটার (Liter)', english: 'Liter' },
    { value: 'মিলিলিটার', label: 'মিলিলিটার (ML)', english: 'Milliliter' },
    { value: 'পিস', label: 'পিস (Piece)', english: 'Piece' },
    { value: 'প্যাকেট', label: 'প্যাকেট (Packet)', english: 'Packet' },
    { value: 'বোতল', label: 'বোতল (Bottle)', english: 'Bottle' },
    { value: 'ক্যান', label: 'ক্যান (Can)', english: 'Can' },
    { value: 'বাক্স', label: 'বাক্স (Box)', english: 'Box' },
    { value: 'স্যাক', label: 'স্যাক (Sack)', english: 'Sack' }
  ];

  const popularTags = [
    'Fresh', 'Organic', 'Premium', 'Local', 'Imported', 'Seasonal', 'Healthy', 'Traditional'
  ];

  const steps = [
    { number: 1, title: 'পণ্যের বিবরণ', english: 'Product Details' },
    { number: 2, title: 'পরিমাণ ও মূল্য', english: 'Quantity & Price' },
    { number: 3, title: 'অবস্থান ও সময়', english: 'Location & Time' },
    { number: 4, title: 'পর্যালোচনা', english: 'Review' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.itemName.trim()) newErrors.itemName = 'পণ্যের নাম প্রয়োজন';
        if (!formData.category) newErrors.category = 'ক্যাটাগরি নির্বাচন করুন';
        if (!formData.description.trim()) newErrors.description = 'বিবরণ প্রয়োজন';
        break;
      case 2:
        if (!formData.totalQuantity) newErrors.totalQuantity = 'মোট পরিমাণ প্রয়োজন';
        if (!formData.unit) newErrors.unit = 'একক নির্বাচন করুন';
        if (!formData.minimumThreshold) newErrors.minimumThreshold = 'ন্যূনতম সীমা প্রয়োজন';
        if (!formData.pricePerUnit) newErrors.pricePerUnit = 'একক মূল্য প্রয়োজন';
        if (!formData.retailPrice) newErrors.retailPrice = 'খুচরা মূল্য প্রয়োজন';
        break;
      case 3:
        if (!formData.deadline) newErrors.deadline = 'শেষ তারিখ প্রয়োজন';
        if (!formData.location.area) newErrors.location = 'এলাকা নির্বাচন করুন';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateSavings = () => {
    if (formData.retailPrice && formData.pricePerUnit) {
      const retail = parseFloat(formData.retailPrice);
      const group = parseFloat(formData.pricePerUnit);
      return retail - group;
    }
    return 0;
  };

  const calculateSavingsPercentage = () => {
    if (formData.retailPrice && formData.pricePerUnit) {
      const retail = parseFloat(formData.retailPrice);
      const group = parseFloat(formData.pricePerUnit);
      return ((retail - group) / retail * 100).toFixed(1);
    }
    return 0;
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      try {
        // Here you would typically send the data to your backend
        console.log('Submitting order:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to success page or dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পণ্যের নাম (Product Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleInputChange('itemName', e.target.value)}
                placeholder="উদাহরণ: বাসমতি চাল, মুগ ডাল..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.itemName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.itemName && (
                <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ক্যাটাগরি (Category) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">ক্যাটাগরি নির্বাচন করুন (Select Category)</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.english})
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ (Description) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ট্যাগ (Tags)
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পণ্যের ছবি (Product Image)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-500 font-medium">
                    ছবি আপলোড করুন
                  </span>
                  <span className="text-gray-500"> অথবা ড্র্যাগ এন্ড ড্রপ করুন</span>
                </label>
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    নির্বাচিত: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Total Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                মোট পরিমাণ (Total Quantity) <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => handleInputChange('totalQuantity', e.target.value)}
                  placeholder="100"
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.totalQuantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">একক (Unit)</option>
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.totalQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.totalQuantity}</p>
              )}
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
              )}
            </div>

            {/* Minimum Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ন্যূনতম সীমা (Minimum Threshold) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minimumThreshold}
                onChange={(e) => handleInputChange('minimumThreshold', e.target.value)}
                placeholder="50"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.minimumThreshold ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className="mt-1 text-sm text-gray-500">
                এই পরিমাণে পৌঁছালে অর্ডার লক হয়ে যাবে
              </p>
              {errors.minimumThreshold && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumThreshold}</p>
              )}
            </div>

            {/* Price Per Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                দলগত মূল্য (Group Price) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                <input
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                  placeholder="120"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.pricePerUnit ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.pricePerUnit && (
                <p className="mt-1 text-sm text-red-600">{errors.pricePerUnit}</p>
              )}
            </div>

            {/* Retail Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                খুচরা মূল্য (Retail Price) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                <input
                  type="number"
                  value={formData.retailPrice}
                  onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                  placeholder="135"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.retailPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.retailPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.retailPrice}</p>
              )}
            </div>

            {/* Savings Calculator */}
            {(formData.retailPrice && formData.pricePerUnit) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  সঞ্চয় ক্যালকুলেটর (Savings Calculator)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">প্রতি এককে সঞ্চয়:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      ৳{calculateSavings()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">সঞ্চয়ের শতকরা হার:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {calculateSavingsPercentage()}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ডেলিভারি এলাকা (Delivery Area) <span className="text-red-500">*</span>
              </label>
              <LocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="এলাকা নির্বাচন করুন (Select Area)"
                required={true}
                error={errors.location}
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                শেষ তারিখ (Deadline) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.deadline ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className="mt-1 text-sm text-gray-500">
                এই তারিখের মধ্যে অর্ডার সম্পন্ন করতে হবে
              </p>
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
              )}
            </div>

            {/* Popular Locations Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                জনপ্রিয় এলাকা (Popular Areas)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['ধানমন্ডি ২৭', 'গুলশান ১', 'বনানী ১১', 'উত্তরা ১', 'মিরপুর ১'].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleLocationChange({ area: area.toLowerCase().replace(/\s+/g, '-') })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Review Header */}
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                আপনার অর্ডার পর্যালোচনা করুন
              </h3>
              <p className="text-gray-600">
                Review your order before submitting
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                অর্ডারের বিবরণ (Order Details)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">পণ্যের নাম:</span>
                  <span className="ml-2 font-medium">{formData.itemName}</span>
                </div>
                <div>
                  <span className="text-gray-600">ক্যাটাগরি:</span>
                  <span className="ml-2 font-medium">{formData.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">মোট পরিমাণ:</span>
                  <span className="ml-2 font-medium">{formData.totalQuantity} {formData.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">ন্যূনতম সীমা:</span>
                  <span className="ml-2 font-medium">{formData.minimumThreshold} {formData.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">দলগত মূল্য:</span>
                  <span className="ml-2 font-medium">৳{formData.pricePerUnit}/{formData.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">খুচরা মূল্য:</span>
                  <span className="ml-2 font-medium">৳{formData.retailPrice}/{formData.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">শেষ তারিখ:</span>
                  <span className="ml-2 font-medium">{formData.deadline}</span>
                </div>
                <div>
                  <span className="text-gray-600">এলাকা:</span>
                  <span className="ml-2 font-medium">{formData.location.area || 'নির্বাচিত হয়নি'}</span>
                </div>
              </div>

              {/* Savings Summary */}
              {(formData.retailPrice && formData.pricePerUnit) && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-green-800 mb-2">
                    সঞ্চয়ের সারসংক্ষেপ (Savings Summary)
                  </h5>
                  <div className="text-green-700">
                    <p>প্রতি {formData.unit} এ সঞ্চয়: ৳{calculateSavings()}</p>
                    <p>মোট সঞ্চয়: ৳{calculateSavings() * formData.totalQuantity}</p>
                    <p>সঞ্চয়ের শতকরা হার: {calculateSavingsPercentage()}%</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <span className="text-gray-600">ট্যাগ:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Final Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h5 className="font-medium text-yellow-800">
                    গুরুত্বপূর্ণ (Important)
                  </h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    অর্ডার জমা দেওয়ার পর এটি সম্পাদনা করা যাবে না। 
                    সব তথ্য সঠিক কিনা নিশ্চিত করুন।
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            লগইন প্রয়োজন (Login Required)
          </h2>
          <p className="text-gray-600 mb-6">
            নতুন অর্ডার তৈরি করতে আপনাকে লগইন করতে হবে
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            লগইন করুন (Login)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            নতুন দলগত অর্ডার তৈরি করুন
          </h1>
          <p className="text-xl text-gray-600">
            Create New Group Order
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.number
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 transition-colors ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center flex-1">
                <div className={`text-sm font-medium ${
                  currentStep === step.number ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">
                  {step.english}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              আগে (Previous)
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                পরবর্তী (Next)
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                অর্ডার জমা দিন (Submit Order)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;