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

# إعدادات محسنة
class ScreenshotConfig:
    def __init__(self):
        self.base_url = "https://ak.sv/"  # يمكن تعديله
        self.output_root = "site_analysis_complete"
        self.screenshots_root = "screenshots"
        self.max_depth = 3  # مخفض للأداء الأفضل
        self.max_pages = 50  # حد أقصى للصفحات
        self.screenshot_delay = 2  # ثانية انتظار قبل أخذ لقطة الشاشة
        self.viewport_width = 1920
        self.viewport_height = 1080
        self.screenshot_quality = 90
        self.timeout = 30000  # 30 ثانية
        
config = ScreenshotConfig()
ua = UserAgent()
visited = set()
sitemap_urls = []
failed_urls = []
screenshot_stats = {
    'total_screenshots': 0,
    'successful_screenshots': 0,
    'failed_screenshots': 0,
    'start_time': None,
    'end_time': None
}

# إنشاء المجلدات
os.makedirs(config.output_root, exist_ok=True)
os.makedirs(config.screenshots_root, exist_ok=True)

def sanitize_path(url):
    """تنظيف مسار URL لاستخدامه كاسم مجلد"""
    try:
        parsed = urlparse(url)
        path = parsed.path.strip("/").replace("/", "_") or "home"
        # إزالة الأحرف الخاصة وتنظيف الاسم
        path = "".join(c for c in path if c.isalnum() or c in "_-")
        return path[:100]  # تحديد طول الاسم
    except Exception as e:
        logger.error(f"خطأ في تنظيف المسار {url}: {e}")
        return "unknown_page"

def create_safe_filename(text, max_length=100):
    """إنشاء اسم ملف آمن من النص"""
    if not text:
        return "unknown"
    
    # تنظيف النص
    safe_name = "".join(c for c in text if c.isalnum() or c in "_-. ")
    safe_name = safe_name.replace(" ", "_").strip("_")
    
    # تحديد الطول
    if len(safe_name) > max_length:
        safe_name = safe_name[:max_length]
    
    return safe_name or "unknown"

def save_html(content, folder):
    os.makedirs(folder, exist_ok=True)
    filename = os.path.join(folder, "index.html")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

def get_asset_folder_by_mime(mime):
    if not mime:
        return "others"
    if mime.startswith("image/"):
        return "images"
    if mime.startswith("font/") or mime in ["application/font-woff", "application/font-woff2"]:
        return "fonts"
    if mime == "text/css":
        return "css"
    if mime == "application/javascript" or mime == "text/javascript":
        return "js"
    if mime.startswith("video/"):
        return "videos"
    if mime.startswith("audio/"):
        return "audios"
    if mime in ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        return "docs"
    return "others"

def save_binary(url, page_folder):
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    if not filename or '.' not in filename:
        filename = "file"

    mime, _ = mimetypes.guess_type(filename)
    folder_name = get_asset_folder_by_mime(mime)
    folder = os.path.join(page_folder, folder_name)
    os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)
    if os.path.exists(filepath):
        return filepath
    try:
        headers = {"User-Agent": ua.random}
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(r.content)
            return filepath
    except Exception as e:
        print(f"Failed to download asset {url} - {e}")
    return None

def extract_assets(soup, page_folder, page_url):
    asset_tags = {
        "img": "src",
        "link": "href",
        "script": "src",
        "source": "src",
        "video": "src",
        "audio": "src",
    }
    for tag, attr in asset_tags.items():
        for el in soup.find_all(tag):
            src = el.get(attr)
            if src and not src.startswith("data:"):
                full_url = urljoin(page_url, src)
                save_binary(full_url, page_folder)

def get_meta_info(soup):
    metas = {}
    for meta in soup.find_all("meta"):
        if meta.get("name"):
            metas[meta.get("name")] = meta.get("content", "")
        elif meta.get("property"):
            metas[meta.get("property")] = meta.get("content", "")
    return metas

def detect_cms(headers, soup):
    # أمثلة بسيطة على الكشف
    server = headers.get("server", "").lower()
    powered_by = headers.get("x-powered-by", "").lower()
    cms = "Unknown"
    if "wordpress" in powered_by or "wp-" in str(soup):
        cms = "WordPress"
    elif "joomla" in powered_by or "joomla" in str(soup).lower():
        cms = "Joomla"
    elif "drupal" in powered_by or "drupal" in str(soup).lower():
        cms = "Drupal"
    elif "shopify" in powered_by or "shopify" in str(soup).lower():
        cms = "Shopify"
    return cms

def check_links(links):
    broken = []
    headers = {"User-Agent": ua.random}
    for link in links:
        try:
            r = requests.head(link, headers=headers, allow_redirects=True, timeout=5)
            if r.status_code >= 400:
                broken.append((link, r.status_code))
        except:
            broken.append((link, "Failed"))
    return broken

async def crawl(page, url, depth=0):
    if depth > config.max_depth or url in visited:
        return
    visited.add(url)
    try:
        response = await page.goto(url, wait_until="networkidle", timeout=30000)
        content = await page.content()
        headers = response.headers if response else {}

        page_folder = os.path.join(config.output_root, sanitize_path(url))
        save_html(content, page_folder)

        # Screenshot
        screenshots_folder = os.path.join(page_folder, "screenshots")
        os.makedirs(screenshots_folder, exist_ok=True)
        screenshot_path = os.path.join(screenshots_folder, "screenshot.png")
        await page.screenshot(path=screenshot_path, full_page=True, type='png')

        soup = BeautifulSoup(content, "html.parser")

        # استخراج الأصول
        extract_assets(soup, page_folder, url)

        # حفظ بيانات الـ meta
        metas = get_meta_info(soup)
        with open(os.path.join(page_folder, "meta_info.txt"), "w", encoding="utf-8") as f:
            for k, v in metas.items():
                f.write(f"{k}: {v}\n")

        # كشف CMS
        cms = detect_cms(headers, soup)
        with open(os.path.join(page_folder, "cms_info.txt"), "w", encoding="utf-8") as f:
            f.write(f"CMS Detected: {cms}\n")

        sitemap_urls.append(url)

        # تتبع الروابط الداخلية
        links = []
        for a in soup.find_all("a", href=True):
            href = a.get('href')
            if href:
                next_url = urljoin(config.base_url, href)
                if urlparse(next_url).netloc == urlparse(config.base_url).netloc:
                    links.append(next_url)

        # فحص الروابط المعطلة
        broken_links = check_links(links)
        with open(os.path.join(page_folder, "broken_links.txt"), "w", encoding="utf-8") as f:
            for link, status in broken_links:
                f.write(f"{link} -> {status}\n")

        print(f"✅ Crawled: {url} | Depth: {depth} | CMS: {cms}")

        for link in links[:5]:  # حد أقصى 5 روابط لكل صفحة
            await crawl(page, link, depth + 1)

    except Exception as e:
        print(f"❌ Failed at {url}: {e}")

def save_sitemap(urls, filename="sitemap.xml"):
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for url in urls:
        url_el = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url_el, "loc")
        loc.text = url
    tree = ET.ElementTree(urlset)
    tree.write(filename, encoding="utf-8", xml_declaration=True)

async def main():
    """الدالة الرئيسية"""
    print(f"🚀 بدء تحليل الموقع: {config.base_url}")
    screenshot_stats['start_time'] = datetime.now()
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-dev-shm-usage']
            )
            page = await browser.new_page()
            
            # تعيين حجم العرض
            await page.set_viewport_size({
                'width': config.viewport_width, 
                'height': config.viewport_height
            })
            
            await crawl(page, config.base_url, 0)
            await browser.close()
            
        save_sitemap(sitemap_urls, os.path.join(config.output_root, "sitemap.xml"))
        
        screenshot_stats['end_time'] = datetime.now()
        duration = screenshot_stats['end_time'] - screenshot_stats['start_time']
        
        print(f"✅ تم الانتهاء من التحليل!")
        print(f"⏱️ المدة: {duration.total_seconds():.2f} ثانية")
        print(f"📊 لقطات شاشة ناجحة: {screenshot_stats['successful_screenshots']}")
        print(f"❌ لقطات شاشة فاشلة: {screenshot_stats['failed_screenshots']}")
        print(f"🌐 Sitemap saved to {config.output_root}/sitemap.xml")
        print(f"📁 النتائج في: {config.output_root}")
        
    except Exception as e:
        logger.error(f"خطأ عام: {e}")
        print(f"❌ خطأ في التحليل: {e}")

def run_screenshot_tool():
    """تشغيل الأداة"""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف التحليل بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ في تشغيل الأداة: {e}")

if __name__ == "__main__":
    run_screenshot_tool()