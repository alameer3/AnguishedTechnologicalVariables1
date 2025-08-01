#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة تحليل وأخذ لقطات شاشة شاملة للمواقع
Enhanced Website Screenshot and Analysis Tool
مطور خصيصاً لبيئة Replit مع دعم كامل للقطات الشاشة PNG
"""

import nest_asyncio
nest_asyncio.apply()

import asyncio
import aiofiles
import json
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin, urlparse, unquote
from fake_useragent import UserAgent
import mimetypes
import xml.etree.ElementTree as ET
import requests
from PIL import Image
import time
import logging
import re

# إعداد نظام تسجيل الأخطاء
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('screenshot_log.txt', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class EnhancedWebsiteScreenshotTool:
    def __init__(self, base_url="https://ak.sv/", output_dir="site_analysis_complete"):
        """
        أداة تحليل وأخذ لقطات شاشة شاملة
        """
        self.base_url = base_url
        self.output_root = output_dir
        self.screenshots_root = os.path.join(output_dir, "screenshots")
        self.max_depth = 3
        self.max_pages = 30
        self.screenshot_delay = 2
        self.viewport_width = 1920
        self.viewport_height = 1080
        self.timeout = 30000
        
        # إحصائيات
        self.stats = {
            'total_pages': 0,
            'successful_screenshots': 0,
            'failed_screenshots': 0,
            'start_time': None,
            'end_time': None,
            'total_assets': 0,
            'successful_assets': 0
        }
        
        self.ua = UserAgent()
        self.visited = set()
        self.sitemap_urls = []
        self.failed_urls = []
        
        # إنشاء المجلدات
        self._create_directories()
        
    def _create_directories(self):
        """إنشاء المجلدات المطلوبة"""
        directories = [
            self.output_root,
            self.screenshots_root,
            os.path.join(self.output_root, "html_pages"),
            os.path.join(self.output_root, "assets"),
            os.path.join(self.output_root, "metadata"),
            os.path.join(self.output_root, "reports")
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
            
    def sanitize_filename(self, text, max_length=100):
        """تنظيف النص لاستخدامه كاسم ملف آمن"""
        if not text:
            return "unknown"
        
        # إزالة الأحرف الخاصة
        safe_name = re.sub(r'[^\w\-_.]', '_', text)
        safe_name = re.sub(r'_+', '_', safe_name).strip('_')
        
        # تحديد الطول
        if len(safe_name) > max_length:
            safe_name = safe_name[:max_length]
            
        return safe_name or "unknown"
    
    def get_page_identifier(self, url):
        """الحصول على معرف فريد للصفحة"""
        try:
            parsed = urlparse(url)
            path = parsed.path.strip("/") or "home"
            query = parsed.query
            
            identifier = self.sanitize_filename(path)
            if query:
                query_safe = self.sanitize_filename(query)
                identifier += f"_q_{query_safe}"
                
            return identifier
        except Exception as e:
            logger.error(f"خطأ في إنشاء معرف الصفحة {url}: {e}")
            return f"page_{len(self.visited)}"
    
    async def save_html_content(self, content, page_id, url):
        """حفظ محتوى HTML"""
        try:
            html_dir = os.path.join(self.output_root, "html_pages", page_id)
            os.makedirs(html_dir, exist_ok=True)
            
            html_file = os.path.join(html_dir, "index.html")
            async with aiofiles.open(html_file, 'w', encoding='utf-8') as f:
                await f.write(content)
                
            # حفظ معلومات إضافية
            info_file = os.path.join(html_dir, "page_info.json")
            page_info = {
                'url': url,
                'page_id': page_id,
                'timestamp': datetime.now().isoformat(),
                'content_length': len(content)
            }
            
            async with aiofiles.open(info_file, 'w', encoding='utf-8') as f:
                await f.write(json.dumps(page_info, ensure_ascii=False, indent=2))
                
            return html_dir
        except Exception as e:
            logger.error(f"خطأ في حفظ HTML لـ {url}: {e}")
            return None
    
    async def take_enhanced_screenshot(self, page, page_id, url):
        """أخذ لقطة شاشة محسنة بصيغة PNG"""
        try:
            # إنشاء مجلد لقطات الشاشة للصفحة
            screenshot_dir = os.path.join(self.screenshots_root, page_id)
            os.makedirs(screenshot_dir, exist_ok=True)
            
            # انتظار تحميل الصفحة بالكامل
            await asyncio.sleep(self.screenshot_delay)
            
            # لقطة شاشة كاملة
            full_screenshot_path = os.path.join(screenshot_dir, "full_page.png")
            await page.screenshot(
                path=full_screenshot_path, 
                full_page=True,
                type='png'
            )
            
            # لقطة شاشة للجزء المرئي فقط
            viewport_screenshot_path = os.path.join(screenshot_dir, "viewport.png")
            await page.screenshot(
                path=viewport_screenshot_path,
                full_page=False,
                type='png'
            )
            
            # تحسين جودة الصور باستخدام PIL
            await self._optimize_screenshots(screenshot_dir)
            
            # إنشاء thumbnail صغير
            await self._create_thumbnail(full_screenshot_path, screenshot_dir)
            
            self.stats['successful_screenshots'] += 1
            logger.info(f"✅ تم أخذ لقطات شاشة لـ {url}")
            
            return screenshot_dir
            
        except Exception as e:
            logger.error(f"❌ فشل في أخذ لقطة شاشة لـ {url}: {e}")
            self.stats['failed_screenshots'] += 1
            self.failed_urls.append({'url': url, 'error': str(e), 'type': 'screenshot'})
            return None
    
    async def _optimize_screenshots(self, screenshot_dir):
        """تحسين جودة لقطات الشاشة"""
        try:
            for filename in ['full_page.png', 'viewport.png']:
                filepath = os.path.join(screenshot_dir, filename)
                if os.path.exists(filepath):
                    # فتح الصورة وتحسينها
                    with Image.open(filepath) as img:
                        # تحويل إلى RGB إذا لزم الأمر
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        
                        # حفظ بجودة محسنة
                        optimized_path = os.path.join(screenshot_dir, f"optimized_{filename}")
                        img.save(optimized_path, 'PNG', optimize=True)
                        
        except Exception as e:
            logger.error(f"خطأ في تحسين لقطات الشاشة: {e}")
    
    async def _create_thumbnail(self, original_path, screenshot_dir):
        """إنشاء thumbnail صغير"""
        try:
            if os.path.exists(original_path):
                with Image.open(original_path) as img:
                    # إنشاء thumbnail بحجم 300x200
                    img.thumbnail((300, 200), Image.Resampling.LANCZOS)
                    thumbnail_path = os.path.join(screenshot_dir, "thumbnail.png")
                    img.save(thumbnail_path, 'PNG')
                    
        except Exception as e:
            logger.error(f"خطأ في إنشاء thumbnail: {e}")
    
    async def extract_page_metadata(self, content, url, page_id):
        """استخراج البيانات الوصفية للصفحة"""
        try:
            soup = BeautifulSoup(content, 'html.parser')
            
            metadata = {
                'url': url,
                'page_id': page_id,
                'timestamp': datetime.now().isoformat(),
                'title': soup.title.string if soup.title else "بدون عنوان",
                'meta_description': '',
                'meta_keywords': '',
                'h1_tags': [],
                'h2_tags': [],
                'images': [],
                'links': [],
                'forms': [],
                'scripts': [],
                'stylesheets': []
            }
            
            # استخراج meta tags
            for meta in soup.find_all('meta'):
                if meta.get('name') == 'description':
                    metadata['meta_description'] = meta.get('content', '')
                elif meta.get('name') == 'keywords':
                    metadata['meta_keywords'] = meta.get('content', '')
            
            # استخراج العناوين
            metadata['h1_tags'] = [h1.get_text(strip=True) for h1 in soup.find_all('h1')]
            metadata['h2_tags'] = [h2.get_text(strip=True) for h2 in soup.find_all('h2')]
            
            # استخراج الصور
            for img in soup.find_all('img'):
                img_info = {
                    'src': img.get('src', ''),
                    'alt': img.get('alt', ''),
                    'title': img.get('title', '')
                }
                metadata['images'].append(img_info)
            
            # استخراج الروابط
            for link in soup.find_all('a', href=True):
                href = link.get('href')
                if href:
                    link_info = {
                        'href': href,
                        'text': link.get_text(strip=True),
                        'title': link.get('title', '')
                    }
                    metadata['links'].append(link_info)
            
            # حفظ البيانات الوصفية
            metadata_dir = os.path.join(self.output_root, "metadata")
            metadata_file = os.path.join(metadata_dir, f"{page_id}_metadata.json")
            
            async with aiofiles.open(metadata_file, 'w', encoding='utf-8') as f:
                await f.write(json.dumps(metadata, ensure_ascii=False, indent=2))
            
            return metadata
            
        except Exception as e:
            logger.error(f"خطأ في استخراج البيانات الوصفية لـ {url}: {e}")
            return None
    
    async def crawl_and_screenshot(self, page, url, depth=0):
        """الزحف وأخذ لقطات شاشة"""
        if depth > self.max_depth or url in self.visited or len(self.visited) >= self.max_pages:
            return
        
        self.visited.add(url)
        self.stats['total_pages'] += 1
        
        try:
            logger.info(f"🔍 زحف إلى: {url} (العمق: {depth})")
            
            # الانتقال إلى الصفحة
            response = await page.goto(url, wait_until="networkidle", timeout=self.timeout)
            if not response:
                raise Exception("فشل في تحميل الصفحة")
            
            # الحصول على محتوى الصفحة
            content = await page.content()
            
            # إنشاء معرف للصفحة
            page_id = self.get_page_identifier(url)
            
            # حفظ HTML
            await self.save_html_content(content, page_id, url)
            
            # أخذ لقطات شاشة
            await self.take_enhanced_screenshot(page, page_id, url)
            
            # استخراج البيانات الوصفية
            await self.extract_page_metadata(content, url, page_id)
            
            # إضافة إلى sitemap
            self.sitemap_urls.append(url)
            
            # البحث عن روابط أخرى للزحف إليها
            if depth < self.max_depth:
                soup = BeautifulSoup(content, 'html.parser')
                links = []
                
                for a in soup.find_all('a', href=True):
                    href = a.get('href')
                    if href:
                        next_url = urljoin(self.base_url, href)
                        parsed_next = urlparse(next_url)
                        parsed_base = urlparse(self.base_url)
                        
                        # فقط الروابط من نفس النطاق
                        if parsed_next.netloc == parsed_base.netloc:
                            links.append(next_url)
                
                # زحف للروابط الفرعية
                for link in links[:5]:  # حد أقصى 5 روابط لكل صفحة
                    await self.crawl_and_screenshot(page, link, depth + 1)
            
            logger.info(f"✅ تم الانتهاء من معالجة: {url}")
            
        except PlaywrightTimeoutError:
            logger.error(f"⏰ انتهت مهلة تحميل الصفحة: {url}")
            self.failed_urls.append({'url': url, 'error': 'timeout', 'type': 'page_load'})
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة {url}: {e}")
            self.failed_urls.append({'url': url, 'error': str(e), 'type': 'general'})
    
    async def generate_sitemap(self):
        """إنشاء خريطة الموقع"""
        try:
            sitemap_path = os.path.join(self.output_root, "sitemap.xml")
            
            urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
            
            for url in self.sitemap_urls:
                url_element = ET.SubElement(urlset, "url")
                loc = ET.SubElement(url_element, "loc")
                loc.text = url
                
                lastmod = ET.SubElement(url_element, "lastmod")
                lastmod.text = datetime.now().strftime('%Y-%m-%d')
            
            tree = ET.ElementTree(urlset)
            tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)
            
            logger.info(f"📄 تم إنشاء خريطة الموقع: {sitemap_path}")
            
        except Exception as e:
            logger.error(f"خطأ في إنشاء خريطة الموقع: {e}")
    
    async def generate_final_report(self):
        """إنشاء تقرير نهائي شامل"""
        try:
            self.stats['end_time'] = datetime.now()
            if self.stats['start_time']:
                duration = self.stats['end_time'] - self.stats['start_time']
                self.stats['duration_seconds'] = duration.total_seconds()
            
            report = {
                'تقرير_التحليل': {
                    'الموقع_المستهدف': self.base_url,
                    'وقت_البدء': self.stats['start_time'].isoformat() if self.stats['start_time'] else None,
                    'وقت_الانتهاء': self.stats['end_time'].isoformat(),
                    'مدة_التحليل_بالثواني': self.stats.get('duration_seconds', 0),
                    'إجمالي_الصفحات': self.stats['total_pages'],
                    'لقطات_شاشة_ناجحة': self.stats['successful_screenshots'],
                    'لقطات_شاشة_فاشلة': self.stats['failed_screenshots'],
                    'الروابط_الفاشلة': len(self.failed_urls),
                    'إجمالي_روابط_sitemap': len(self.sitemap_urls)
                },
                'الملفات_المُنشأة': {
                    'مجلد_لقطات_الشاشة': self.screenshots_root,
                    'مجلد_HTML': os.path.join(self.output_root, "html_pages"),
                    'مجلد_البيانات_الوصفية': os.path.join(self.output_root, "metadata"),
                    'خريطة_الموقع': os.path.join(self.output_root, "sitemap.xml")
                },
                'الأخطاء_والمشاكل': self.failed_urls,
                'إحصائيات_مفصلة': {
                    'معدل_نجاح_لقطات_الشاشة': f"{(self.stats['successful_screenshots'] / max(self.stats['total_pages'], 1)) * 100:.2f}%",
                }
            }
            
            report_path = os.path.join(self.output_root, "reports", "final_report.json")
            async with aiofiles.open(report_path, 'w', encoding='utf-8') as f:
                await f.write(json.dumps(report, ensure_ascii=False, indent=2))
            
            # تقرير نصي مبسط
            text_report_path = os.path.join(self.output_root, "reports", "summary_report.txt")
            async with aiofiles.open(text_report_path, 'w', encoding='utf-8') as f:
                await f.write(f"""
