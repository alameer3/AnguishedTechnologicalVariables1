#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة تحليل وأخذ لقطات شاشة شاملة للمواقع
Enhanced Website Screenshot and Analysis Tool
مطور خصيصاً لبيئة Replit مع دعم كامل للقطات الشاشة PNG
يقرأ الروابط من ملف روابط_AKWAM_ترتيب_هرمي_شامل.txt
"""

import nest_asyncio
nest_asyncio.apply()

import asyncio
import aiofiles
import json
import re
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

# =====================================================
# 1. إعداد نظام تسجيل الأخطاء والتكوين الأساسي
# =====================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('screenshot_log.txt', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ScreenshotConfig:
    """فئة إعدادات الأداة الشاملة"""
    def __init__(self):
        # إعدادات أساسية
        self.base_url = "https://ak.sv/"
        self.output_root = "site_analysis_complete"
        self.screenshots_root = "screenshots"
        self.links_file = "روابط_AKWAM_ترتيب_هرمي_شامل.txt"
        
        # إعدادات التحليل
        self.max_depth = 3
        self.max_pages = 200
        self.max_links_per_batch = 50
        self.screenshot_delay = 2
        self.timeout = 30000
        
        # إعدادات لقطة الشاشة
        self.viewport_width = 1920
        self.viewport_height = 1080
        self.screenshot_quality = 90
        self.full_page_screenshot = True
        self.screenshot_format = 'png'
        
        # إعدادات الأداء
        self.concurrent_requests = 3
        self.retry_attempts = 3
        self.delay_between_requests = 1
        
        # إعدادات المحتوى
        self.save_html = True
        self.save_assets = True
        self.analyze_cms = True
        self.check_broken_links = True
        self.generate_sitemap = True

# =====================================================
# 2. المتغيرات العامة وإنشاء المجلدات
# =====================================================

config = ScreenshotConfig()
ua = UserAgent()
visited = set()
sitemap_urls = []
failed_urls = []
processed_links = []

screenshot_stats = {
    'total_screenshots': 0,
    'successful_screenshots': 0,
    'failed_screenshots': 0,
    'total_pages_processed': 0,
    'total_assets_downloaded': 0,
    'start_time': None,
    'end_time': None,
    'duration_seconds': 0,
    'links_from_file': 0,
    'links_discovered': 0
}

def create_directory_structure():
    """إنشاء هيكل المجلدات المطلوب"""
    directories = [
        config.output_root,
        config.screenshots_root,
        os.path.join(config.output_root, "html_pages"),
        os.path.join(config.output_root, "assets", "images"),
        os.path.join(config.output_root, "assets", "css"),
        os.path.join(config.output_root, "assets", "js"),
        os.path.join(config.output_root, "assets", "fonts"),
        os.path.join(config.output_root, "assets", "videos"),
        os.path.join(config.output_root, "assets", "audios"),
        os.path.join(config.output_root, "assets", "docs"),
        os.path.join(config.output_root, "assets", "others"),
        os.path.join(config.output_root, "metadata"),
        os.path.join(config.output_root, "reports"),
        os.path.join(config.output_root, "broken_links"),
        os.path.join(config.output_root, "cms_detection")
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        
    logger.info(f"✅ تم إنشاء هيكل المجلدات في: {config.output_root}")

# إنشاء المجلدات عند تحميل الوحدة
create_directory_structure()

# =====================================================
# 3. وظائف معالجة الملفات والنصوص
# =====================================================

def sanitize_path(url):
    """تنظيف مسار URL لاستخدامه كاسم مجلد"""
    try:
        parsed = urlparse(url)
        path = parsed.path.strip("/").replace("/", "_") or "home"
        query = parsed.query
        
        # تنظيف المسار من الأحرف الخاصة
        safe_path = re.sub(r'[^\w\-_.]', '_', path)
        safe_path = re.sub(r'_+', '_', safe_path).strip('_')
        
        # إضافة معلومات الاستعلام إذا وجدت
        if query:
            safe_query = re.sub(r'[^\w\-_.]', '_', query)[:50]  # تحديد طول الاستعلام
            safe_path += f"_q_{safe_query}"
        
        # تحديد طول النهائي
        return safe_path[:100] if safe_path else "unknown_page"
        
    except Exception as e:
        logger.error(f"خطأ في تنظيف المسار {url}: {e}")
        return f"page_{len(visited)}"

def create_safe_filename(text, max_length=100):
    """إنشاء اسم ملف آمن من النص"""
    if not text:
        return "unknown"
    
    # تنظيف النص من الأحرف الخاصة
    safe_name = re.sub(r'[^\w\-_.أ-ي]', '_', str(text))
    safe_name = re.sub(r'_+', '_', safe_name).strip('_')
    
    # تحديد الطول
    if len(safe_name) > max_length:
        safe_name = safe_name[:max_length]
    
    return safe_name or "unknown"

def load_links_from_file(file_path):
    """تحميل الروابط من ملف النص"""
    links = []
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # استخراج الروابط باستخدام regex
        url_pattern = r'https://ak\.sv/[^\s\n\r\t]*'
        found_links = re.findall(url_pattern, content)
        
        # تنظيف وتصفية الروابط
        for link in found_links:
            # إزالة الأحرف الخاصة من نهاية الرابط
            clean_link = link.rstrip('.,;:!?)')
            if clean_link and clean_link not in links:
                links.append(clean_link)
        
        screenshot_stats['links_from_file'] = len(links)
        logger.info(f"✅ تم تحميل {len(links)} رابط من الملف: {file_path}")
        
        return links
        
    except FileNotFoundError:
        logger.error(f"❌ لم يتم العثور على الملف: {file_path}")
        return []
    except Exception as e:
        logger.error(f"❌ خطأ في قراءة الملف {file_path}: {e}")
        return []

# =====================================================
# 4. وظائف حفظ المحتوى والأصول
# =====================================================

def save_html(content, folder):
    """حفظ محتوى HTML في مجلد محدد"""
    try:
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, "index.html")
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
            
        # حفظ معلومات إضافية عن الملف
        info_filename = os.path.join(folder, "page_info.txt")
        with open(info_filename, "w", encoding="utf-8") as f:
            f.write(f"تم الحفظ: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"حجم المحتوى: {len(content)} حرف\n")
            f.write(f"ترميز الملف: UTF-8\n")
            
        return filename
        
    except Exception as e:
        logger.error(f"خطأ في حفظ HTML: {e}")
        return None

def get_asset_folder_by_mime(mime):
    """تحديد مجلد الحفظ حسب نوع الملف"""
    if not mime:
        return "others"
    
    mime_lower = mime.lower()
    
    if mime_lower.startswith("image/"):
        return "images"
    elif mime_lower.startswith("font/") or mime_lower in ["application/font-woff", "application/font-woff2"]:
        return "fonts"
    elif mime_lower == "text/css":
        return "css"
    elif mime_lower in ["application/javascript", "text/javascript"]:
        return "js"
    elif mime_lower.startswith("video/"):
        return "videos"
    elif mime_lower.startswith("audio/"):
        return "audios"
    elif mime_lower in ["application/pdf", "application/msword", 
                       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        return "docs"
    else:
        return "others"

def save_binary(url, page_folder):
    """تحميل وحفظ الملفات الثنائية (الصور، CSS، JS، إلخ)"""
    try:
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        
        if not filename or '.' not in filename:
            filename = f"file_{hash(url) % 10000}"

        # تحديد نوع الملف ومجلد الحفظ
        mime, _ = mimetypes.guess_type(filename)
        folder_name = get_asset_folder_by_mime(mime)
        folder = os.path.join(page_folder, "assets", folder_name)
        os.makedirs(folder, exist_ok=True)

        filepath = os.path.join(folder, filename)
        
        # تجنب إعادة التحميل إذا كان الملف موجود
        if os.path.exists(filepath):
            return filepath

        # تحميل الملف
        headers = {"User-Agent": ua.random}
        response = requests.get(url, headers=headers, timeout=15, stream=True)
        
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            screenshot_stats['total_assets_downloaded'] += 1
            return filepath
        else:
            logger.warning(f"فشل تحميل الأصل {url}: كود الحالة {response.status_code}")
            
    except Exception as e:
        logger.error(f"خطأ في تحميل الأصل {url}: {e}")
        
    return None

def extract_assets(soup, page_folder, page_url):
    """استخراج وتحميل جميع الأصول من الصفحة"""
    asset_tags = {
        "img": "src",
        "link": "href", 
        "script": "src",
        "source": "src",
        "video": "src",
        "audio": "src",
        "embed": "src",
        "object": "data"
    }
    
    extracted_assets = []
    
    for tag, attr in asset_tags.items():
        for element in soup.find_all(tag):
            src = element.get(attr)
            
            if src and not src.startswith("data:") and not src.startswith("javascript:"):
                try:
                    # تحويل الرابط النسبي إلى مطلق
                    full_url = urljoin(page_url, src)
                    
                    # تحميل الأصل
                    saved_path = save_binary(full_url, page_folder)
                    
                    if saved_path:
                        extracted_assets.append({
                            'tag': tag,
                            'original_url': full_url,
                            'saved_path': saved_path,
                            'attribute': attr
                        })
                        
                except Exception as e:
                    logger.error(f"خطأ في معالجة الأصل {src}: {e}")
    
    # حفظ قائمة الأصول
    assets_info_file = os.path.join(page_folder, "assets_info.json")
    try:
        with open(assets_info_file, "w", encoding="utf-8") as f:
            json.dump(extracted_assets, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"خطأ في حفظ معلومات الأصول: {e}")
    
    return extracted_assets

# =====================================================
# 5. وظائف استخراج البيانات الوصفية
# =====================================================

def get_meta_info(soup):
    """استخراج جميع معلومات Meta من الصفحة"""
    meta_info = {}
    
    try:
        # استخراج جميع meta tags
        for meta in soup.find_all("meta"):
            # Meta tags with name attribute
            if meta.get("name"):
                meta_info[f"name_{meta.get('name')}"] = meta.get("content", "")
            # Meta tags with property attribute (Open Graph, etc.)
            elif meta.get("property"):
                meta_info[f"property_{meta.get('property')}"] = meta.get("content", "")
            # Meta tags with http-equiv attribute
            elif meta.get("http-equiv"):
                meta_info[f"http_equiv_{meta.get('http-equiv')}"] = meta.get("content", "")
        
        # استخراج معلومات إضافية
        if soup.title:
            meta_info["page_title"] = soup.title.string.strip()
        
        # استخراج canonical URL
        canonical = soup.find("link", rel="canonical")
        if canonical:
            meta_info["canonical_url"] = canonical.get("href", "")
        
        # استخراج معلومات اللغة
        html_tag = soup.find("html")
        if html_tag:
            meta_info["page_lang"] = html_tag.get("lang", "")
        
    except Exception as e:
        logger.error(f"خطأ في استخراج معلومات Meta: {e}")
    
    return meta_info

def detect_cms(headers, soup):
    """كشف نظام إدارة المحتوى المستخدم"""
    cms_indicators = {
        "WordPress": [
            "wp-content", "wp-includes", "wp-admin", 
            "wordpress", "woocommerce"
        ],
        "Joomla": [
            "joomla", "com_content", "mod_", "administrator"
        ],
        "Drupal": [
            "drupal", "sites/all", "sites/default"
        ],
        "Shopify": [
            "shopify", "cdn.shopify.com", "checkout.shopify.com"
        ],
        "Magento": [
            "magento", "mage", "varien"
        ],
        "PrestaShop": [
            "prestashop", "ps_", "prestashop.com"
        ],
        "Laravel": [
            "laravel_session", "csrf-token", "laravel"
        ],
        "React": [
            "react", "__REACT", "react-dom"
        ],
        "Vue.js": [
            "vue", "__VUE__", "v-"
        ],
        "Angular": [
            "angular", "ng-", "__ANGULAR"
        ]
    }
    
    detected_cms = []
    
    try:
        # فحص الهيدرز
        server = headers.get("server", "").lower()
        powered_by = headers.get("x-powered-by", "").lower()
        
        # فحص محتوى الصفحة
        page_content = str(soup).lower()
        
        for cms, indicators in cms_indicators.items():
            for indicator in indicators:
                if (indicator.lower() in server or 
                    indicator.lower() in powered_by or 
                    indicator.lower() in page_content):
                    if cms not in detected_cms:
                        detected_cms.append(cms)
                    break
        
        return detected_cms if detected_cms else ["Unknown"]
        
    except Exception as e:
        logger.error(f"خطأ في كشف CMS: {e}")
        return ["Error in Detection"]

def extract_page_structure(soup):
    """استخراج هيكل الصفحة وتحليل المحتوى"""
    structure = {
        'headings': {},
        'links': [],
        'images': [],
        'forms': [],
        'tables': [],
        'lists': [],
        'paragraphs_count': 0,
        'word_count': 0
    }
    
    try:
        # استخراج العناوين
        for i in range(1, 7):
            headings = soup.find_all(f'h{i}')
            structure['headings'][f'h{i}'] = [h.get_text(strip=True) for h in headings]
        
        # استخراج الروابط
        for link in soup.find_all('a', href=True):
            structure['links'].append({
                'href': link.get('href'),
                'text': link.get_text(strip=True),
                'title': link.get('title', '')
            })
        
        # استخراج الصور
        for img in soup.find_all('img'):
            structure['images'].append({
                'src': img.get('src', ''),
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
                'width': img.get('width', ''),
                'height': img.get('height', '')
            })
        
        # استخراج النماذج
        for form in soup.find_all('form'):
            inputs = [inp.get('type', 'text') for inp in form.find_all('input')]
            structure['forms'].append({
                'action': form.get('action', ''),
                'method': form.get('method', 'get'),
                'inputs': inputs
            })
        
        # استخراج الجداول
        for table in soup.find_all('table'):
            rows = len(table.find_all('tr'))
            cols = len(table.find_all('th')) or len(table.find_all('td')[:1])
            structure['tables'].append({
                'rows': rows,
                'columns': cols
            })
        
        # حساب الفقرات والكلمات
        paragraphs = soup.find_all('p')
        structure['paragraphs_count'] = len(paragraphs)
        
        text_content = soup.get_text()
        structure['word_count'] = len(text_content.split())
        
    except Exception as e:
        logger.error(f"خطأ في استخراج هيكل الصفحة: {e}")
    
    return structure

# =====================================================
# 6. وظائف فحص الروابط المعطلة
# =====================================================

def check_links(links):
    """فحص الروابط المعطلة"""
    broken_links = []
    headers = {"User-Agent": ua.random}
    
    for link in links[:20]:  # فحص أول 20 رابط فقط لتوفير الوقت
        try:
            response = requests.head(link, headers=headers, allow_redirects=True, timeout=10)
            if response.status_code >= 400:
                broken_links.append({
                    'url': link,
                    'status_code': response.status_code,
                    'error': f"HTTP {response.status_code}"
                })
        except requests.exceptions.RequestException as e:
            broken_links.append({
                'url': link,
                'status_code': 0,
                'error': str(e)
            })
        except Exception as e:
            broken_links.append({
                'url': link,
                'status_code': 0,
                'error': f"Unknown error: {str(e)}"
            })
    
    return broken_links

# =====================================================
# 7. وظائف أخذ لقطات الشاشة المتقدمة
# =====================================================

async def take_enhanced_screenshot(page, page_folder, url):
    """أخذ لقطات شاشة متقدمة ومتعددة"""
    screenshots_taken = []
    
    try:
        # إنشاء مجلد لقطات الشاشة
        screenshots_folder = os.path.join(page_folder, "screenshots")
        os.makedirs(screenshots_folder, exist_ok=True)
        
        # انتظار تحميل الصفحة بالكامل
        await asyncio.sleep(config.screenshot_delay)
        
        # لقطة شاشة كاملة للصفحة
        full_screenshot_path = os.path.join(screenshots_folder, "full_page.png")
        await page.screenshot(
            path=full_screenshot_path, 
            full_page=True,
            type=config.screenshot_format
        )
        screenshots_taken.append(full_screenshot_path)
        
        # لقطة شاشة للجزء المرئي فقط
        viewport_screenshot_path = os.path.join(screenshots_folder, "viewport.png")
        await page.screenshot(
            path=viewport_screenshot_path,
            full_page=False,
            type=config.screenshot_format
        )
        screenshots_taken.append(viewport_screenshot_path)
        
        # لقطة شاشة للموبايل (عرض ضيق)
        await page.set_viewport_size({'width': 375, 'height': 667})
        mobile_screenshot_path = os.path.join(screenshots_folder, "mobile_view.png")
        await page.screenshot(
            path=mobile_screenshot_path,
            full_page=True,
            type=config.screenshot_format
        )
        screenshots_taken.append(mobile_screenshot_path)
        
        # إعادة تعيين حجم العرض الأصلي
        await page.set_viewport_size({
            'width': config.viewport_width, 
            'height': config.viewport_height
        })
        
        # تحسين جودة الصور
        await optimize_screenshots(screenshots_folder)
        
        screenshot_stats['successful_screenshots'] += 1
        screenshot_stats['total_screenshots'] += len(screenshots_taken)
        
        logger.info(f"✅ تم أخذ {len(screenshots_taken)} لقطة شاشة لـ {url}")
        return screenshots_taken
        
    except Exception as e:
        logger.error(f"❌ فشل في أخذ لقطة شاشة لـ {url}: {e}")
        screenshot_stats['failed_screenshots'] += 1
        failed_urls.append({
            'url': url,
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
            'error_type': 'screenshot_error'
        })
        return []

async def optimize_screenshots(screenshots_folder):
    """تحسين جودة وحجم لقطات الشاشة"""
    try:
        for filename in os.listdir(screenshots_folder):
            if filename.endswith('.png'):
                filepath = os.path.join(screenshots_folder, filename)
                
                # فتح الصورة وتحسينها
                with Image.open(filepath) as img:
                    # تحويل إلى RGB إذا لزم الأمر
                    if img.mode in ('RGBA', 'LA', 'P'):
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                        img = background
                    
                    # حفظ بجودة محسنة
                    optimized_path = os.path.join(screenshots_folder, f"opt_{filename}")
                    img.save(optimized_path, 'PNG', optimize=True, quality=config.screenshot_quality)
                    
                    # إنشاء thumbnail
                    img.thumbnail((300, 200), Image.Resampling.LANCZOS)
                    thumbnail_path = os.path.join(screenshots_folder, f"thumb_{filename}")
                    img.save(thumbnail_path, 'PNG')
                    
    except Exception as e:
        logger.error(f"خطأ في تحسين لقطات الشاشة: {e}")

# =====================================================
# 8. الوظيفة الرئيسية للزحف والتحليل
# =====================================================

async def crawl(page, url, depth=0):
    """الوظيفة الرئيسية للزحف وتحليل الصفحات"""
    
    # فحص شروط التوقف
    if (depth > config.max_depth or 
        url in visited or 
        len(visited) >= config.max_pages):
        return
    
    visited.add(url)
    screenshot_stats['total_pages_processed'] += 1
    
    try:
        logger.info(f"🔍 معالجة الصفحة: {url} (العمق: {depth})")
        
        # الانتقال إلى الصفحة
        response = await page.goto(
            url, 
            wait_until="networkidle", 
            timeout=config.timeout
        )
        
        if not response:
            raise Exception("فشل في تحميل الصفحة - لا يوجد استجابة")
        
        # الحصول على المحتوى والهيدرز
        content = await page.content()
        headers = response.headers if response else {}
        
        # إنشاء مجلد للصفحة
        page_folder = os.path.join(config.output_root, sanitize_path(url))
        os.makedirs(page_folder, exist_ok=True)
        
        # حفظ HTML إذا كان مفعل
        if config.save_html:
            save_html(content, page_folder)
        
        # أخذ لقطات الشاشة
        screenshots = await take_enhanced_screenshot(page, page_folder, url)
        
        # تحليل المحتوى باستخدام BeautifulSoup
        soup = BeautifulSoup(content, "html.parser")
        
        # استخراج الأصول إذا كان مفعل
        if config.save_assets:
            extracted_assets = extract_assets(soup, page_folder, url)
        
        # استخراج البيانات الوصفية
        meta_info = get_meta_info(soup)
        with open(os.path.join(page_folder, "meta_info.json"), "w", encoding="utf-8") as f:
            json.dump(meta_info, f, ensure_ascii=False, indent=2)
        
        # كشف نظام إدارة المحتوى إذا كان مفعل
        if config.analyze_cms:
            cms_detected = detect_cms(headers, soup)
            cms_info = {
                'detected_cms': cms_detected,
                'confidence': 'high' if len(cms_detected) == 1 else 'medium',
                'detection_time': datetime.now().isoformat()
            }
            with open(os.path.join(page_folder, "cms_info.json"), "w", encoding="utf-8") as f:
                json.dump(cms_info, f, ensure_ascii=False, indent=2)
        
        # استخراج هيكل الصفحة
        page_structure = extract_page_structure(soup)
        with open(os.path.join(page_folder, "page_structure.json"), "w", encoding="utf-8") as f:
            json.dump(page_structure, f, ensure_ascii=False, indent=2)
        
        # إضافة الصفحة إلى sitemap
        sitemap_urls.append(url)
        
        # استخراج الروابط الداخلية للزحف العميق
        internal_links = []
        if depth < config.max_depth:
            for a in soup.find_all("a", href=True):
                href = a.get('href')
                if href:
                    next_url = urljoin(config.base_url, href)
                    parsed_next = urlparse(next_url)
                    parsed_base = urlparse(config.base_url)
                    
                    # فقط الروابط من نفس النطاق
                    if parsed_next.netloc == parsed_base.netloc:
                        internal_links.append(next_url)
        
        # فحص الروابط المعطلة إذا كان مفعل
        if config.check_broken_links and internal_links:
            broken_links = check_links(internal_links[:10])  # فحص أول 10 روابط
            if broken_links:
                with open(os.path.join(page_folder, "broken_links.json"), "w", encoding="utf-8") as f:
                    json.dump(broken_links, f, ensure_ascii=False, indent=2)
        
        # حفظ معلومات شاملة عن الصفحة
        page_summary = {
            'url': url,
            'depth': depth,
            'processing_time': datetime.now().isoformat(),
            'status_code': response.status,
            'content_length': len(content),
            'screenshots_count': len(screenshots),
            'assets_extracted': len(extracted_assets) if config.save_assets else 0,
            'internal_links_found': len(internal_links),
            'cms_detected': cms_detected if config.analyze_cms else [],
            'meta_tags_count': len(meta_info),
            'headings_count': sum(len(headings) for headings in page_structure['headings'].values()),
            'images_count': len(page_structure['images']),
            'forms_count': len(page_structure['forms']),
            'word_count': page_structure['word_count']
        }
        
        with open(os.path.join(page_folder, "page_summary.json"), "w", encoding="utf-8") as f:
            json.dump(page_summary, f, ensure_ascii=False, indent=2)
        
        processed_links.append(page_summary)
        
        logger.info(f"✅ تمت معالجة: {url} | العمق: {depth} | CMS: {cms_detected if config.analyze_cms else 'غير مفعل'}")
        
        # الزحف للروابط الفرعية (محدود العدد)
        for link in internal_links[:3]:  # أول 3 روابط فقط لكل صفحة
            if len(visited) < config.max_pages:
                await asyncio.sleep(config.delay_between_requests)  # تأخير بين الطلبات
                await crawl(page, link, depth + 1)
            else:
                break
        
    except PlaywrightTimeoutError:
        error_msg = f"انتهت مهلة تحميل الصفحة: {url}"
        logger.error(f"⏰ {error_msg}")
        failed_urls.append({
            'url': url,
            'error': 'timeout',
            'timestamp': datetime.now().isoformat(),
            'error_type': 'timeout_error'
        })
        
    except Exception as e:
        error_msg = f"خطأ في معالجة {url}: {str(e)}"
        logger.error(f"❌ {error_msg}")
        failed_urls.append({
            'url': url,
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
            'error_type': 'general_error'
        })

# =====================================================
# 9. وظائف إنشاء التقارير والخرائط
# =====================================================

def save_sitemap(urls, filename="sitemap.xml"):
    """إنشاء وحفظ خريطة الموقع XML"""
    try:
        urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
        
        for url in urls:
            url_element = ET.SubElement(urlset, "url")
            loc = ET.SubElement(url_element, "loc")
            loc.text = url
            
            # إضافة تاريخ آخر تعديل
            lastmod = ET.SubElement(url_element, "lastmod")
            lastmod.text = datetime.now().strftime('%Y-%m-%d')
            
            # إضافة تكرار التغيير
            changefreq = ET.SubElement(url_element, "changefreq")
            changefreq.text = "weekly"
            
            # إضافة الأولوية
            priority = ET.SubElement(url_element, "priority")
            priority.text = "0.8"
        
        tree = ET.ElementTree(urlset)
        tree.write(filename, encoding="utf-8", xml_declaration=True)
        
        logger.info(f"📄 تم إنشاء خريطة الموقع: {filename}")
        
    except Exception as e:
        logger.error(f"خطأ في إنشاء خريطة الموقع: {e}")

async def generate_comprehensive_report():
    """إنشاء تقرير شامل ومفصل"""
    try:
        screenshot_stats['end_time'] = datetime.now()
        if screenshot_stats['start_time']:
            duration = screenshot_stats['end_time'] - screenshot_stats['start_time']
            screenshot_stats['duration_seconds'] = duration.total_seconds()
        
        # تقرير مفصل
        comprehensive_report = {
            'تقرير_التحليل_الشامل': {
                'معلومات_عامة': {
                    'الموقع_المستهدف': config.base_url,
                    'وقت_البدء': screenshot_stats['start_time'].isoformat() if screenshot_stats['start_time'] else None,
                    'وقت_الانتهاء': screenshot_stats['end_time'].isoformat(),
                    'مدة_التحليل_بالثواني': screenshot_stats['duration_seconds'],
                    'مدة_التحليل_بالدقائق': round(screenshot_stats['duration_seconds'] / 60, 2)
                },
                'إحصائيات_الصفحات': {
                    'إجمالي_الصفحات_المعالجة': screenshot_stats['total_pages_processed'],
                    'الروابط_من_الملف': screenshot_stats['links_from_file'],
                    'الروابط_المكتشفة': len(visited) - screenshot_stats['links_from_file'],
                    'الصفحات_في_sitemap': len(sitemap_urls),
                    'الصفحات_الفاشلة': len(failed_urls)
                },
                'إحصائيات_لقطات_الشاشة': {
                    'لقطات_شاشة_ناجحة': screenshot_stats['successful_screenshots'],
                    'لقطات_شاشة_فاشلة': screenshot_stats['failed_screenshots'],
                    'إجمالي_لقطات_الشاشة': screenshot_stats['total_screenshots'],
                    'معدل_نجاح_لقطات_الشاشة': f"{(screenshot_stats['successful_screenshots'] / max(screenshot_stats['total_pages_processed'], 1)) * 100:.2f}%"
                },
                'إحصائيات_الأصول': {
                    'إجمالي_الأصول_المحملة': screenshot_stats['total_assets_downloaded']
                },
                'إعدادات_التحليل': {
                    'الحد_الأقصى_للصفحات': config.max_pages,
                    'العمق_الأقصى': config.max_depth,
                    'حفظ_HTML': config.save_html,
                    'حفظ_الأصول': config.save_assets,
                    'تحليل_CMS': config.analyze_cms,
                    'فحص_الروابط_المعطلة': config.check_broken_links,
                    'إنشاء_sitemap': config.generate_sitemap
                }
            },
            'تفاصيل_الصفحات_المعالجة': processed_links,
            'الأخطاء_والمشاكل': {
                'الروابط_الفاشلة': failed_urls,
                'إجمالي_الأخطاء': len(failed_urls)
            },
            'الملفات_المُنشأة': {
                'مجلد_النتائج_الرئيسي': config.output_root,
                'مجلد_لقطات_الشاشة': config.screenshots_root,
                'مجلد_HTML': os.path.join(config.output_root, "html_pages"),
                'مجلد_الأصول': os.path.join(config.output_root, "assets"),
                'مجلد_البيانات_الوصفية': os.path.join(config.output_root, "metadata"),
                'خريطة_الموقع': os.path.join(config.output_root, "sitemap.xml")
            }
        }
        
        # حفظ التقرير المفصل
        report_file = os.path.join(config.output_root, "reports", "comprehensive_report.json")
        async with aiofiles.open(report_file, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(comprehensive_report, ensure_ascii=False, indent=2))
        
        # إنشاء تقرير نصي مبسط
        text_report = f"""
