import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiStar, HiHeart, HiBookmark } from 'react-icons/hi2';

const GuestModeNotice: React.FC = () => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);

  // إخفاء الإشعار إذا كان المستخدم مسجل دخول
  if (session || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-0 right-0 z-40 mx-4"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-xl border border-red-500/30 backdrop-blur-sm">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex -space-x-2">
                <HiUser className="w-8 h-8 text-yellow-400 bg-red-800 rounded-full p-1" />
                <HiStar className="w-8 h-8 text-yellow-400 bg-red-800 rounded-full p-1" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">
                  مرحباً بك في وضع الضيف! 🎬
                </h3>
                <p className="text-red-200 text-sm">
                  سجل دخولك للاستمتاع بمزايا إضافية: حفظ المفضلة، قوائم مخصصة، وتوصيات ذكية
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => signIn('google')}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold 
                         hover:bg-red-50 transition-colors duration-200 
                         flex items-center space-x-2 rtl:space-x-reverse"
              >
                <HiUser className="w-5 h-5" />
                <span>تسجيل دخول</span>
              </button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="text-red-200 hover:text-white transition-colors duration-200 
                         bg-red-800/50 rounded-full p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* مزايا تسجيل الدخول */}
          <div className="border-t border-red-500/30 px-4 py-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <HiHeart className="w-6 h-6 text-yellow-400" />
                <span className="text-red-200 text-xs">حفظ المفضلة</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <HiBookmark className="w-6 h-6 text-yellow-400" />
                <span className="text-red-200 text-xs">قوائم مخصصة</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <HiStar className="w-6 h-6 text-yellow-400" />
                <span className="text-red-200 text-xs">توصيات ذكية</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuestModeNotice;