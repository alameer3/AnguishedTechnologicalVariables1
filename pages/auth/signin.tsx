import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        callbackUrl: process.env.NEXT_PUBLIC_AUTH_URL || "/",
        redirect: false,
      });
      
      if (result?.error) {
        setError("فشل في تسجيل الدخول عبر Google");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول");
      console.error("خطأ في تسجيل الدخول:", error);
    }
    setIsLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // يمكن إضافة منطق تسجيل الدخول بالبريد الإلكتروني هنا
    // حالياً سنوجه المستخدم لتسجيل الدخول عبر Google
    setError("حالياً متاح تسجيل الدخول عبر Google فقط");
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>تسجيل الدخول - نتفليكس</title>
        <meta name="description" content="سجل دخولك لحسابك في نتفليكس واستمتع بالمشاهدة" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-black flex flex-col">
        {/* شريط التنقل */}
        <div className="flex items-center justify-between p-4 lg:p-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/Netflix-Logo.wine.png"
              alt="Netflix Logo"
              width={120}
              height={40}
              className="w-32 lg:w-40"
            />
          </Link>
          
          <Link 
            href="/"
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Link>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* بطاقة تسجيل الدخول */}
            <div className="bg-black bg-opacity-90 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h1 className="text-white text-3xl font-bold mb-8 text-center">
                تسجيل الدخول
              </h1>

              {/* رسالة خطأ */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-600 text-white p-3 rounded mb-6 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* تسجيل الدخول عبر Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50 mb-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin ml-3" />
                ) : (
                  <FaGoogle className="w-5 h-5 ml-3 text-[#4285f4]" />
                )}
                {isLoading ? "جاري تسجيل الدخول..." : "المتابعة مع Google"}
              </button>

              {/* فاصل */}
              <div className="flex items-center mb-6">
                <div className="border-t border-gray-600 flex-1"></div>
                <span className="px-4 text-gray-400 text-sm">أو</span>
                <div className="border-t border-gray-600 flex-1"></div>
              </div>

              {/* نموذج البريد الإلكتروني */}
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full bg-gray-700 text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:bg-gray-600 transition-colors"
                    dir="rtl"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    className="w-full bg-gray-700 text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:bg-gray-600 transition-colors pr-12"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#e50914] hover:bg-[#cc0812] text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
                </button>
              </form>

              {/* روابط إضافية */}
              <div className="mt-8 text-center space-y-4">
                <Link 
                  href="/auth/forgot-password"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  نسيت كلمة المرور؟
                </Link>
                
                <div className="text-gray-400 text-sm">
                  جديد في نتفليكس؟{" "}
                  <Link 
                    href="/"
                    className="text-white hover:underline"
                  >
                    اشترك الآن
                  </Link>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 text-sm leading-relaxed">
                هذه الصفحة محمية بواسطة Google reCAPTCHA للتأكد من أنك لست روبوت.
                <br />
                <Link href="#" className="text-blue-400 hover:underline">
                  تعرف على المزيد
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* تذييل */}
        <div className="text-center p-4 text-gray-500 text-sm">
          <p>© 2025 Netflix Clone. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </>
  );
}

export default SignInPage;

// حماية الصفحة - إذا كان المستخدم مسجل الدخول بالفعل، وجهه للرئيسية
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}