╔══════════════════════════════════════════════════════════════╗
║                    تقرير تحليل الموقع الشامل                    ║
╚══════════════════════════════════════════════════════════════╝

🌐 الموقع المحلل: {config.base_url}
📅 تاريخ التحليل: {screenshot_stats['end_time'].strftime('%Y-%m-%d %H:%M:%S')}
⏱️ مدة التحليل: {round(screenshot_stats['duration_seconds'] / 60, 2)} دقيقة

📊 إحصائيات عامة:
═══════════════════
✅ الصفحات المعالجة بنجاح: {screenshot_stats['total_pages_processed']}
📄 الروابط من الملف: {screenshot_stats['links_from_file']}
🔍 الروابط المكتشفة: {len(visited) - screenshot_stats['links_from_file']}
❌ الصفحات الفاشلة: {len(failed_urls)}

📸 لقطات الشاشة:
═══════════════════
✅ لقطات ناجحة: {screenshot_stats['successful_screenshots']}
❌ لقطات فاشلة: {screenshot_stats['failed_screenshots']}
📊 إجمالي اللقطات: {screenshot_stats['total_screenshots']}
📈 معدل النجاح: {(screenshot_stats['successful_screenshots'] / max(screenshot_stats['total_pages_processed'], 1)) * 100:.2f}%

