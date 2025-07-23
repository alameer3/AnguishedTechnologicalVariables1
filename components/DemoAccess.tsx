import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";

type Props = {
  onDemoAccess: () => void;
};

function DemoAccess({ onDemoAccess }: Props) {
  return (
    <div className="relative h-screen bg-cover bg-center bg-no-repeat" 
         style={{
           backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/84526d58-475e-4e6f-9c81-d2d78ddce803/e3b08071-f218-4dab-99a2-80315f0922cd/LK-en-20221228-popsignuptwoweeks-perspective_alpha_website_small.jpg')"
         }}>
      
      {/* طبقة الخلفية المظلمة */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />
      
      {/* شريط التنقل العلوي */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-12 pt-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/Netflix-Logo.wine.png"
            alt="Netflix Logo"
            width={120}
            height={40}
            className="w-24 sm:w-32 lg:w-40"
            priority
          />
        </motion.div>
        
        <motion.div 
          className="text-white text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          وضع العرض التوضيحي
        </motion.div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            مرحباً بك في
            <br />
            <span className="text-[#e50914]">نتفليكس كلون</span>
          </h1>
          
          <h2 className="text-lg sm:text-xl lg:text-2xl font-medium mb-4">
            استكشف آلاف الأفلام والمسلسلات
          </h2>
          
          <p className="text-base lg:text-lg font-normal mb-8 max-w-2xl mx-auto leading-relaxed">
            يمكنك حالياً تصفح المحتوى في وضع العرض التوضيحي. 
            <br />
            لتفعيل المصادقة الكاملة، أضف مفاتيح Google OAuth
          </p>

          {/* أزرار الوصول */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              onClick={onDemoAccess}
              className="flex items-center justify-center bg-[#e50914] hover:bg-[#cc0812] text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors w-full sm:w-auto"
            >
              <FaPlay className="w-5 h-5 ml-3" />
              دخول للعرض التوضيحي
            </button>
            
            <button
              onClick={() => window.open('https://console.developers.google.com/', '_blank')}
              className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 px-8 py-4 rounded-md font-semibold text-lg transition-colors w-full sm:w-auto"
            >
              <FaInfoCircle className="w-5 h-5 ml-3" />
              إعداد المصادقة
            </button>
          </motion.div>

          {/* معلومات إضافية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-sm text-gray-300 max-w-xl mx-auto"
          >
            <p className="mb-2">
              <strong>للمطورين:</strong> لتفعيل المصادقة الكاملة:
            </p>
            <ul className="text-left space-y-1">
              <li>• أضف GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET</li>
              <li>• أضف NEXTAUTH_SECRET</li>
              <li>• اختياري: مفاتيح Firebase للميزات المتقدمة</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* تحذير الوضع التوضيحي */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-90 text-white px-4 py-2 rounded-md text-sm"
      >
        ⚠️ وضع العرض التوضيحي - بعض الميزات غير متاحة
      </motion.div>
    </div>
  );
}

export default DemoAccess;