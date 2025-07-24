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
            <div className="relative w-32 h-8">
              <Image
                src="/Netflix-Logo.wine.png"
                alt="Netflix Clone Logo"
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
            <p className="text-sm text-gray-400">
              نسخة نتفليكس - تطبيق مبني بـ Next.js لتصفح الأفلام والمسلسلات
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/tv" className="hover:text-white transition-colors">
                  المسلسلات
                </a>
              </li>
              <li>
                <a href="/people" className="hover:text-white transition-colors">
                  الأشخاص
                </a>
              </li>
              <li>
                <a href="/favourite" className="hover:text-white transition-colors">
                  المفضلة
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
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
            <h3 className="font-semibold text-white mb-4">Legal</h3>
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