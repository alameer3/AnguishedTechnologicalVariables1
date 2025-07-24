import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative w-40 h-10 hover:scale-105 transition-transform duration-300">
              <Image
                src="/yemen-flix-logo.png"
                alt="YEMEN_FLIX Logo"
                fill
                className="object-contain brightness-125"
                sizes="160px"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              YEMEN_FLIX - منصة البث اليمنية المتطورة
              <br />
              مبنية بـ Next.js لتصفح الأفلام والمسلسلات
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg border-b border-red-500/30 pb-2">التنقل</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">🏠</span>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/tv" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">📺</span>
                  المسلسلات
                </a>
              </li>
              <li>
                <a href="/people" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">⭐</span>
                  المشاهير
                </a>
              </li>
              <li>
                <a href="/favourite" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">❤️</span>
                  المفضلة
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg border-b border-red-500/30 pb-2">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  حول التطبيق
                </a>
              </li>
              <li>
                <span className="text-gray-400">الدعم الفني</span>
              </li>
              <li>
                <span className="text-gray-400">الأسئلة الشائعة</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg border-b border-red-500/30 pb-2">قانوني</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">سياسة الخصوصية</span>
              </li>
              <li>
                <span className="text-gray-400">شروط الاستخدام</span>
              </li>
              <li>
                <span className="text-gray-400">ملفات تعريف الارتباط</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Netflix Clone. تطبيق تعليمي مبني بـ Next.js
            </p>
            <div className="flex space-x-6 text-sm">
              <span className="text-gray-400">المملكة العربية السعودية</span>
              <span className="text-gray-400">العربية</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;