تقرير تحليل الموقع النهائي
============================

الموقع المستهدف: {self.base_url}
وقت التحليل: {self.stats['end_time'].strftime('%Y-%m-%d %H:%M:%S')}
مدة التحليل: {self.stats.get('duration_seconds', 0):.2f} ثانية

الإحصائيات:
- إجمالي الصفحات المعالجة: {self.stats['total_pages']}
- لقطات شاشة ناجحة: {self.stats['successful_screenshots']}
- لقطات شاشة فاشلة: {self.stats['failed_screenshots']}
- الروابط في خريطة الموقع: {len(self.sitemap_urls)}

الملفات المُنشأة:
- لقطات الشاشة: {self.screenshots_root}
- ملفات HTML: {os.path.join(self.output_root, "html_pages")}
- البيانات الوصفية: {os.path.join(self.output_root, "metadata")}
- خريطة الموقع: {os.path.join(self.output_root, "sitemap.xml")}

معدل النجاح: {(self.stats['successful_screenshots'] / max(self.stats['total_pages'], 1)) * 100:.2f}%
""")
            
            logger.info(f"📊 تم إنشاء التقرير النهائي: {report_path}")
            
        except Exception as e:
            logger.error(f"خطأ في إنشاء التقرير النهائي: {e}")
    
    async def run_analysis(self):
        """تشغيل التحليل الكامل"""
        self.stats['start_time'] = datetime.now()
        logger.info(f"🚀 بدء تحليل الموقع: {self.base_url}")
        
        try:
            async with async_playwright() as playwright:
                # إطلاق المتصفح
                browser = await playwright.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-dev-shm-usage']
                )
                
                # إنشاء صفحة جديدة
                page = await browser.new_page()
                
                # تعيين حجم العرض
                await page.set_viewport_size({
                    'width': self.viewport_width, 
                    'height': self.viewport_height
                })
                
                # بدء الزحف
                await self.crawl_and_screenshot(page, self.base_url)
                
                # إغلاق المتصفح
                await browser.close()
                
            # إنشاء خريطة الموقع
            await self.generate_sitemap()
            
            # إنشاء التقرير النهائي
            await self.generate_final_report()
            
            logger.info("✅ تم الانتهاء من التحليل بنجاح!")
            logger.info(f"📁 النتائج محفوظة في: {self.output_root}")
            
        except Exception as e:
            logger.error(f"❌ خطأ عام في التحليل: {e}")
            raise

# دالة للتشغيل المباشر
async def main():
    """الدالة الرئيسية للتشغيل"""
    # يمكن تخصيص الرابط هنا
    base_url = input("أدخل رابط الموقع المراد تحليله (اضغط Enter للافتراضي https://ak.sv/): ").strip()
    if not base_url:
        base_url = "https://ak.sv/"
    
    # إنشاء أداة التحليل
    tool = EnhancedWebsiteScreenshotTool(base_url=base_url)
    
    # تشغيل التحليل
    await tool.run_analysis()

if __name__ == "__main__":
    # تشغيل الأداة
    asyncio.run(main())