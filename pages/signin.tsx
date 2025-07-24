import React from 'react';
import { motion } from 'framer-motion';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { HiStar, HiHeart, HiBookmark, HiUser, HiShieldCheck } from 'react-icons/hi2';
import { GetServerSideProps } from 'next';

const SignInPage: React.FC = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await signIn('google', { 
      callbackUrl: router.query.callbackUrl as string || '/' 
    });
  };

  const features = [
    {
      icon: HiHeart,
      title: 'حفظ المفضلة',
      description: 'احفظ الأفلام والمسلسلات المفضلة لديك'
    },
    {
      icon: HiBookmark,
      title: 'قوائم مخصصة',
      description: 'أنشئ قوائم مشاهدة مختلفة حسب ذوقك'
    },
    {
      icon: HiStar,
      title: 'توصيات ذكية',
      description: 'احصل على توصيات مبنية على تفضيلاتك'
    },
    {
      icon: HiShieldCheck,
      title: 'حفظ آمن',
      description: 'بياناتك محمية ومتزامنة عبر الأجهزة'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* قسم الشعار والترحيب */}
        <div className="text-center lg:text-right space-y-6">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex justify-center lg:justify-end"
          >
            <Image
              src="/yemen-flix-logo.png"
              alt="YEMEN_FLIX"
              width={300}
              height={80}
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              مرحباً بك في 
              <span className="text-red-500"> YEMEN_FLIX</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              أكبر منصة عربية للأفلام والمسلسلات
            </p>
          </motion.div>

          {/* المزايا */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
              >
                <feature.icon className="w-8 h-8 text-red-500 mb-2" />
                <h3 className="text-white font-semibold text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* قسم تسجيل الدخول */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                سجل دخولك الآن
              </h2>
              <p className="text-gray-300">
                استمتع بتجربة مشاهدة مخصصة وآمنة
              </p>
            </div>

            {/* زر تسجيل الدخول */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white 
                       py-4 px-6 rounded-xl font-bold text-lg
                       hover:from-red-700 hover:to-red-800 
                       transition-all duration-300 
                       flex items-center justify-center space-x-3 rtl:space-x-reverse
                       shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>تسجيل دخول مع Google</span>
            </motion.button>

            {/* تصفح كضيف */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">أو</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push('/')}
              className="w-full bg-gray-800/50 text-white border border-gray-600
                       py-3 px-6 rounded-xl font-semibold
                       hover:bg-gray-700/50 transition-all duration-200
                       flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <HiUser className="w-5 h-5" />
              <span>تصفح كضيف</span>
            </motion.button>

            <p className="text-gray-400 text-sm text-center">
              تسجيل الدخول مجاني 100% ولا يتطلب معلومات شخصية إضافية
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignInPage;