// Netflix Clone - محسن استيراد GitHub
// هذا السكريبت يحسن عملية الاستيراد من GitHub

const fs = require('fs');
const path = require('path');

class GitHubImportOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.optimizations = [];
  }

  // تحسين package.json للاستيراد السريع
  optimizePackageJson() {
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // إضافة engines للتحقق من إصدار Node
      pkg.engines = pkg.engines || {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      };
      
      // تحسين scripts
      pkg.scripts = {
        ...pkg.scripts,
        "postinstall": "echo 'Netflix Clone dependencies installed successfully'",
        "pre-commit": "npm run lint",
        "quick-start": "npm ci --prefer-offline && npm run dev"
      };

      // تجميد الإصدارات للاستقرار
      if (pkg.dependencies) {
        Object.keys(pkg.dependencies).forEach(dep => {
          if (pkg.dependencies[dep].startsWith('^') || pkg.dependencies[dep].startsWith('~')) {
            // إزالة ^ و ~ لتجميد الإصدارات
            pkg.dependencies[dep] = pkg.dependencies[dep].replace(/[\^~]/, '');
          }
        });
      }

      this.optimizations.push('✅ تم تحسين package.json');
      return pkg;
    }
    return null;
  }

  // إنشاء .nvmrc لتحديد إصدار Node.js
  createNvmrc() {
    const nvmrcPath = path.join(this.projectRoot, '.nvmrc');
    fs.writeFileSync(nvmrcPath, '18.17.0\n');
    this.optimizations.push('✅ تم إنشاء .nvmrc');
  }

  // تحسين .gitignore للاستيراد السريع
  optimizeGitignore() {
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    const optimizedGitignore = `
# Netflix Clone - Git Ignore المحسن
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
.next/
out/
build/
dist/

# Environment variables
.env*
!.env.example

# Cache directories
.cache/
cache/*.json
!cache/cache-config.json

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Replit files
.replit
replit.nix
.upm/
`;

    fs.writeFileSync(gitignorePath, optimizedGitignore.trim());
    this.optimizations.push('✅ تم تحسين .gitignore');
  }

  // إنشاء README محسن للاستيراد
  createOptimizedReadme() {
    const readmePath = path.join(this.projectRoot, 'README.md');
    const readme = `
# 🎬 Netflix Clone

## 🚀 الإعداد السريع

### طريقة 1: الاستيراد المحسن إلى Replit
\`\`\`bash
# 1. استورد المشروع من GitHub
# 2. انتظر التثبيت التلقائي
# 3. اضغط Run
\`\`\`

### طريقة 2: التطوير المحلي
\`\`\`bash
git clone --depth 1 [your-repo-url]
cd netflix-clone
npm run quick-start
\`\`\`

### طريقة 3: Docker (الأسرع)
\`\`\`bash
docker-compose up --build
\`\`\`

## ⚡ تحسينات الأداء المطبقة

- ✅ نظام تخزين مؤقت ذكي
- ✅ تحسين تثبيت الحزم
- ✅ ضغط الصور التلقائي
- ✅ تجميد إصدارات المكتبات
- ✅ إعدادات Git محسنة

## 🛠️ التقنيات المستخدمة

- Next.js 13 مع TypeScript
- Tailwind CSS للتصميم
- TMDB API للأفلام
- Firebase للمصادقة
- Framer Motion للحركات

## 🔧 حل مشاكل الأداء

إذا واجهت بطء في التثبيت:
1. استخدم \`npm run quick-start\`
2. فعّل yarn: \`npm install -g yarn\`
3. استخدم Docker للنشر
4. جرب GitHub Codespaces

## 📱 النشر

- **Vercel**: أسرع طريقة للنشر
- **Netlify**: بديل ممتاز
- **Replit**: للتطوير والاختبار
- **Docker**: للنشر على أي خادم

## 🎯 الميزات

- [x] تصفح الأفلام والمسلسلات
- [x] بحث متقدم
- [x] نظام تخزين مؤقت
- [x] تصميم متجاوب
- [ ] نظام المفضلة
- [ ] مشاهدة المقاطع الدعائية

## 📞 الدعم

للحصول على المساعدة:
1. تحقق من ملف \`performance-optimization.md\`
2. استخدم أدوات التحكم في الكاش
3. تابع logs في وحدة التحكم
`;

    fs.writeFileSync(readmePath, readme.trim());
    this.optimizations.push('✅ تم إنشاء README محسن');
  }

  // تشغيل جميع التحسينات
  optimize() {
    console.log('🚀 بدء تحسين Netflix Clone للاستيراد السريع...\n');
    
    try {
      this.createNvmrc();
      this.optimizeGitignore();
      this.createOptimizedReadme();
      
      console.log('\n📋 التحسينات المطبقة:');
      this.optimizations.forEach(opt => console.log(opt));
      
      console.log('\n✨ تم تحسين المشروع بنجاح!');
      console.log('💡 الآن يمكنك استيراد المشروع إلى Replit بسرعة أكبر');
      
    } catch (error) {
      console.error('❌ خطأ في التحسين:', error.message);
    }
  }
}

// تشغيل المحسن
if (require.main === module) {
  const optimizer = new GitHubImportOptimizer();
  optimizer.optimize();
}

module.exports = GitHubImportOptimizer;