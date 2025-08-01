#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة بسيطة لتحليل المواقع وأخذ لقطات شاشة
Simple Website Screenshot Tool for Replit
تعمل بدون متطلبات معقدة
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
import json
import time
from datetime import datetime
from fake_useragent import UserAgent
import xml.etree.ElementTree as ET
import re

class SimpleWebsiteAnalyzer:
    """أداة تحليل بسيطة للمواقع"""
    
    def __init__(self, base_url="https://ak.sv/", output_dir="simple_site_analysis"):
        self.base_url = base_url
        self.output_dir = output_dir
        self.ua = UserAgent()
        self.session = self._setup_session()
        self.visited_urls = set()
        self.analyzed_pages = []
        self.failed_urls = []
        
        # إحصائيات
        self.stats = {
            'total_pages': 0,
            'successful_pages': 0,
            'failed_pages': 0,
            'images_found': 0,
            'links_found': 0,
            'start_time': None,
            'end_time': None
        }
        
        # إنشاء المجلدات
        self._create_directories()
    
    def _setup_session(self):
        """إعداد جلسة HTTP محسنة"""
        session = requests.Session()
        session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ar,en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        return session
    
    def _create_directories(self):
        """إنشاء المجلدات المطلوبة"""
        directories = [
            self.output_dir,
            os.path.join(self.output_dir, "html_pages"),
            os.path.join(self.output_dir, "page_data"),
            os.path.join(self.output_dir, "assets_info"),
            os.path.join(self.output_dir, "reports")
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def sanitize_filename(self, text, max_length=100):
        """تنظيف النص لاستخدامه كاسم ملف"""
        if not text:
            return "unknown"
        
        # إزالة الأحرف الخاصة
        safe_name = re.sub(r'[^\w\-_.]', '_', text)
        safe_name = re.sub(r'_+', '_', safe_name).strip('_')
        
        if len(safe_name) > max_length:
            safe_name = safe_name[:max_length]
            
        return safe_name or "unknown"
    
    def get_page_id(self, url):
        """الحصول على معرف الصفحة"""
        try:
            parsed = urlparse(url)
            path = parsed.path.strip("/") or "home"
            query = parsed.query
            
            page_id = self.sanitize_filename(path)
            if query:
                query_safe = self.sanitize_filename(query)
                page_id += f"_q_{query_safe}"
                
            return page_id
        except:
            return f"page_{len(self.visited_urls)}"
    
    def analyze_page(self, url, max_retries=3):
        """تحليل صفحة واحدة"""
        if url in self.visited_urls:
            return None
            
        self.visited_urls.add(url)
        self.stats['total_pages'] += 1
        
        for attempt in range(max_retries):
            try:
                print(f"🔍 تحليل: {url} (المحاولة {attempt + 1})")
                
                response = self.session.get(url, timeout=15)
                response.raise_for_status()
                
                # تحليل المحتوى
                soup = BeautifulSoup(response.content, 'html.parser')
                page_id = self.get_page_id(url)
                
                # استخراج البيانات
                page_data = self._extract_page_data(soup, url, response)
                
                # حفظ HTML
                self._save_html(response.text, page_id, url)
                
                # حفظ بيانات الصفحة
                self._save_page_data(page_data, page_id)
                
                # حفظ معلومات الأصول
                self._save_assets_info(page_data['assets'], page_id)
                
                self.analyzed_pages.append(page_data)
                self.stats['successful_pages'] += 1
                
                print(f"✅ تم تحليل: {url}")
                return page_data
                
            except requests.exceptions.RequestException as e:
                print(f"❌ خطأ في الطلب للصفحة {url}: {e}")
                if attempt == max_retries - 1:
                    self.failed_urls.append({'url': url, 'error': str(e)})
                    self.stats['failed_pages'] += 1
                else:
                    time.sleep(2)  # انتظار قبل المحاولة التالية
                    
            except Exception as e:
                print(f"❌ خطأ عام في تحليل {url}: {e}")
                self.failed_urls.append({'url': url, 'error': str(e)})
                self.stats['failed_pages'] += 1
                break
        
        return None
    
    def _extract_page_data(self, soup, url, response):
        """استخراج بيانات الصفحة"""
        # العنوان والوصف
        title = soup.title.string.strip() if soup.title else "بدون عنوان"
        
        meta_description = ""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            meta_description = meta_desc.get('content', '')
        
        # العناوين
        headings = {
            'h1': [h.get_text(strip=True) for h in soup.find_all('h1')],
            'h2': [h.get_text(strip=True) for h in soup.find_all('h2')],
            'h3': [h.get_text(strip=True) for h in soup.find_all('h3')]
        }
        
        # الروابط
        links = []
        for a in soup.find_all('a', href=True):
            href = a.get('href')
            if href:
                full_url = urljoin(url, href)
                links.append({
                    'href': full_url,
                    'text': a.get_text(strip=True),
                    'title': a.get('title', '')
                })
        
        # الصور
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src:
                full_src = urljoin(url, src)
                images.append({
                    'src': full_src,
                    'alt': img.get('alt', ''),
                    'title': img.get('title', ''),
                    'width': img.get('width', ''),
                    'height': img.get('height', '')
                })
        
        # معلومات أخرى
        forms = len(soup.find_all('form'))
        scripts = len(soup.find_all('script'))
        stylesheets = len(soup.find_all('link', rel='stylesheet'))
        
        # تحديث الإحصائيات
        self.stats['images_found'] += len(images)
        self.stats['links_found'] += len(links)
        
        return {
            'url': url,
            'title': title,
            'meta_description': meta_description,
            'status_code': response.status_code,
            'content_length': len(response.content),
            'timestamp': datetime.now().isoformat(),
            'headings': headings,
            'links': links,
            'images': images,
            'assets': {
                'forms_count': forms,
                'scripts_count': scripts,
                'stylesheets_count': stylesheets,
                'images_count': len(images),
                'links_count': len(links)
            },
            'page_text_length': len(soup.get_text()),
            'response_headers': dict(response.headers)
        }
    
    def _save_html(self, content, page_id, url):
        """حفظ محتوى HTML"""
        try:
            html_file = os.path.join(self.output_dir, "html_pages", f"{page_id}.html")
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # حفظ معلومات الصفحة
            info_file = os.path.join(self.output_dir, "html_pages", f"{page_id}_info.txt")
            with open(info_file, 'w', encoding='utf-8') as f:
                f.write(f"URL: {url}\n")
                f.write(f"Page ID: {page_id}\n")
                f.write(f"Saved: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Content Length: {len(content)} characters\n")
                
        except Exception as e:
            print(f"خطأ في حفظ HTML لـ {page_id}: {e}")
    
    def _save_page_data(self, page_data, page_id):
        """حفظ بيانات الصفحة"""
        try:
            data_file = os.path.join(self.output_dir, "page_data", f"{page_id}_data.json")
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(page_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"خطأ في حفظ بيانات الصفحة {page_id}: {e}")
    
    def _save_assets_info(self, assets_info, page_id):
        """حفظ معلومات الأصول"""
        try:
            assets_file = os.path.join(self.output_dir, "assets_info", f"{page_id}_assets.json")
            with open(assets_file, 'w', encoding='utf-8') as f:
                json.dump(assets_info, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"خطأ في حفظ معلومات الأصول {page_id}: {e}")
    
    def discover_pages(self, start_url, max_pages=20, max_depth=2):
        """اكتشاف صفحات الموقع"""
        discovered_urls = set([start_url])
        current_depth = 0
        
        while current_depth < max_depth and len(discovered_urls) < max_pages:
            current_level_urls = list(discovered_urls - self.visited_urls)
            if not current_level_urls:
                break
                
            print(f"🌐 مستوى العمق {current_depth + 1}: معالجة {len(current_level_urls)} صفحة")
            
            new_urls = set()
            for url in current_level_urls[:max_pages]:
                page_data = self.analyze_page(url)
                if page_data:
                    # استخراج روابط جديدة من نفس النطاق
                    for link in page_data['links']:
                        link_url = link['href']
                        if self._is_same_domain(link_url, start_url) and link_url not in discovered_urls:
                            new_urls.add(link_url)
                
                if len(discovered_urls) >= max_pages:
                    break
            
            discovered_urls.update(new_urls)
            current_depth += 1
            
            # تحديد عدد الصفحات الجديدة المكتشفة
            print(f"🔍 تم اكتشاف {len(new_urls)} رابط جديد")
        
        return discovered_urls
    
    def _is_same_domain(self, url1, url2):
        """فحص ما إذا كان الرابطان من نفس النطاق"""
        try:
            domain1 = urlparse(url1).netloc
            domain2 = urlparse(url2).netloc
            return domain1 == domain2
        except:
            return False
    
    def generate_sitemap(self):
        """إنشاء خريطة الموقع XML"""
        try:
            sitemap_path = os.path.join(self.output_dir, "sitemap.xml")
            
            urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
            
            for page_data in self.analyzed_pages:
                url_element = ET.SubElement(urlset, "url")
                loc = ET.SubElement(url_element, "loc")
                loc.text = page_data['url']
                
                lastmod = ET.SubElement(url_element, "lastmod")
                lastmod.text = datetime.now().strftime('%Y-%m-%d')
            
            tree = ET.ElementTree(urlset)
            tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)
            
            print(f"📄 تم إنشاء خريطة الموقع: {sitemap_path}")
            
        except Exception as e:
            print(f"خطأ في إنشاء خريطة الموقع: {e}")
    
    def generate_reports(self):
        """إنشاء التقارير النهائية"""
        try:
            self.stats['end_time'] = datetime.now()
            if self.stats['start_time']:
                duration = self.stats['end_time'] - self.stats['start_time']
                self.stats['duration_seconds'] = duration.total_seconds()
            
            # تقرير JSON مفصل
            detailed_report = {
                'موقع_التحليل': self.base_url,
                'الإحصائيات': self.stats,
                'الصفحات_المحللة': self.analyzed_pages,
                'الروابط_الفاشلة': self.failed_urls,
                'ملخص_الأصول': {
                    'إجمالي_الصور': self.stats['images_found'],
                    'إجمالي_الروابط': self.stats['links_found']
                }
            }
            
            report_file = os.path.join(self.output_dir, "reports", "detailed_report.json")
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(detailed_report, f, ensure_ascii=False, indent=2)
            
            # تقرير نصي مبسط
            summary_file = os.path.join(self.output_dir, "reports", "summary_report.txt")
            with open(summary_file, 'w', encoding='utf-8') as f:
                f.write(f"""
تقرير تحليل الموقع
==================

الموقع المحلل: {self.base_url}
وقت التحليل: {self.stats['end_time'].strftime('%Y-%m-%d %H:%M:%S')}
مدة التحليل: {self.stats.get('duration_seconds', 0):.2f} ثانية

الإحصائيات:
- إجمالي الصفحات: {self.stats['total_pages']}
- صفحات ناجحة: {self.stats['successful_pages']}
- صفحات فاشلة: {self.stats['failed_pages']}
- إجمالي الصور: {self.stats['images_found']}
- إجمالي الروابط: {self.stats['links_found']}

معدل النجاح: {(self.stats['successful_pages'] / max(self.stats['total_pages'], 1)) * 100:.1f}%

الملفات المُنشأة:
- صفحات HTML: {os.path.join(self.output_dir, "html_pages")}
- بيانات الصفحات: {os.path.join(self.output_dir, "page_data")}
- معلومات الأصول: {os.path.join(self.output_dir, "assets_info")}
- خريطة الموقع: {os.path.join(self.output_dir, "sitemap.xml")}
""")
            
            print(f"📊 تم إنشاء التقارير في: {os.path.join(self.output_dir, 'reports')}")
            
        except Exception as e:
            print(f"خطأ في إنشاء التقارير: {e}")
    
    def run_full_analysis(self, max_pages=20, max_depth=2):
        """تشغيل التحليل الكامل"""
        self.stats['start_time'] = datetime.now()
        
        print(f"🚀 بدء تحليل الموقع: {self.base_url}")
        print(f"📊 معاملات التحليل: {max_pages} صفحة، عمق {max_depth}")
        print("-" * 60)
        
        try:
            # اكتشاف وتحليل الصفحات
            discovered_urls = self.discover_pages(self.base_url, max_pages, max_depth)
            
            print(f"\n📈 ملخص النتائج:")
            print(f"- تم اكتشاف: {len(discovered_urls)} رابط")
            print(f"- تم تحليل: {self.stats['successful_pages']} صفحة بنجاح")
            print(f"- فشل في: {self.stats['failed_pages']} صفحة")
            
            # إنشاء خريطة الموقع
            self.generate_sitemap()
            
            # إنشاء التقارير
            self.generate_reports()
            
            print(f"\n✅ تم الانتهاء من التحليل!")
            print(f"📁 النتائج محفوظة في: {self.output_dir}")
            
            return True
            
        except Exception as e:
            print(f"❌ خطأ عام في التحليل: {e}")
            return False

