import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle, FaGlobe, FaChevronDown, FaPlay, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

type Props = {};

function SigninBanner({}: Props) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: process.env.NEXT_PUBLIC_AUTH_URL || "/",
      });
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
    }
    setIsLoading(false);
  };

  const handleEmailSignup = () => {
    if (email) {
      // يمكن إضافة منطق التسجيل بالبريد الإلكتروني هنا
      console.log("البريد الإلكتروني:", email);
    }
  };

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
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* زر اللغة */}
          <button className="flex items-center text-white border border-gray-400 rounded px-3 py-1 hover:border-white transition-colors">
            <FaGlobe className="w-4 h-4 mr-2" />
            <span className="text-sm">العربية</span>
            <FaChevronDown className="w-3 h-3 ml-2" />
          </button>
          
          {/* زر تسجيل الدخول */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center bg-[#e50914] hover:bg-[#cc0812] text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <FaGoogle className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
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
            أفلام ومسلسلات وأكثر
            <br />
            <span className="text-[#e50914]">بلا حدود</span>
          </h1>
          
          <h2 className="text-lg sm:text-xl lg:text-2xl font-medium mb-4">
            شاهد في أي مكان. ألغِ في أي وقت.
          </h2>
          
          <p className="text-base lg:text-lg font-normal mb-8 max-w-2xl mx-auto leading-relaxed">
            مستعد للمشاهدة؟ أدخل عنوان بريدك الإلكتروني لإنشاء عضويتك أو إعادة تفعيلها
          </p>

          {/* نموذج البريد الإلكتروني */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="عنوان البريد الإلكتروني"
              className="flex-1 h-14 px-4 text-black rounded-l-md sm:rounded-r-none sm:rounded-l-md rounded-md mb-4 sm:mb-0 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#e50914]"
              dir="rtl"
            />
            <button
              onClick={handleEmailSignup}
              className="flex items-center justify-center bg-[#e50914] hover:bg-[#cc0812] text-white px-6 py-4 rounded-r-md sm:rounded-l-none sm:rounded-r-md rounded-md font-semibold text-lg transition-colors w-full sm:w-auto"
            >
              ابدأ الآن
              <FaArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>

          {/* أو تسجيل الدخول عبر Google */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-400 flex-1 max-w-xs"></div>
              <span className="px-4 text-gray-300">أو</span>
              <div className="border-t border-gray-400 flex-1 max-w-xs"></div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition-colors disabled:opacity-50 mx-auto"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-3" />
              ) : (
                <FaGoogle className="w-5 h-5 mr-3 text-[#4285f4]" />
              )}
              {isLoading ? "جاري الاتصال..." : "المتابعة مع Google"}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* زر التشغيل المميز */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
      >
        <button className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-opacity-30 transition-all group">
          <FaPlay className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
          معاينة العروض
        </button>
      </motion.div>
    </div>
  );
}

export default SigninBanner;