💾 الأصول المحملة:
═══════════════════
📦 إجمالي الأصول: {screenshot_stats['total_assets_downloaded']}

📁 الملفات المُنشأة:
═══════════════════
🗂️ النتائج الرئيسية: {config.output_root}
📸 لقطات الشاشة: {config.screenshots_root}
🌐 خريطة الموقع: {os.path.join(config.output_root, "sitemap.xml")}
📊 التقارير المفصلة: {os.path.join(config.output_root, "reports")}

⚙️ إعدادات التحليل:
═══════════════════
📄 الحد الأقصى للصفحات: {config.max_pages}
🔍 العمق الأقصى: {config.max_depth}
💾 حفظ HTML: {'✅' if config.save_html else '❌'}
📦 حفظ الأصول: {'✅' if config.save_assets else '❌'}
🔧 تحليل CMS: {'✅' if config.analyze_cms else '❌'}
🔗 فحص الروابط المعطلة: {'✅' if config.check_broken_links else '❌'}

════════════════════════════════════════════════════════════════
🎉 تم إنجاز التحليل بنجاح! جميع النتائج محفوظة في المجلدات المحددة.
════════════════════════════════════════════════════════════════
"""
        
        text_report_file = os.path.join(config.output_root, "reports", "summary_report.txt")
        async with aiofiles.open(text_report_file, 'w', encoding='utf-8') as f:
            await f.write(text_report)
        
        logger.info(f"📊 تم إنشاء التقرير الشامل: {report_file}")
        logger.info(f"📄 تم إنشاء الملخص النصي: {text_report_file}")
        
    except Exception as e:
        logger.error(f"خطأ في إنشاء التقرير الشامل: {e}")

# =====================================================
# 10. الوظيفة الرئيسية للتشغيل
# =====================================================

async def main():
    """الوظيفة الرئيسية لتشغيل التحليل الشامل"""
    
    print("""
╔══════════════════════════════════════════════════════════════╗
║                أداة تحليل ولقطات الشاشة الشاملة               ║
║            Enhanced Website Screenshot & Analysis Tool       ║
║                                                              ║
║  🎯 تقرأ الروابط من ملف روابط_AKWAM_ترتيب_هرمي_شامل.txt      ║
║  📸 تأخذ لقطات شاشة متعددة بصيغة PNG عالية الجودة           ║
║  🔍 تحلل المحتوى والبيانات الوصفية وأنظمة إدارة المحتوى      ║
║  💾 تحفظ جميع الأصول والملفات بشكل منظم                    ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    screenshot_stats['start_time'] = datetime.now()
    logger.info(f"🚀 بدء التحليل الشامل للموقع: {config.base_url}")
    
    try:
        # تحميل الروابط من الملف
        links_file_path = os.path.join("site_analysis_tools", config.links_file)
        links_to_process = load_links_from_file(links_file_path)
        
        if not links_to_process:
            logger.error("❌ لم يتم العثور على روابط للمعالجة!")
            return
        
        logger.info(f"📋 تم تحميل {len(links_to_process)} رابط من الملف")
        
        # إطلاق المتصفح
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox', 
                    '--disable-dev-shm-usage',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-extensions'
                ]
            )
            
            # إنشاء صفحة جديدة
            page = await browser.new_page()
            
            # تعيين user agent
            await page.set_extra_http_headers({
                'User-Agent': ua.random
            })
            
            # تعيين حجم العرض
            await page.set_viewport_size({
                'width': config.viewport_width, 
                'height': config.viewport_height
            })
            
            # معالجة الروابط من الملف أولاً
            processed_count = 0
            for link in links_to_process:
                if processed_count >= config.max_pages:
                    logger.info(f"⚠️ تم الوصول للحد الأقصى من الصفحات: {config.max_pages}")
                    break
                
                await crawl(page, link, 0)
                processed_count += 1
                
                # تأخير قصير بين الطلبات
                if processed_count % 10 == 0:
                    logger.info(f"📊 تمت معالجة {processed_count} صفحة من أصل {len(links_to_process)}")
                    await asyncio.sleep(2)  # استراحة قصيرة كل 10 صفحات
            
            # إغلاق المتصفح
            await browser.close()
        
        # إنشاء خريطة الموقع إذا كان مفعل
        if config.generate_sitemap:
            sitemap_path = os.path.join(config.output_root, "sitemap.xml")
            save_sitemap(sitemap_urls, sitemap_path)
        
        # إنشاء التقرير الشامل
        await generate_comprehensive_report()
        
        # طباعة النتائج النهائية
        duration = screenshot_stats['end_time'] - screenshot_stats['start_time']
        
        print(f"""
╔══════════════════════════════════════════════════════════════╗
║                        🎉 تم الانتهاء من التحليل!             ║
╚══════════════════════════════════════════════════════════════╝

⏱️ المدة الإجمالية: {duration.total_seconds():.2f} ثانية ({duration.total_seconds()/60:.2f} دقيقة)
📊 الصفحات المعالجة: {screenshot_stats['total_pages_processed']}
📸 لقطات الشاشة الناجحة: {screenshot_stats['successful_screenshots']}
❌ لقطات الشاشة الفاشلة: {screenshot_stats['failed_screenshots']}
💾 الأصول المحملة: {screenshot_stats['total_assets_downloaded']}
🌐 الروابط في Sitemap: {len(sitemap_urls)}

📁 جميع النتائج محفوظة في: {config.output_root}
📸 لقطات الشاشة في: {config.screenshots_root}
📊 التقارير المفصلة في: {os.path.join(config.output_root, 'reports')}
        """)
        
    except Exception as e:
        logger.error(f"❌ خطأ عام في التحليل: {e}")
        print(f"❌ حدث خطأ عام: {e}")
        raise

def run_screenshot_tool():
    """تشغيل الأداة مع معالجة الأخطاء"""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف التحليل بواسطة المستخدم")
        logger.info("تم إيقاف التحليل بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ في تشغيل الأداة: {e}")
        logger.error(f"خطأ في تشغيل الأداة: {e}")

# =====================================================
# 11. تشغيل الأداة
# =====================================================

if __name__ == "__main__":
    run_screenshot_tool()