def main():
    """الدالة الرئيسية للتشغيل"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                   أداة تحليل المواقع البسيطة                  ║
║              Simple Website Analysis Tool                    ║
║                                                              ║
║        مطورة خصيصاً لبيئة Replit - تعمل بدون تعقيدات         ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    # الحصول على المعاملات من المستخدم
    base_url = input("أدخل رابط الموقع (Enter للافتراضي https://ak.sv/): ").strip()
    if not base_url:
        base_url = "https://ak.sv/"
    
    output_dir = input("مجلد الحفظ (Enter للافتراضي simple_site_analysis): ").strip()
    if not output_dir:
        output_dir = "simple_site_analysis"
    
    try:
        max_pages = int(input("عدد الصفحات القصوى (Enter للافتراضي 20): ").strip() or "20")
    except ValueError:
        max_pages = 20
    
    try:
        max_depth = int(input("عمق التحليل (Enter للافتراضي 2): ").strip() or "2")
    except ValueError:
        max_depth = 2
    
    # إنشاء وتشغيل الأداة
    analyzer = SimpleWebsiteAnalyzer(base_url=base_url, output_dir=output_dir)
    
    try:
        result = analyzer.run_full_analysis(max_pages=max_pages, max_depth=max_depth)
        if result:
            print("\n🎉 تم التحليل بنجاح!")
        else:
            print("\n❌ فشل التحليل")
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف التحليل بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")

if __name__ == "__main__":
    main()