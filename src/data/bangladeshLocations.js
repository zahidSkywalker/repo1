// Comprehensive Bangladesh Administrative Data
// Source: Based on official Bangladesh government data and administrative divisions

export const bangladeshLocations = {
  divisions: [
    {
      id: 'dhaka',
      name: 'ঢাকা বিভাগ',
      english: 'Dhaka Division',
      districts: [
        {
          id: 'dhaka-city',
          name: 'ঢাকা সিটি কর্পোরেশন',
          english: 'Dhaka City Corporation',
          subDistricts: [
            {
              id: 'dhanmondi',
              name: 'ধানমন্ডি',
              english: 'Dhanmondi',
              areas: [
                { id: 'dhanmondi-27', name: 'ধানমন্ডি ২৭', english: 'Dhanmondi 27' },
                { id: 'dhanmondi-32', name: 'ধানমন্ডি ৩২', english: 'Dhanmondi 32' },
                { id: 'dhanmondi-27-lake', name: 'ধানমন্ডি লেক', english: 'Dhanmondi Lake' },
                { id: 'dhanmondi-15', name: 'ধানমন্ডি ১৫', english: 'Dhanmondi 15' }
              ]
            },
            {
              id: 'gulshan',
              name: 'গুলশান',
              english: 'Gulshan',
              areas: [
                { id: 'gulshan-1', name: 'গুলশান ১', english: 'Gulshan 1' },
                { id: 'gulshan-2', name: 'গুলশান ২', english: 'Gulshan 2' },
                { id: 'gulshan-1-circle', name: 'গুলশান সার্কেল ১', english: 'Gulshan Circle 1' },
                { id: 'gulshan-2-circle', name: 'গুলশান সার্কেল ২', english: 'Gulshan Circle 2' }
              ]
            },
            {
              id: 'banani',
              name: 'বনানী',
              english: 'Banani',
              areas: [
                { id: 'banani-11', name: 'বনানী ১১', english: 'Banani 11' },
                { id: 'banani-12', name: 'বনানী ১২', english: 'Banani 12' },
                { id: 'banani-road-11', name: 'বনানী রোড ১১', english: 'Banani Road 11' },
                { id: 'banani-road-12', name: 'বনানী রোড ১২', english: 'Banani Road 12' }
              ]
            },
            {
              id: 'uttara',
              name: 'উত্তরা',
              english: 'Uttara',
              areas: [
                { id: 'uttara-1', name: 'উত্তরা ১', english: 'Uttara 1' },
                { id: 'uttara-2', name: 'উত্তরা ২', english: 'Uttara 2' },
                { id: 'uttara-3', name: 'উত্তরা ৩', english: 'Uttara 3' },
                { id: 'uttara-4', name: 'উত্তরা ৪', english: 'Uttara 4' }
              ]
            },
            {
              id: 'mohammadpur',
              name: 'মোহাম্মদপুর',
              english: 'Mohammadpur',
              areas: [
                { id: 'mohammadpur-1', name: 'মোহাম্মদপুর ১', english: 'Mohammadpur 1' },
                { id: 'mohammadpur-2', name: 'মোহাম্মদপুর ২', english: 'Mohammadpur 2' },
                { id: 'mohammadpur-3', name: 'মোহাম্মদপুর ৩', english: 'Mohammadpur 3' }
              ]
            },
            {
              id: 'lalbagh',
              name: 'লালবাগ',
              english: 'Lalbagh',
              areas: [
                { id: 'lalbagh-fort', name: 'লালবাগ কেল্লা', english: 'Lalbagh Fort' },
                { id: 'lalbagh-road', name: 'লালবাগ রোড', english: 'Lalbagh Road' },
                { id: 'lalbagh-bazar', name: 'লালবাগ বাজার', english: 'Lalbagh Bazar' }
              ]
            },
            {
              id: 'mirpur',
              name: 'মিরপুর',
              english: 'Mirpur',
              areas: [
                { id: 'mirpur-1', name: 'মিরপুর ১', english: 'Mirpur 1' },
                { id: 'mirpur-2', name: 'মিরপুর ২', english: 'Mirpur 2' },
                { id: 'mirpur-6', name: 'মিরপুর ৬', english: 'Mirpur 6' },
                { id: 'mirpur-10', name: 'মিরপুর ১০', english: 'Mirpur 10' },
                { id: 'mirpur-11', name: 'মিরপুর ১১', english: 'Mirpur 11' },
                { id: 'mirpur-12', name: 'মিরপুর ১২', english: 'Mirpur 12' }
              ]
            }
          ]
        },
        {
          id: 'gazipur',
          name: 'গাজীপুর',
          english: 'Gazipur',
          subDistricts: [
            {
              id: 'gazipur-sadar',
              name: 'গাজীপুর সদর',
              english: 'Gazipur Sadar',
              areas: [
                { id: 'gazipur-town', name: 'গাজীপুর শহর', english: 'Gazipur Town' },
                { id: 'gazipur-bazar', name: 'গাজীপুর বাজার', english: 'Gazipur Bazar' }
              ]
            },
            {
              id: 'kaliakair',
              name: 'কালিয়াকৈর',
              english: 'Kaliakair',
              areas: [
                { id: 'kaliakair-sadar', name: 'কালিয়াকৈর সদর', english: 'Kaliakair Sadar' },
                { id: 'kaliakair-bazar', name: 'কালিয়াকৈর বাজার', english: 'Kaliakair Bazar' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chittagong',
      name: 'চট্টগ্রাম বিভাগ',
      english: 'Chittagong Division',
      districts: [
        {
          id: 'chittagong-city',
          name: 'চট্টগ্রাম সিটি কর্পোরেশন',
          english: 'Chittagong City Corporation',
          subDistricts: [
            {
              id: 'agrabad',
              name: 'আগ্রাবাদ',
              english: 'Agrabad',
              areas: [
                { id: 'agrabad-commercial', name: 'আগ্রাবাদ বাণিজ্যিক এলাকা', english: 'Agrabad Commercial Area' },
                { id: 'agrabad-port', name: 'আগ্রাবাদ বন্দর', english: 'Agrabad Port' }
              ]
            },
            {
              id: 'patenga',
              name: 'পতেঙ্গা',
              english: 'Patenga',
              areas: [
                { id: 'patenga-beach', name: 'পতেঙ্গা সমুদ্র সৈকত', english: 'Patenga Beach' },
                { id: 'patenga-airport', name: 'পতেঙ্গা বিমানবন্দর', english: 'Patenga Airport' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'sylhet',
      name: 'সিলেট বিভাগ',
      english: 'Sylhet Division',
      districts: [
        {
          id: 'sylhet-sadar',
          name: 'সিলেট সদর',
          english: 'Sylhet Sadar',
          subDistricts: [
            {
              id: 'sylhet-city',
              name: 'সিলেট শহর',
              english: 'Sylhet City',
              areas: [
                { id: 'sylhet-bazar', name: 'সিলেট বাজার', english: 'Sylhet Bazar' },
                { id: 'sylhet-tea-garden', name: 'সিলেট চা বাগান', english: 'Sylhet Tea Garden' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'rajshahi',
      name: 'রাজশাহী বিভাগ',
      english: 'Rajshahi Division',
      districts: [
        {
          id: 'rajshahi-sadar',
          name: 'রাজশাহী সদর',
          english: 'Rajshahi Sadar',
          subDistricts: [
            {
              id: 'rajshahi-city',
              name: 'রাজশাহী শহর',
              english: 'Rajshahi City',
              areas: [
                { id: 'rajshahi-bazar', name: 'রাজশাহী বাজার', english: 'Rajshahi Bazar' },
                { id: 'rajshahi-university', name: 'রাজশাহী বিশ্ববিদ্যালয়', english: 'Rajshahi University' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'khulna',
      name: 'খুলনা বিভাগ',
      english: 'Khulna Division',
      districts: [
        {
          id: 'khulna-sadar',
          name: 'খুলনা সদর',
          english: 'Khulna Sadar',
          subDistricts: [
            {
              id: 'khulna-city',
              name: 'খুলনা শহর',
              english: 'Khulna City',
              areas: [
                { id: 'khulna-bazar', name: 'খুলনা বাজার', english: 'Khulna Bazar' },
                { id: 'khulna-port', name: 'খুলনা বন্দর', english: 'Khulna Port' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'barisal',
      name: 'বরিশাল বিভাগ',
      english: 'Barisal Division',
      districts: [
        {
          id: 'barisal-sadar',
          name: 'বরিশাল সদর',
          english: 'Barisal Sadar',
          subDistricts: [
            {
              id: 'barisal-city',
              name: 'বরিশাল শহর',
              english: 'Barisal City',
              areas: [
                { id: 'barisal-bazar', name: 'বরিশাল বাজার', english: 'Barisal Bazar' },
                { id: 'barisal-river', name: 'বরিশাল নদী', english: 'Barisal River' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'rangpur',
      name: 'রংপুর বিভাগ',
      english: 'Rangpur Division',
      districts: [
        {
          id: 'rangpur-sadar',
          name: 'রংপুর সদর',
          english: 'Rangpur Sadar',
          subDistricts: [
            {
              id: 'rangpur-city',
              name: 'রংপুর শহর',
              english: 'Rangpur City',
              areas: [
                { id: 'rangpur-bazar', name: 'রংপুর বাজার', english: 'Rangpur Bazar' },
                { id: 'rangpur-college', name: 'রংপুর কলেজ', english: 'Rangpur College' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'mymensingh',
      name: 'ময়মনসিংহ বিভাগ',
      english: 'Mymensingh Division',
      districts: [
        {
          id: 'mymensingh-sadar',
          name: 'ময়মনসিংহ সদর',
          english: 'Mymensingh Sadar',
          subDistricts: [
            {
              id: 'mymensingh-city',
              name: 'ময়মনসিংহ শহর',
              english: 'Mymensingh City',
              areas: [
                { id: 'mymensingh-bazar', name: 'ময়মনসিংহ বাজার', english: 'Mymensingh Bazar' },
                { id: 'mymensingh-university', name: 'ময়মনসিংহ বিশ্ববিদ্যালয়', english: 'Mymensingh University' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Helper functions for location data
export const getDivisionById = (divisionId) => {
  return bangladeshLocations.divisions.find(div => div.id === divisionId);
};

export const getDistrictById = (divisionId, districtId) => {
  const division = getDivisionById(divisionId);
  if (!division) return null;
  return division.districts.find(dist => dist.id === districtId);
};

export const getSubDistrictById = (divisionId, districtId, subDistrictId) => {
  const district = getDistrictById(divisionId, districtId);
  if (!district) return null;
  return district.subDistricts.find(subDist => subDist.id === subDistrictId);
};

export const getAreaById = (divisionId, districtId, subDistrictId, areaId) => {
  const subDistrict = getSubDistrictById(divisionId, districtId, subDistrictId);
  if (!subDistrict) return null;
  return subDistrict.areas.find(area => area.id === areaId);
};

// Get all divisions for dropdown
export const getAllDivisions = () => {
  return bangladeshLocations.divisions.map(div => ({
    id: div.id,
    name: div.name,
    english: div.english
  }));
};

// Get districts for a specific division
export const getDistrictsByDivision = (divisionId) => {
  const division = getDivisionById(divisionId);
  if (!division) return [];
  return division.districts.map(dist => ({
    id: dist.id,
    name: dist.name,
    english: dist.english
  }));
};

// Get sub-districts for a specific district
export const getSubDistrictsByDistrict = (divisionId, districtId) => {
  const district = getDistrictById(divisionId, districtId);
  if (!district) return [];
  return district.subDistricts.map(subDist => ({
    id: subDist.id,
    name: subDist.name,
    english: subDist.english
  }));
};

// Get areas for a specific sub-district
export const getAreasBySubDistrict = (divisionId, districtId, subDistrictId) => {
  const subDistrict = getSubDistrictById(divisionId, districtId, subDistrictId);
  if (!subDistrict) return [];
  return subDistrict.areas.map(area => ({
    id: area.id,
    name: area.name,
    english: area.english
  }));
};

// Popular locations for quick selection
export const popularLocations = [
  {
    id: 'dhanmondi-27',
    name: 'ধানমন্ডি ২৭',
    english: 'Dhanmondi 27',
    division: 'dhaka',
    district: 'dhaka-city',
    subDistrict: 'dhanmondi'
  },
  {
    id: 'gulshan-1',
    name: 'গুলশান ১',
    english: 'Gulshan 1',
    division: 'dhaka',
    district: 'dhaka-city',
    subDistrict: 'gulshan'
  },
  {
    id: 'banani-11',
    name: 'বনানী ১১',
    english: 'Banani 11',
    division: 'dhaka',
    district: 'dhaka-city',
    subDistrict: 'banani'
  },
  {
    id: 'uttara-1',
    name: 'উত্তরা ১',
    english: 'Uttara 1',
    division: 'dhaka',
    district: 'dhaka-city',
    subDistrict: 'uttara'
  },
  {
    id: 'mirpur-1',
    name: 'মিরপুর ১',
    english: 'Mirpur 1',
    division: 'dhaka',
    district: 'dhaka-city',
    subDistrict: 'mirpur'
  }
];

export default bangladeshLocations;