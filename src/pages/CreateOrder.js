import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Calendar, DollarSign, Package, MapPin, Users, AlertCircle, Star, TrendingUp, Heart } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CreateOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    totalQuantity: '',
    minimumThreshold: '',
    pricePerUnit: '',
    unit: '',
    location: '',
    deadline: '',
    notes: '',
    image: null
  });
  const [errors, setErrors] = useState({});

  // Bangladesh-focused categories and units
  const categories = [
    { value: 'চাল', label: 'চাল (Rice)', icon: '🌾', popular: true },
    { value: 'ডাল', label: 'ডাল (Lentils)', icon: '🫘', popular: true },
    { value: 'আটা', label: 'আটা (Flour)', icon: '🌾', popular: false },
    { value: 'চিনি', label: 'চিনি (Sugar)', icon: '🍯', popular: false },
    { value: 'তেল', label: 'তেল (Oil)', icon: '🫗', popular: true },
    { value: 'মসলা', label: 'মসলা (Spices)', icon: '🌶️', popular: true },
    { value: 'চা', label: 'চা (Tea)', icon: '🍵', popular: false },
    { value: 'দুধ', label: 'দুধ (Milk)', icon: '🥛', popular: false }
  ];

  const units = [
    { value: 'কেজি', label: 'কেজি (kg)', popular: true },
    { value: 'গ্রাম', label: 'গ্রাম (g)', popular: false },
    { value: 'লিটার', label: 'লিটার (L)', popular: true },
    { value: 'মিলি', label: 'মিলি (ml)', popular: false },
    { value: 'পিস', label: 'পিস (pcs)', popular: false },
    { value: 'বক্স', label: 'বক্স (boxes)', popular: false },
    { value: 'ব্যাগ', label: 'ব্যাগ (bags)', popular: true },
    { value: 'বোতল', label: 'বোতল (bottles)', popular: false }
  ];

  // Popular locations in Bangladesh
  const popularLocations = [
    'ধানমন্ডি, ঢাকা',
    'গুলশান, ঢাকা',
    'বনানী, ঢাকা',
    'মোহাম্মদপুর, ঢাকা',
    'মিরপুর, ঢাকা',
    'লালবাগ, ঢাকা',
    'উত্তরা, ঢাকা',
    'মোহাম্মদপুর, ঢাকা'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'পণ্যের নাম প্রয়োজন (Item name is required)';
    }

    if (!formData.category) {
      newErrors.category = 'ক্যাটাগরি নির্বাচন করুন (Category is required)';
    }

    if (!formData.totalQuantity || formData.totalQuantity <= 0) {
      newErrors.totalQuantity = 'মোট পরিমাণ ০ এর চেয়ে বেশি হতে হবে (Total quantity must be greater than 0)';
    }

    if (!formData.minimumThreshold || formData.minimumThreshold <= 0) {
      newErrors.minimumThreshold = 'ন্যূনতম সীমা ০ এর চেয়ে বেশি হতে হবে (Minimum threshold must be greater than 0)';
    }

    if (parseFloat(formData.minimumThreshold) > parseFloat(formData.totalQuantity)) {
      newErrors.minimumThreshold = 'ন্যূনতম সীমা মোট পরিমাণের চেয়ে বেশি হতে পারবে না (Minimum threshold cannot exceed total quantity)';
    }

    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = 'একক প্রতি দাম ০ এর চেয়ে বেশি হতে হবে (Price per unit must be greater than 0)';
    }

    if (!formData.unit) {
      newErrors.unit = 'একক নির্বাচন করুন (Unit is required)';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'অবস্থান প্রয়োজন (Location is required)';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'শেষ তারিখ প্রয়োজন (Deadline is required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to orders page
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">প্রমাণীকরণ প্রয়োজন (Authentication Required)</h3>
          <p className="mt-1 text-sm text-gray-500">
            অর্ডার তৈরি করতে আপনাকে লগইন করতে হবে। (You need to be logged in to create an order.)
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Animation */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            নতুন গোষ্ঠী অর্ডার তৈরি করুন
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            আপনার প্রতিবেশীদের সাথে অর্থ সঞ্চয় করার জন্য নতুন গোষ্ঠী অর্ডার শুরু করুন
          </p>
          <p className="text-lg text-gray-500">
            Start a new group order to save money with your neighbors
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-colors ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStep === 1 && 'মৌলিক তথ্য (Basic Information)'}
              {currentStep === 2 && 'পরিমাণ ও মূল্য (Quantity & Pricing)'}
              {currentStep === 3 && 'অবস্থান ও সময় (Location & Timeline)'}
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="bg-white rounded-lg shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Basic Information */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Package className="w-6 h-6 mr-3 text-green-600" />
                      মৌলিক তথ্য (Basic Information)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                          পণ্যের নাম * (Item Name)
                        </label>
                        <input
                          type="text"
                          id="itemName"
                          name="itemName"
                          value={formData.itemName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.itemName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="যেমন: বাসমতি চাল (e.g., Basmati Rice)"
                        />
                        {errors.itemName && (
                          <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          ক্যাটাগরি * (Category)
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.category ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">ক্যাটাগরি নির্বাচন করুন (Select category)</option>
                          {categories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.icon} {category.label}
                              {category.popular && ' ⭐'}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          বিবরণ (Description)
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="পণ্যের গুণমান, ব্র্যান্ড, ইত্যাদি বর্ণনা করুন। (Describe the item, quality, brand, etc.)"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Quantity and Pricing */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
                      পরিমাণ ও মূল্য (Quantity & Pricing)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                          মোট পরিমাণ * (Total Quantity)
                        </label>
                        <input
                          type="number"
                          id="totalQuantity"
                          name="totalQuantity"
                          value={formData.totalQuantity}
                          onChange={handleChange}
                          min="1"
                          step="0.01"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.totalQuantity ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="100"
                        />
                        {errors.totalQuantity && (
                          <p className="mt-1 text-sm text-red-600">{errors.totalQuantity}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="minimumThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                          ন্যূনতম সীমা * (Min Threshold)
                        </label>
                        <input
                          type="number"
                          id="minimumThreshold"
                          name="minimumThreshold"
                          value={formData.minimumThreshold}
                          onChange={handleChange}
                          min="1"
                          step="0.01"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.minimumThreshold ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="50"
                        />
                        {errors.minimumThreshold && (
                          <p className="mt-1 text-sm text-red-600">{errors.minimumThreshold}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-2">
                          একক প্রতি দাম * (Price/Unit)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">৳</span>
                          </div>
                          <input
                            type="number"
                            id="pricePerUnit"
                            name="pricePerUnit"
                            value={formData.pricePerUnit}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                              errors.pricePerUnit ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="120"
                          />
                        </div>
                        {errors.pricePerUnit && (
                          <p className="mt-1 text-sm text-red-600">{errors.pricePerUnit}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                          একক * (Unit)
                        </label>
                        <select
                          id="unit"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.unit ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">একক নির্বাচন করুন (Select unit)</option>
                          {units.map(unit => (
                            <option key={unit.value} value={unit.value}>
                              {unit.label}
                              {unit.popular && ' ⭐'}
                            </option>
                          ))}
                        </select>
                        {errors.unit && (
                          <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                        )}
                      </div>
                    </div>

                    {/* Savings Calculator */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-800 mb-2">
                        💰 সঞ্চয় ক্যালকুলেটর (Savings Calculator)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">মোট মূল্য:</span>
                          <span className="ml-2 font-medium text-green-700">
                            ৳{formData.totalQuantity && formData.pricePerUnit ? (formData.totalQuantity * formData.pricePerUnit).toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">প্রতিবেশী সঞ্চয়:</span>
                          <span className="ml-2 font-medium text-green-700">
                            ৳{formData.totalQuantity && formData.pricePerUnit ? (formData.totalQuantity * formData.pricePerUnit * 0.15).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Location and Deadline */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-green-600" />
                      অবস্থান ও সময় (Location & Timeline)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                          সংগ্রহস্থল * (Pickup Location)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                              errors.location ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="যেমন: ধানমন্ডি কমিউনিটি সেন্টার (e.g., Dhanmondi Community Center)"
                          />
                        </div>
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                        )}
                        
                        {/* Popular Locations */}
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">জনপ্রিয় অবস্থান (Popular locations):</p>
                          <div className="flex flex-wrap gap-2">
                            {popularLocations.map((location, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, location }))}
                                className="text-xs bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-2 py-1 rounded-full transition-colors"
                              >
                                {location}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                          অর্ডার শেষ তারিখ * (Order Deadline)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                              errors.deadline ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.deadline && (
                          <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      অতিরিক্ত বিবরণ (Additional Details)
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                          অংশগ্রহণকারীদের জন্য নোট (Notes for Participants)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="বিশেষ নির্দেশনা, গুণমানের প্রয়োজনীয়তা, বা অতিরিক্ত তথ্য... (Any special instructions, quality requirements, or additional information...)"
                        />
                      </div>

                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                          পণ্যের ছবি (Item Image)
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                              {formData.image ? (
                                <img
                                  src={URL.createObjectURL(formData.image)}
                                  alt="Preview"
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              ) : (
                                <Upload className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <input
                              type="file"
                              id="image"
                              name="image"
                              onChange={handleImageChange}
                              accept="image/*"
                              className="sr-only"
                            />
                            <label
                              htmlFor="image"
                              className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                              ছবি নির্বাচন করুন (Choose Image)
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG সর্বোচ্চ ৫MB (PNG, JPG up to 5MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentStep > 1 ? 1.05 : 1 }}
                whileTap={{ scale: currentStep > 1 ? 0.95 : 1 }}
              >
                আগে (Previous)
              </motion.button>

              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  বাতিল (Cancel)
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    পরবর্তী (Next)
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" text="" />
                    ) : (
                      'অর্ডার তৈরি করুন (Create Order)'
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateOrder;