import nest_asyncio
nest_asyncio.apply()

import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin, urlparse
from fake_useragent import UserAgent
import mimetypes
import xml.etree.ElementTree as ET
import requests

# إعدادات
base_url = "https://ak.sv/"  # عدل هنا
output_root = "site_backup"
max_depth = 5

ua = UserAgent()
visited = set()
sitemap_urls = []

os.makedirs(output_root, exist_ok=True)

def sanitize_path(url):
    parsed = urlparse(url)
    path = parsed.path.strip("/").replace("/", "_") or "home"
    return path

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
    if depth > max_depth or url in visited:
        return
    visited.add(url)
    try:
        response = await page.goto(url, wait_until="networkidle", timeout=30000)
        content = await page.content()
        headers = response.headers if response else {}

        page_folder = os.path.join(output_root, sanitize_path(url))
        save_html(content, page_folder)

        # Screenshot
        screenshots_folder = os.path.join(page_folder, "screenshots")
        os.makedirs(screenshots_folder, exist_ok=True)
        screenshot_path = os.path.join(screenshots_folder, "screenshot.png")
        await page.screenshot(path=screenshot_path, full_page=True)

        soup = BeautifulSoup(content, "lxml")

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
            next_url = urljoin(base_url, a['href'])
            if urlparse(next_url).netloc == urlparse(base_url).netloc:
                links.append(next_url)

        # فحص الروابط المعطلة
        broken_links = check_links(links)
        with open(os.path.join(page_folder, "broken_links.txt"), "w", encoding="utf-8") as f:
            for link, status in broken_links:
                f.write(f"{link} -> {status}\n")

        print(f"✅ Crawled: {url} | Depth: {depth} | CMS: {cms}")

        for link in links:
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
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await crawl(page, base_url, 0)
        await browser.close()
    save_sitemap(sitemap_urls, os.path.join(output_root, "sitemap.xml"))
    print(f"🌐 Sitemap saved to {output_root}/sitemap.xml")

await main()