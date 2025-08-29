import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShoppingCart, Users, DollarSign, Truck, CheckCircle, Star, MapPin, Clock, Heart, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const cartRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const isInView = useInView(containerRef, { once: true });
  const [isGSAPLoaded, setIsGSAPLoaded] = useState(false);
  const [language, setLanguage] = useState('bangla'); // 'bangla' or 'english'

  // Language content
  const content = {
    bangla: {
      hero: {
        title: 'গ্রোশেয়ার',
        subtitle: 'আপনার প্রতিবেশীদের সাথে মিলে পাইকারি দামে খাবার কিনুন।',
        tagline: 'একসাথে থাকি, একসাথে সঞ্চয় করি।',
        serviceText: 'বাংলাদেশের সব জেলায় সেবা',
        startButton: 'শুরু করুন',
        loginButton: 'সাইন ইন করুন',
        dashboardButton: 'নতুন অর্ডার তৈরি করুন'
      },
      features: {
        title: 'কেন গ্রোশেয়ার বেছে নেবেন?',
        subtitle: 'আমরা দলগত ক্রয়কে সহজ, সামাজিক এবং সঞ্চয়-কেন্দ্রিক করে তুলি',
        groupBuying: {
          title: 'দলগত ক্রয়',
          subtitle: 'Group Buying',
          description: 'আপনার প্রতিবেশীদের সাথে মিলে পাইকারি দামে কেনাকাটা করুন।'
        },
        community: {
          title: 'সম্প্রদায় গঠন',
          subtitle: 'Build Community',
          description: 'প্রতিবেশীদের সাথে সম্পর্ক গড়ে তুলুন এবং স্থানীয় সম্প্রদায় শক্তিশালী করুন।'
        },
        savings: {
          title: 'টাকা সঞ্চয়',
          subtitle: 'Save Money',
          description: 'দলগত ক্রয়ের মাধ্যমে পাইকারি দামে খাবার কিনুন এবং অর্থ সঞ্চয় করুন।'
        },
        delivery: {
          title: 'সুবিধাজনক ডেলিভারি',
          subtitle: 'Convenient Delivery',
          description: 'সবাইয়ের জন্য উপযুক্ত সময়ে ডেলিভারি ব্যবস্থা করুন।'
        }
      },
      howItWorks: {
        title: 'কিভাবে কাজ করে',
        subtitle: 'আপনার প্রতিবেশীদের সাথে অর্থ সঞ্চয় করার সহজ ধাপগুলি',
        step1: {
          number: '১',
          title: 'সৃষ্টি করুন বা যোগ দিন',
          subtitle: 'Create or Join',
          description: 'আপনার এলাকায় নতুন দলগত অর্ডার শুরু করুন বা বিদ্যমান অর্ডারে যোগ দিন।'
        },
        step2: {
          number: '২',
          title: 'সীমা অতিক্রম করুন',
          subtitle: 'Reach Threshold',
          description: 'পাইকারি দামের জন্য প্রয়োজনীয় ন্যূনতম পরিমাণে পৌঁছানোর জন্য একসাথে কাজ করুন।'
        },
        step3: {
          number: '৩',
          title: 'অর্ডার করুন এবং অর্থ প্রদান করুন',
          subtitle: 'Order & Pay',
          description: 'সীমা পূরণ হলে অর্ডার লক হয়ে যায় এবং অর্থ প্রদান প্রক্রিয়া শুরু হয়।'
        },
        step4: {
          number: '৪',
          title: 'সঞ্চয় উপভোগ করুন',
          subtitle: 'Enjoy Savings',
          description: 'সম্মত সময়ে আপনার খাবার তুলে নিন এবং আপনার সঞ্চয় উপভোগ করুন!'
        }
      },
      products: {
        title: 'জনপ্রিয় পণ্যসমূহ',
        subtitle: 'বাংলাদেশের মানুষের প্রিয় খাবার পাইকারি দামে',
        orderButton: 'অর্ডার করুন'
      },
      aboutUs: {
        title: 'আমাদের সম্পর্কে',
        subtitle: 'Who We Are',
        paragraph1: 'গ্রোশেয়ার হল বাংলাদেশের প্রথম হাইপারলোকাল দলগত ক্রয় প্ল্যাটফর্ম যা প্রতিবেশীদের মধ্যে অর্থনৈতিক সহযোগিতা গড়ে তোলে। আমরা বিশ্বাস করি যে একসাথে কাজ করলে সবাই উপকৃত হয়।',
        paragraph2: 'আমাদের মিশন হল স্থানীয় সম্প্রদায়কে শক্তিশালী করা, অর্থ সঞ্চয় সহজ করা এবং টেকসই ভোক্তা আচরণ উৎসাহিত করা। প্রতিটি অর্ডারের মাধ্যমে আমরা নতুন বন্ধুত্ব তৈরি করি এবং আমাদের সম্প্রদায়কে আরও ঘনিষ্ঠ করি।',
        paragraph3: 'আমরা শুধু একটি অ্যাপ নই - আমরা একটি আন্দোলন। প্রতিদিন হাজার হাজার পরিবার আমাদের মাধ্যমে অর্থ সঞ্চয় করছে এবং তাদের প্রতিবেশীদের সাথে সম্পর্ক গড়ে তুলছে।',
        tagline: 'গ্রোশেয়ার – একসাথে এগিয়ে চলার নাম।'
      },
      cta: {
        title: 'অর্থ সঞ্চয় শুরু করার জন্য প্রস্তুত?',
        subtitle: 'হাজার হাজার প্রতিবেশীদের সাথে যোগ দিন যারা ইতিমধ্যে অর্থ সঞ্চয় করছে এবং সম্প্রদায় গড়ে তুলছে',
        dashboardButton: 'ড্যাশবোর্ডে যান',
        startButton: 'আজই শুরু করুন'
      }
    },
    english: {
      hero: {
        title: 'GroShare',
        subtitle: 'Pool grocery orders with neighbors to get wholesale prices.',
        tagline: 'Together we stay, together we save.',
        serviceText: 'Service available in all districts of Bangladesh',
        startButton: 'Get Started',
        loginButton: 'Sign In',
        dashboardButton: 'Create New Order'
      },
      features: {
        title: 'Why Choose GroShare?',
        subtitle: 'We make group buying simple, social, and savings-focused',
        groupBuying: {
          title: 'Group Buying',
          subtitle: 'Group Buying',
          description: 'Shop at wholesale prices with your neighbors.'
        },
        community: {
          title: 'Build Community',
          subtitle: 'Build Community',
          description: 'Build relationships with neighbors and strengthen local community.'
        },
        savings: {
          title: 'Save Money',
          subtitle: 'Save Money',
          description: 'Buy groceries at wholesale prices through group buying and save money.'
        },
        delivery: {
          title: 'Convenient Delivery',
          subtitle: 'Convenient Delivery',
          description: 'Arrange delivery at convenient times for everyone.'
        }
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Simple steps to save money with your neighbors',
        step1: {
          number: '1',
          title: 'Create or Join',
          subtitle: 'Create or Join',
          description: 'Start a new group order in your area or join existing orders.'
        },
        step2: {
          number: '2',
          title: 'Reach Threshold',
          subtitle: 'Reach Threshold',
          description: 'Work together to reach the minimum quantity needed for wholesale prices.'
        },
        step3: {
          number: '3',
          title: 'Order & Pay',
          subtitle: 'Order & Pay',
          description: 'Once threshold is met, order locks and payment process begins.'
        },
        step4: {
          number: '4',
          title: 'Enjoy Savings',
          subtitle: 'Enjoy Savings',
          description: 'Pick up your groceries at the agreed time and enjoy your savings!'
        }
      },
      products: {
        title: 'Popular Products',
        subtitle: 'Bangladesh\'s favorite foods at wholesale prices',
        orderButton: 'Order Now'
      },
      aboutUs: {
        title: 'About Us',
        subtitle: 'Who We Are',
        paragraph1: 'GroShare is Bangladesh\'s first hyperlocal group buying platform that creates economic cooperation among neighbors. We believe that when we work together, everyone benefits.',
        paragraph2: 'Our mission is to strengthen local communities, make saving money easier, and encourage sustainable consumer behavior. Through each order, we create new friendships and bring our communities closer.',
        paragraph3: 'We are not just an app - we are a movement. Every day, thousands of families are saving money and building relationships with their neighbors through our platform.',
        tagline: 'GroShare – The name of moving forward together.'
      },
      cta: {
        title: 'Ready to start saving money?',
        subtitle: 'Join thousands of neighbors who are already saving money and building community',
        dashboardButton: 'Go to Dashboard',
        startButton: 'Start Today'
      }
    }
  };

  const currentContent = content[language];

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

        // Cart shadow animation for depth (removed rotation)
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
      ...currentContent.features.groupBuying
    },
    {
      icon: <Users className="w-8 h-8" />,
      ...currentContent.features.community
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      ...currentContent.features.savings
    },
    {
      icon: <Truck className="w-8 h-8" />,
      ...currentContent.features.delivery
    }
  ];

  const steps = [
    {
      number: language === 'bangla' ? '১' : '1',
      ...currentContent.howItWorks.step1
    },
    {
      number: language === 'bangla' ? '২' : '2',
      ...currentContent.howItWorks.step2
    },
    {
      number: language === 'bangla' ? '৩' : '3',
      ...currentContent.howItWorks.step3
    },
    {
      number: language === 'bangla' ? '৪' : '4',
      ...currentContent.howItWorks.step4
    }
  ];

  const popularProducts = [
    { name: language === 'bangla' ? 'চাল (Rice)' : 'Rice (চাল)', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', price: language === 'bangla' ? '৳৬৫/কেজি' : '৳65/KG' },
    { name: language === 'bangla' ? 'ডাল (Lentils)' : 'Lentils (ডাল)', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=400', price: language === 'bangla' ? '৳১২০/কেজি' : '৳120/KG' },
    { name: language === 'bangla' ? 'আটা (Flour)' : 'Flour (আটা)', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', price: language === 'bangla' ? '৳৫৫/কেজি' : '৳55/KG' },
    { name: language === 'bangla' ? 'চিনি (Sugar)' : 'Sugar (চিনি)', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400', price: language === 'bangla' ? '৳৭৫/কেজি' : '৳75/KG' }
  ];

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-gray-50" ref={containerRef}>
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          onClick={() => setLanguage(language === 'bangla' ? 'english' : 'bangla')}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {language === 'bangla' ? 'EN' : 'বাং'}
          </span>
        </motion.button>
      </div>

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

            {/* Enhanced Animated Cart with Side Fading (No Rotation) */}
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
              
              {/* Cart trail effect with side fading */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Side fading effects */}
              <div className="absolute -left-1 top-1/2 w-2 h-8 bg-gradient-to-t from-transparent via-yellow-200 to-transparent opacity-40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute -right-1 top-1/2 w-2 h-8 bg-gradient-to-t from-transparent via-yellow-200 to-transparent opacity-40 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
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
            {/* Static GroShare Title */}
            <motion.h1 
              className="hero-title text-5xl md:text-7xl font-bold mb-6 text-shadow"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-yellow-400">{currentContent.hero.title.split('শেয়ার')[0]}</span>{currentContent.hero.title.includes('শেয়ার') ? 'শেয়ার' : 'Share'}
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {currentContent.hero.subtitle}
              <br className="hidden md:block" />
              <span className="text-yellow-300">{currentContent.hero.tagline}</span>
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
                    {currentContent.hero.dashboardButton}
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
                      {currentContent.hero.startButton}
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
                      {currentContent.hero.loginButton}
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Bangladesh Map Icon with Animated Jumping Location Icon */}
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
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span className="text-sm">{currentContent.hero.serviceText}</span>
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
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.features.subtitle}
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
              {currentContent.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.howItWorks.subtitle}
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
              {currentContent.products.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.products.subtitle}
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
                    {language === 'bangla' ? 'জনপ্রিয়' : 'Popular'}
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
                    {currentContent.products.orderButton}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern About Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentContent.aboutUs.title}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {currentContent.aboutUs.subtitle}
            </p>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentContent.aboutUs.paragraph1}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentContent.aboutUs.paragraph2}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentContent.aboutUs.paragraph3}
                </p>
              </div>
              
              {/* Tagline */}
              <motion.div 
                className="pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  {currentContent.aboutUs.tagline}
                </h3>
                <div className="flex items-center space-x-2 text-green-500">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === 'bangla' ? 'আমাদের সাথে যোগ দিন' : 'Join Us Today'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Visual Elements */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Main Image */}
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white text-center shadow-2xl">
                  <Users className="w-16 h-16 mx-auto mb-4 text-white" />
                  <h4 className="text-xl font-bold mb-2">
                    {language === 'bangla' ? 'সম্প্রদায় শক্তি' : 'Community Power'}
                  </h4>
                  <p className="text-green-100">
                    {language === 'bangla' ? 'একসাথে আমরা শক্তিশালী' : 'Together We Are Stronger'}
                  </p>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <DollarSign className="w-10 h-10 text-green-800" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 -right-8 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
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
              {currentContent.cta.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {currentContent.cta.subtitle}
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
                  {currentContent.cta.dashboardButton}
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
                  {currentContent.cta.startButton}
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