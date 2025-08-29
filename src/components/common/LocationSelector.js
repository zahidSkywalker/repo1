import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { 
  getAllDivisions, 
  getDistrictsByDivision, 
  getSubDistrictsByDistrict, 
  getAreasBySubDistrict,
  popularLocations 
} from '../../data/bangladeshLocations';

const LocationSelector = ({ 
  value = {}, 
  onChange, 
  placeholder = "অবস্থান নির্বাচন করুন", 
  showPopularLocations = true,
  className = "",
  required = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(value.division || '');
  const [selectedDistrict, setSelectedDistrict] = useState(value.district || '');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(value.subDistrict || '');
  const [selectedArea, setSelectedArea] = useState(value.area || '');
  
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  // Load divisions on component mount
  useEffect(() => {
    setDivisions(getAllDivisions());
  }, []);

  // Update districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      const newDistricts = getDistrictsByDivision(selectedDivision);
      setDistricts(newDistricts);
      setSelectedDistrict('');
      setSelectedSubDistrict('');
      setSelectedArea('');
      setSubDistricts([]);
      setAreas([]);
    } else {
      setDistricts([]);
      setSubDistricts([]);
      setAreas([]);
    }
  }, [selectedDivision]);

  // Update sub-districts when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const newSubDistricts = getSubDistrictsByDistrict(selectedDivision, selectedDistrict);
      setSubDistricts(newSubDistricts);
      setSelectedSubDistrict('');
      setSelectedArea('');
      setAreas([]);
    } else {
      setSubDistricts([]);
      setAreas([]);
    }
  }, [selectedDistrict, selectedDivision]);

  // Update areas when sub-district changes
  useEffect(() => {
    if (selectedSubDistrict) {
      const newAreas = getAreasBySubDistrict(selectedDivision, selectedDistrict, selectedSubDistrict);
      setAreas(newAreas);
      setSelectedArea('');
    } else {
      setAreas([]);
    }
  }, [selectedSubDistrict, selectedDivision, selectedDistrict]);

  // Update parent component when selection changes
  useEffect(() => {
    const locationData = {
      division: selectedDivision,
      district: selectedDistrict,
      subDistrict: selectedSubDistrict,
      area: selectedArea
    };
    
    if (onChange) {
      onChange(locationData);
    }
  }, [selectedDivision, selectedDistrict, selectedSubDistrict, selectedArea, onChange]);

  // Handle popular location selection
  const handlePopularLocationSelect = (location) => {
    setSelectedDivision(location.division);
    setSelectedDistrict(location.district);
    setSelectedSubDistrict(location.subDistrict);
    setSelectedArea(location.id);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedSubDistrict('');
    setSelectedArea('');
  };

  // Get display text for selected location
  const getDisplayText = () => {
    if (selectedArea) {
      const area = areas.find(a => a.id === selectedArea);
      return area ? `${area.name} (${area.english})` : placeholder;
    }
    if (selectedSubDistrict) {
      const subDist = subDistricts.find(s => s.id === selectedSubDistrict);
      return subDist ? `${subDist.name} (${subDist.english})` : placeholder;
    }
    if (selectedDistrict) {
      const district = districts.find(d => d.id === selectedDistrict);
      return district ? `${district.name} (${district.english})` : placeholder;
    }
    if (selectedDivision) {
      const division = divisions.find(d => d.id === selectedDivision);
      return division ? `${division.name} (${division.english})` : placeholder;
    }
    return placeholder;
  };

  // Check if any location is selected
  const hasSelection = selectedDivision || selectedDistrict || selectedSubDistrict || selectedArea;

  return (
    <div className={`relative ${className}`}>
      {/* Main Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
          error ? 'border-red-300' : hasSelection ? 'border-green-300' : 'border-gray-300'
        } ${hasSelection ? 'bg-green-50' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className={`w-5 h-5 ${hasSelection ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`${hasSelection ? 'text-gray-900' : 'text-gray-500'}`}>
              {getDisplayText()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {hasSelection && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {/* Popular Locations Section */}
            {showPopularLocations && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  জনপ্রিয় অবস্থান (Popular Locations)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {popularLocations.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => {
                        handlePopularLocationSelect(location);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-between p-2 text-left hover:bg-green-50 rounded-md transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.english}</div>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cascading Dropdowns */}
            <div className="p-4">
              {/* Division Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিভাগ (Division) {required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">বিভাগ নির্বাচন করুন (Select Division)</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name} ({division.english})
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection */}
              {selectedDivision && districts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    জেলা (District)
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">জেলা নির্বাচন করুন (Select District)</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name} ({district.english})
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Sub-District Selection */}
              {selectedDistrict && subDistricts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    উপজেলা/থানা (Sub-District/Thana)
                  </label>
                  <select
                    value={selectedSubDistrict}
                    onChange={(e) => setSelectedSubDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">উপজেলা নির্বাচন করুন (Select Sub-District)</option>
                    {subDistricts.map((subDistrict) => (
                      <option key={subDistrict.id} value={subDistrict.id}>
                        {subDistrict.name} ({subDistrict.english})
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Area Selection */}
              {selectedSubDistrict && areas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    এলাকা (Area)
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">এলাকা নির্বাচন করুন (Select Area)</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} ({area.english})
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Selection Summary */}
              {hasSelection && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
                >
                  <h4 className="text-sm font-medium text-green-800 mb-2">
                    নির্বাচিত অবস্থান (Selected Location)
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    {selectedDivision && (
                      <div>বিভাগ: {divisions.find(d => d.id === selectedDivision)?.name}</div>
                    )}
                    {selectedDistrict && (
                      <div>জেলা: {districts.find(d => d.id === selectedDistrict)?.name}</div>
                    )}
                    {selectedSubDistrict && (
                      <div>উপজেলা: {subDistricts.find(s => s.id === selectedSubDistrict)?.name}</div>
                    )}
                    {selectedArea && (
                      <div>এলাকা: {areas.find(a => a.id === selectedArea)?.name}</div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationSelector;