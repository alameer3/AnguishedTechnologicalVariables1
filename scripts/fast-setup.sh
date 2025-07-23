#!/bin/bash

# Netflix Clone - سكريبت الإعداد السريع
echo "🚀 بدء الإعداد السريع لـ Netflix Clone..."

# 1. تنظيف الكاش القديم
echo "🧹 تنظيف الكاش القديم..."
rm -rf node_modules/.cache
rm -rf .next

# 2. إنشاء مجلد الكاش إذا لم يكن موجود
echo "📁 إنشاء مجلد التخزين المؤقت..."
mkdir -p cache

# 3. تثبيت المتطلبات بسرعة
echo "📦 تثبيت الحزم المطلوبة..."
if command -v yarn &> /dev/null; then
    echo "استخدام Yarn للتثبيت السريع..."
    yarn install --frozen-lockfile --prefer-offline
else
    echo "استخدام npm للتثبيت..."
    npm ci --prefer-offline --progress=false
fi

# 4. إنشاء ملفات البيئة
echo "⚙️ إعداد ملفات البيئة..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local 2>/dev/null || cat > .env.local << EOF
NEXTAUTH_URL=http://localhost:5000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_AUTH_URL=http://localhost:5000
EOF
fi

# 5. إعداد Git للاستيراد السريع
echo "🔧 إعداد Git..."
cat > .gitattributes << EOF
# Netflix Clone Git Attributes for faster cloning
*.js linguist-detectable=false
*.css linguist-detectable=false
*.html linguist-detectable=false
*.json linguist-detectable=false
cache/ export-ignore
node_modules/ export-ignore
.next/ export-ignore
EOF

# 6. إنشاء Dockerfile محسن
echo "🐳 إنشاء Dockerfile للنشر السريع..."
cat > Dockerfile << EOF
# Netflix Clone Dockerfile - محسن للأداء
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --prefer-offline

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 5000
ENV PORT 5000
CMD ["node", "server.js"]
EOF

# 7. إنشاء docker-compose للتطوير
echo "🔄 إنشاء Docker Compose..."
cat > docker-compose.yml << EOF
version: '3.8'
services:
  netflix-clone:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./cache:/app/cache
    restart: unless-stopped
EOF

echo "✅ تم الإعداد بنجاح!"
echo "📋 الخطوات التالية:"
echo "   1. قم بتشغيل: npm run dev"
echo "   2. افتح المتصفح على: http://localhost:5000"
echo "   3. للنشر السريع: docker-compose up"
echo ""
echo "💡 نصائح للأداء الأفضل:"
echo "   - استخدم yarn بدلاً من npm"
echo "   - فعّل nvm لإدارة إصدارات Node.js"
echo "   - استخدم Git LFS للملفات الكبيرة"