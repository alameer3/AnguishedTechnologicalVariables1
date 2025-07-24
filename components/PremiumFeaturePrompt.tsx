import React from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useAuth } from './AuthProvider';
import { 
  HiStar, 
  HiHeart, 
  HiBookmark, 
  HiUser,
  HiLockClosed 
} from 'react-icons/hi2';

interface PremiumFeaturePromptProps {
  feature: 'favorites' | 'lists' | 'recommendations';
  children?: React.ReactNode;
}

const PremiumFeaturePrompt: React.FC<PremiumFeaturePromptProps> = ({ 
  feature, 
  children 
}) => {
  const { isGuest } = useAuth();

  const featureConfig = {
    favorites: {
      icon: HiHeart,
      title: 'حفظ في المفضلة',
      description: 'احفظ الأفلام والمسلسلات المفضلة لديك للوصول إليها بسهولة',
      color: 'red'
    },
    lists: {
      icon: HiBookmark,
      title: 'إنشاء قوائم مخصصة',
      description: 'أنشئ قوائم مشاهدة مخصصة ونظم محتواك المفضل',
      color: 'blue'
    },
    recommendations: {
      icon: HiStar,
      title: 'توصيات ذكية',
      description: 'احصل على توصيات شخصية مبنية على تفضيلاتك',
      color: 'yellow'
    }
  };

  const config = featureConfig[feature];
  const Icon = config.icon;

  if (!isGuest) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      {/* المحتوى الأصلي مع overlay */}
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        
        {/* Overlay للترويج لتسجيل الدخول */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                       flex items-center justify-center rounded-lg">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-gray-900/90 rounded-xl border border-gray-700 
                      backdrop-blur-sm max-w-sm"
          >
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full bg-${config.color}-600/20 border border-${config.color}-500/30`}>
                <Icon className={`w-8 h-8 text-${config.color}-400`} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {config.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {config.description}
            </p>

            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse 
                           text-yellow-400 text-sm mb-4">
              <HiLockClosed className="w-4 h-4" />
              <span>ميزة حصرية للأعضاء</span>
            </div>

            <button
              onClick={() => signIn('google')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white 
                       py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 
                       transition-all duration-200 flex items-center justify-center 
                       space-x-2 rtl:space-x-reverse group"
            >
              <HiUser className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>سجل دخولك الآن</span>
            </button>

            <p className="text-gray-400 text-xs mt-3">
              مجاني 100% • لا توجد رسوم
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumFeaturePrompt;