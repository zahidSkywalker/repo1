import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShoppingCart, Users, DollarSign, Truck, CheckCircle, Star, MapPin, Clock, Heart } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const cartRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const isInView = useInView(containerRef, { once: true });
  const [isGSAPLoaded, setIsGSAPLoaded] = useState(false);

  // GSAP Animations with error handling
  useEffect(() => {
    let gsap = null;
    let ScrollTrigger = null;

    // Dynamically import GSAP to prevent errors
    const loadGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        
        gsap = gsapModule.default;
        ScrollTrigger = ScrollTriggerModule.default;
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        setIsGSAPLoaded(true);
        
        // Start animations
        startAnimations(gsap, ScrollTrigger);
      } catch (error) {
        console.warn('GSAP failed to load, using fallback animations:', error);
        setIsGSAPLoaded(false);
      }
    };

    const startAnimations = (gsap, ScrollTrigger) => {
      if (!gsap || !mapRef.current || !cartRef.current) return;

      try {
        // Create the 3D map path with more complex curves
        const mapPath = [
          { x: 0, y: 0 },
          { x: 50, y: -20 },
          { x: 100, y: 10 },
          { x: 150, y: -30 },
          { x: 200, y: 20 },
          { x: 250, y: -10 },
          { x: 300, y: 40 },
          { x: 350, y: 0 },
          { x: 400, y: -25 },
          { x: 450, y: 15 }
        ];

        // Main cart animation along the map path
        gsap.to(cartRef.current, {
          duration: 12,
          ease: "none",
          repeat: -1,
          motionPath: {
            path: mapPath,
            curviness: 0.8,
            autoRotate: true
          }
        });

        // Enhanced cart bouncing and floating effects
        gsap.to(cartRef.current, {
          y: -10,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });

        // Cart rotation and scale effects
        gsap.to(cartRef.current, {
          rotation: 360,
          scale: [1, 1.1, 1],
          duration: 4,
          ease: "power2.inOut",
          repeat: -1
        });

        // Cart shadow animation for depth
        gsap.to(cartRef.current, {
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          duration: 2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });

        // Parallax effect for hero background
        gsap.to(".hero-bg", {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        // Animate map outline with drawing effect
        gsap.fromTo(".map-outline", {
          strokeDasharray: "1000",
          strokeDashoffset: "1000"
        }, {
          strokeDashoffset: 0,
          duration: 3,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });

        // Animate city dots with pulsing effect
        gsap.to("circle", {
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
          duration: 2,
          ease: "power2.inOut",
          repeat: -1,
          stagger: 0.5
        });

      } catch (error) {
        console.warn('GSAP animation failed:', error);
      }
    };

    loadGSAP();

    return () => {
      // Cleanup GSAP animations
      if (gsap && ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  const features = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'দলগত ক্রয়',
      subtitle: 'Group Buying',
      description: 'আপনার প্রতিবেশীদের সাথে মিলে পাইকারি দামে কেনাকাটা করুন।'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'সম্প্রদায় গঠন',
      subtitle: 'Build Community',
      description: 'প্রতিবেশীদের সাথে সম্পর্ক গড়ে তুলুন এবং স্থানীয় সম্প্রদায় শক্তিশালী করুন।'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'টাকা সঞ্চয়',
      subtitle: 'Save Money',
      description: 'দলগত ক্রয়ের মাধ্যমে পাইকারি দামে খাবার কিনুন এবং অর্থ সঞ্চয় করুন।'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'সুবিধাজনক ডেলিভারি',
      subtitle: 'Convenient Delivery',
      description: 'সবাইয়ের জন্য উপযুক্ত সময়ে ডেলিভারি ব্যবস্থা করুন।'
    }
  ];

  const steps = [
    {
      number: '১',
      title: 'সৃষ্টি করুন বা যোগ দিন',
      subtitle: 'Create or Join',
      description: 'আপনার এলাকায় নতুন দলগত অর্ডার শুরু করুন বা বিদ্যমান অর্ডারে যোগ দিন।'
    },
    {
      number: '২',
      title: 'সীমা অতিক্রম করুন',
      subtitle: 'Reach Threshold',
      description: 'পাইকারি দামের জন্য প্রয়োজনীয় ন্যূনতম পরিমাণে পৌঁছানোর জন্য একসাথে কাজ করুন।'
    },
    {
      number: '৩',
      title: 'অর্ডার করুন এবং অর্থ প্রদান করুন',
      subtitle: 'Order & Pay',
      description: 'সীমা পূরণ হলে অর্ডার লক হয়ে যায় এবং অর্থ প্রদান প্রক্রিয়া শুরু হয়।'
    },
    {
      number: '৪',
      title: 'সঞ্চয় উপভোগ করুন',
      subtitle: 'Enjoy Savings',
      description: 'সম্মত সময়ে আপনার খাবার তুলে নিন এবং আপনার সঞ্চয় উপভোগ করুন!'
    }
  ];

  const bangladeshStats = [
    { number: '১৭ কোটি+', label: 'জনসংখ্যা', english: 'Population' },
    { number: '৬৪ জেলা', label: 'জেলার সংখ্যা', english: 'Districts' },
    { number: '৮ টি বিভাগ', label: 'বিভাগের সংখ্যা', english: 'Divisions' },
    { number: '১,৪৭,৫৭০ বর্গ কিমি', label: 'আয়তন', english: 'Area' }
  ];

  const popularProducts = [
    { name: 'চাল (Rice)', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', price: '৳৬৫/কেজি' },
    { name: 'ডাল (Lentils)', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=400', price: '৳১২০/কেজি' },
    { name: 'আটা (Flour)', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', price: '৳৫৫/কেজি' },
    { name: 'চিনি (Sugar)', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400', price: '৳৭৫/কেজি' }
  ];

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-gray-50" ref={containerRef}>
      {/* Hero Section with Enhanced 3D Bangladesh Map */}
      <section className="hero-section relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        {/* Enhanced 3D Bangladesh Map Background */}
        <div className="hero-bg absolute inset-0">
          {/* 3D Map Container */}
          <div ref={mapRef} className="absolute inset-0 flex items-center justify-center">
            {/* Enhanced Bangladesh Map Outline */}
            <svg 
              className="w-full h-full opacity-20"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Enhanced Bangladesh map path with more detail */}
              <path
                d="M 50 150 Q 100 100 150 120 Q 200 80 250 100 Q 300 60 350 80 Q 380 120 350 150 Q 320 180 280 160 Q 240 140 200 160 Q 160 180 120 160 Q 80 140 50 150 Z"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                className="map-outline"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Major cities as animated dots */}
              <circle cx="100" cy="120" r="4" fill="rgba(255,255,255,0.7)" className="city-dot" />
              <circle cx="200" cy="160" r="4" fill="rgba(255,255,255,0.7)" className="city-dot" />
              <circle cx="300" cy="80" r="4" fill="rgba(255,255,255,0.7)" className="city-dot" />
              <circle cx="150" cy="200" r="4" fill="rgba(255,255,255,0.7)" className="city-dot" />
              
              {/* Additional map details */}
              <path
                d="M 120 140 Q 140 130 160 140"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <path
                d="M 220 120 Q 240 110 260 120"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Enhanced Animated Cart with Multiple Effects */}
            <div 
              ref={cartRef}
              className="absolute w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl"
              style={{ 
                transformOrigin: 'center',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
              }}
            >
              <ShoppingCart className="w-6 h-6 text-green-800" />
              
              {/* Cart glow effect */}
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-0 animate-ping"></div>
              
              {/* Cart trail effect */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Enhanced Floating Elements with Better Animation */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/20 rounded-full backdrop-blur-sm"
              animate={{ 
                y: [0, -30, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-16 h-16 bg-red-500/20 rounded-full backdrop-blur-sm"
              animate={{ 
                x: [0, 25, 0],
                scale: [1, 1.6, 1],
                rotate: [0, 90, 180]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* New floating elements for more dynamic feel */}
            <motion.div
              className="absolute top-1/2 right-1/3 w-20 h-20 bg-blue-400/15 rounded-full backdrop-blur-sm"
              animate={{ 
                y: [0, -20, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 9, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute bottom-1/3 left-1/2 w-28 h-28 bg-green-400/10 rounded-full backdrop-blur-sm"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.6, 0.2],
                rotate: [0, -180, -360]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Static GroShare Title (No More Rotation) */}
            <motion.h1 
              className="hero-title text-5xl md:text-7xl font-bold mb-6 text-shadow"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-yellow-400">গ্রো</span>শেয়ার
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              আপনার প্রতিবেশীদের সাথে মিলে পাইকারি দামে খাবার কিনুন। 
              <br className="hidden md:block" />
              <span className="text-yellow-300">একসাথে থাকি, একসাথে সঞ্চয় করি।</span>
            </motion.p>

            <motion.div 
              className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="bg-yellow-400 text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    নতুন অর্ডার তৈরি করুন
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="bg-yellow-400 text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
                    >
                      শুরু করুন
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-green-800 transition-colors"
                    >
                      সাইন ইন করুন
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Bangladesh Map Icon with Enhanced Animation */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.div 
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">বাংলাদেশের সব জেলায় সেবা</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Framer Motion */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              কেন গ্রোশেয়ার বেছে নেবেন?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              আমরা দলগত ক্রয়কে সহজ, সামাজিক এবং সঞ্চয়-কেন্দ্রিক করে তুলি
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:bg-green-200 transition-colors"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  {feature.subtitle}
                </p>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              কিভাবে কাজ করে
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              আপনার প্রতিবেশীদের সাথে অর্থ সঞ্চয় করার সহজ ধাপগুলি
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  {step.subtitle}
                </p>
                <p className="text-gray-600">
                  {step.description}
                </p>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-200 transform -translate-y-1/2 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              জনপ্রিয় পণ্যসমূহ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              বাংলাদেশের মানুষের প্রিয় খাবার পাইকারি দামে
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Order Image with Popular Badge */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    জনপ্রিয়
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {product.price}
                  </p>
                  <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
                    অর্ডার করুন
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bangladesh Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              বাংলাদেশের সাথে বেড়ে উঠছি
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              দেখুন আমাদের সম্প্রদায় কীভাবে পরিবর্তন আনছে
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {bangladeshStats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-400">
                  {stat.number}
                </div>
                <div className="text-green-100 font-medium">
                  {stat.label}
                </div>
                <div className="text-sm text-green-200">
                  {stat.english}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              অর্থ সঞ্চয় শুরু করার জন্য প্রস্তুত?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              হাজার হাজার প্রতিবেশীদের সাথে যোগ দিন যারা ইতিমধ্যে অর্থ সঞ্চয় করছে এবং সম্প্রদায় গড়ে তুলছে
            </p>
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  ড্যাশবোর্ডে যান
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  আজই শুরু করুন
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;