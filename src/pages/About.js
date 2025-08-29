import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.img
            src={process.env.REACT_APP_LOGO_URL || 'https://res.cloudinary.com/dbi2rwlso/image/upload/v1756474306/532F6958-41F8-42A3-A67D-41F57A313D45_u81tke.png'}
            alt="GroShare Logo"
            className="mx-auto mb-4 w-16 h-16 object-contain drop-shadow"
            initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.1 }}
            whileHover={{ rotate: 6, scale: 1.06 }}
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            About GroShare
          </h1>
          <p className="mt-3 text-lg text-gray-600">Hyperlocal group-buy for Bangladesh</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            <p className="text-lg leading-8 text-gray-700">
              GroShare is Bangladesh's hyperlocal group-buy platform. We help neighbors unite to buy essentials at wholesale prices, strengthen community bonds, and reduce costs.
            </p>
            <p className="text-lg leading-8 text-gray-700">
              আমাদের লক্ষ্য সহজ—একসাথে কেনাকাটা, একসাথে সঞ্চয়। নিরাপদ, স্বচ্ছ এবং কমিউনিটি-ফার্স্ট অভিজ্ঞতা।
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Community-first • Trust • Savings</span>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Neighbors helping neighbors</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={process.env.REACT_APP_BANNER_IMAGE || 'https://res.cloudinary.com/dbi2rwlso/image/upload/v1756474306/IMG_9110_dgb84e.jpg'}
                alt="GroShare community"
                className="w-full h-72 object-cover"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-green-700/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 text-green-700 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>একসাথে এগিয়ে চলার নাম — GroShare</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Community-Driven', desc: 'Built around trusted neighborhood groups and organizers.' },
            { title: 'Transparent Savings', desc: 'Clear pricing, thresholds, and real-time progress for everyone.' },
            { title: 'Made for Bangladesh', desc: 'Bangla-first experience with local needs in mind.' }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow p-6 border border-green-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="/register"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
          >
            Join GroShare Today <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;