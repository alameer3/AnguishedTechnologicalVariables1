# 🎬 نسخة نتفليكس - Netflix Clone

## 📖 الوصف

تطبيق حديث يحاكي منصة نتفليكس مبني بتقنيات الويب الحديثة، يوفر تجربة مشاهدة مماثلة للمنصة الأصلية مع إمكانية تصفح الأفلام والمسلسلات والبحث عن المحتوى والحصول على تفاصيل شاملة عن كل عمل فني.

## ✨ الميزات الرئيسية

- 🎥 **تصفح الأفلام والمسلسلات**: استعراض المحتوى من قاعدة بيانات TMDB
- 🔍 **بحث متقدم**: العثور على الأفلام والمسلسلات المفضلة
- 📱 **تصميم متجاوب**: يعمل بسلاسة على جميع الأجهزة  
- 🌙 **موضوع نتفليكس**: تصميم داكن مع الألوان المميزة
- ⚡ **أداء سريع**: تحميل فوري مع نظام التخزين المؤقت الذكي
- 🎭 **معلومات الممثلين**: تفاصيل شاملة عن فريق العمل
- 🎬 **المقاطع الدعائية**: مشاهدة المقاطع الدعائية للأفلام
- 📺 **تفاصيل المواسم**: معلومات عن الحلقات والمواسم

## 🚀 الإعداد السريع

### المتطلبات الأساسية
- Node.js 18.0.0 أو أحدث
- npm 8.0.0 أو أحدث (أو yarn)
- مفتاح TMDB API

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone [url-of-repo]
cd netflix-clone
```

2. **تثبيت التبعيات**
```bash
# باستخدام npm
npm install

# أو باستخدام yarn (أسرع)
yarn install

# للتثبيت السريع
npm run quick-start
```

3. **إعداد متغيرات البيئة**
```bash
# إنشاء ملف .env.local
cp .env.example .env.local

# إضافة مفتاح TMDB API
TMDB_API_KEY=your_api_key_here
```

4. **تشغيل التطبيق**
```bash
npm run dev
# أو
yarn dev
```

التطبيق سيعمل على: `http://localhost:5000`

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية
- **Next.js 13** - إطار React للتطبيقات عالية الأداء
- **TypeScript** - لغة برمجة قوية مع أنواع البيانات
- **Tailwind CSS** - إطار CSS للتصميم السريع
- **Framer Motion** - مكتبة الحركات والانتقالات

### قواعد البيانات والAPI
- **TMDB API** - المصدر الأساسي لبيانات الأفلام
- **Next.js API Routes** - واجهات برمجة التطبيقات المخصصة

### الأدوات والتحسينات
- **نظام تخزين مؤقت ذكي** - للأداء السريع أثناء التطوير
- **TypeScript** - فحص الأنواع وIntelliSense
- **ESLint** - فحص جودة الكود

## 📁 هيكل المشروع

```
netflix-clone/
├── components/          # مكونات React القابلة لإعادة الاستخدام
├── pages/              # صفحات Next.js ومسارات API
├── utils/              # أدوات مساعدة ووظائف API
├── cache/              # ملفات التخزين المؤقت
├── styles/             # ملفات CSS العامة
├── public/             # الملفات الثابتة والصور
└── scripts/            # سكريبتات تحسين الأداء
```

## 🎯 الميزات المتقدمة

### نظام التخزين المؤقت الذكي
- **وضع التطوير**: تخزين مؤقت لا محدود لتطوير أسرع
- **وضع الإنتاج**: تخزين مؤقت محسن للأداء
- **أدوات تحكم متقدمة**: إدارة الكاش بسهولة

### تحسينات الأداء
- **تحميل كسول للصور**: تحسين سرعة التحميل
- **تقسيم الكود**: تحميل الكود عند الحاجة فقط
- **ضغط تلقائي**: تقليل حجم الملفات
- **تحسين الصور**: تحويل تلقائي إلى WebP

## 🔧 أوامر مفيدة

```bash
# تشغيل بيئة التطوير
npm run dev

# بناء الإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص الكود
npm run lint

# تنظيف الكاش
npm run clean

# الإعداد السريع
npm run quick-start
```

## 🚀 النشر

### Vercel (الموصى به)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

### Netlify
```bash
# بناء المشروع
npm run build

# النشر عبر Netlify CLI أو السحب والإفلات
```

### Docker
```bash
# بناء الحاوية
docker build -t netflix-clone .

# تشغيل الحاوية
docker run -p 5000:5000 netflix-clone
```

## 🌟 إعدادات التطوير المتقدمة

### استخدام الكاش بكفاءة
- **للتطوير**: الكاش يعمل بلا حدود زمنية
- **للإنتاج**: كاش محسن لمدة 30 دقيقة
- **أدوات التحكم**: متاحة فقط في وضع التطوير

### تحسين الاستيراد من GitHub
```bash
# تشغيل محسن الاستيراد
node scripts/github-import-optimizer.js

# أو استخدام سكريبت الإعداد السريع
bash scripts/fast-setup.sh
```

## 🔐 المتغيرات المطلوبة

```env
# مطلوب
TMDB_API_KEY=your_tmdb_api_key

# اختياري (للمصادقة)
NEXTAUTH_URL=http://localhost:5000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📊 معلومات الأداء

- **وقت التحميل الأولي**: < 2 ثانية
- **حجم الحزمة**: محسن لأقل من 500KB
- **درجة Lighthouse**: 90+ في جميع المقاييس
- **دعم المتصفحات**: IE11+, Chrome, Firefox, Safari

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🔗 روابط مفيدة

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📞 الدعم والمساعدة

للحصول على المساعدة:
1. تحقق من [دليل تحسين الأداء](performance-optimization.md)
2. راجع [ملف التوثيق الشامل](replit.md)
3. استخدم أدوات التحكم المدمجة في التطبيق
4. تابع رسائل الأخطاء في وحدة التحكم

---

**تم تطويره بـ ❤️ للمجتمع العربي**