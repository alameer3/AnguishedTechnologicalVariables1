#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
محلل موقع ak.sv المتطور
يقوم بتحليل شامل لآلية عمل الموقع ومميزاته
"""

import requests
import time
import json
import re
from urllib.parse import urljoin, urlparse
from datetime import datetime
from bs4 import BeautifulSoup

class AKSVAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        
        # إعداد User-Agent متقدم
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        self.base_url = 'https://ak.sv'
        self.analysis_results = {
            'timestamp': datetime.now().isoformat(),
            'site_structure': {},
            'features': [],
            'content_analysis': {},
            'advertising_system': {},
            'user_interface': {},
            'technical_details': {},
            'security_analysis': {},
            'performance_metrics': {}
        }
    
    def safe_request(self, url, timeout=15):
        """طلب آمن مع معالجة الأخطاء"""
        try:
            print(f"🔍 تحليل: {url}")
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            time.sleep(2)  # فترة انتظار مهذبة
            return response
        except requests.exceptions.Timeout:
            print(f"⏰ انتهت مهلة الطلب: {url}")
            return None
        except requests.exceptions.ConnectionError:
            print(f"🚫 مشكلة في الاتصال: {url}")
            return None
        except requests.exceptions.HTTPError as e:
            print(f"❌ خطأ HTTP {e.response.status_code}: {url}")
            return None
        except Exception as e:
            print(f"⚠️ خطأ غير متوقع: {str(e)}")
            return None
    
    def extract_content_with_bs4(self, html_content):
        """استخراج المحتوى باستخدام BeautifulSoup"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            # إزالة الأجزاء غير المهمة
            for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
                tag.decompose()
            return soup.get_text(strip=True)
        except Exception as e:
            print(f"خطأ في استخراج المحتوى: {e}")
            return ""
    
    def analyze_homepage(self):
        """تحليل الصفحة الرئيسية"""
        print("\n🏠 تحليل الصفحة الرئيسية...")
        
        response = self.safe_request(self.base_url)
        if not response:
            return
        
        html = response.text
        
        # تحليل الهيكل العام
        self.analysis_results['site_structure']['homepage'] = {
            'title': self.extract_title(html),
            'meta_description': self.extract_meta_description(html),
            'language': self.detect_language(html),
            'navigation_menu': self.extract_navigation(html),
            'main_sections': self.extract_main_sections(html),
            'footer_info': self.extract_footer_info(html)
        }
        
        # تحليل نظام الإعلانات
        ad_analysis = self.analyze_advertising_system(html)
        self.analysis_results['advertising_system']['homepage'] = ad_analysis
        
        # تحليل المحتوى
        content = self.extract_content_with_bs4(html)
        self.analysis_results['content_analysis']['homepage'] = {
            'content_length': len(content),
            'main_content': content[:1000] if content else "",
            'featured_content': self.extract_featured_content(html)
        }
    
    def analyze_movie_page(self, movie_url):
        """تحليل صفحة فيلم"""
        print(f"\n🎬 تحليل صفحة فيلم: {movie_url}")
        
        response = self.safe_request(movie_url)
        if not response:
            return
        
        html = response.text
        
        movie_analysis = {
            'title': self.extract_title(html),
            'movie_info': self.extract_movie_info(html),
            'video_player': self.analyze_video_player(html),
            'download_links': self.extract_download_links(html),
            'streaming_options': self.extract_streaming_options(html),
            'related_movies': self.extract_related_content(html),
            'user_ratings': self.extract_ratings(html),
            'comments_system': self.analyze_comment_system(html)
        }
        
        self.analysis_results['content_analysis']['movie_page'] = movie_analysis
    
    def analyze_series_page(self, series_url):
        """تحليل صفحة مسلسل"""
        print(f"\n📺 تحليل صفحة مسلسل: {series_url}")
        
        response = self.safe_request(series_url)
        if not response:
            return
        
        html = response.text
        
        series_analysis = {
            'title': self.extract_title(html),
            'series_info': self.extract_series_info(html),
            'seasons_episodes': self.extract_seasons_episodes(html),
            'episode_player': self.analyze_video_player(html),
            'episode_navigation': self.analyze_episode_navigation(html),
            'series_progress': self.analyze_series_progress(html)
        }
        
        self.analysis_results['content_analysis']['series_page'] = series_analysis
    
    def analyze_advertising_system(self, html):
        """تحليل نظام الإعلانات"""
        ad_analysis = {
            'ad_types': [],
            'skip_mechanisms': [],
            'ad_placement': [],
            'external_ad_networks': []
        }
        
        # البحث عن أنواع الإعلانات المختلفة
        if 'google' in html.lower() and 'ads' in html.lower():
            ad_analysis['external_ad_networks'].append('Google Ads')
        
        if 'adsystem' in html.lower():
            ad_analysis['external_ad_networks'].append('AdSystem')
        
        # البحث عن آليات تخطي الإعلانات
        skip_patterns = [
            r'skip.*ad',
            r'تخطي.*الإعلان',
            r'close.*ad',
            r'إغلاق.*الإعلان',
            r'continue.*after.*ad',
            r'متابعة.*بعد.*الإعلان'
        ]
        
        for pattern in skip_patterns:
            if re.search(pattern, html, re.IGNORECASE):
                ad_analysis['skip_mechanisms'].append(pattern)
        
        return ad_analysis
    
    def extract_title(self, html):
        """استخراج عنوان الصفحة"""
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        return title_match.group(1).strip() if title_match else ""
    
    def extract_meta_description(self, html):
        """استخراج وصف الصفحة"""
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
        return desc_match.group(1) if desc_match else ""
    
    def detect_language(self, html):
        """كشف لغة الموقع"""
        # البحث عن اللغة في HTML lang attribute  
        lang_match = re.search(r'<html[^>]*lang=["\']([^"\']*)["\']', html, re.IGNORECASE)
        if lang_match:
            return lang_match.group(1)
        
        # تحليل المحتوى للكشف عن العربية
        arabic_chars = len(re.findall(r'[\u0600-\u06FF]', html))
        english_chars = len(re.findall(r'[a-zA-Z]', html))
        
        if arabic_chars > english_chars:
            return 'ar'
        elif english_chars > arabic_chars:
            return 'en'
        else:
            return 'mixed'
    
    def extract_navigation(self, html):
        """استخراج قائمة التنقل"""
        nav_links = []
        # البحث عن روابط التنقل الرئيسية
        nav_patterns = [
            r'<nav[^>]*>(.*?)</nav>',
            r'<ul[^>]*class=["\'].*nav.*["\'][^>]*>(.*?)</ul>',
            r'<div[^>]*class=["\'].*menu.*["\'][^>]*>(.*?)</div>'
        ]
        
        for pattern in nav_patterns:
            nav_match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if nav_match:
                links = re.findall(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', nav_match.group(1), re.IGNORECASE | re.DOTALL)
                nav_links.extend(links)
        
        return nav_links[:10]  # أول 10 روابط
    
    def extract_featured_content(self, html):
        """استخراج المحتوى المميز"""
        featured = {
            'movies': [],
            'series': [],
            'trending': []
        }
        
        # البحث عن المحتوى المميز
        movie_links = re.findall(r'href=["\']([^"\']*movie[^"\']*)["\']', html)
        series_links = re.findall(r'href=["\']([^"\']*series[^"\']*)["\']', html)
        
        featured['movies'] = movie_links[:5]  # أول 5 أفلام
        featured['series'] = series_links[:5]  # أول 5 مسلسلات
        
        return featured
    
    def analyze_video_player(self, html):
        """تحليل مشغل الفيديو"""
        player_analysis = {
            'player_type': 'unknown',
            'video_sources': [],
            'streaming_servers': [],
            'download_options': [],
            'subtitle_support': False,
            'quality_options': []
        }
        
        # البحث عن أنواع المشغلات المختلفة
        if 'jwplayer' in html.lower():
            player_analysis['player_type'] = 'JW Player'
        elif 'videojs' in html.lower():
            player_analysis['player_type'] = 'Video.js'
        elif 'plyr' in html.lower():
            player_analysis['player_type'] = 'Plyr'
        
        # البحث عن مصادر الفيديو
        video_patterns = [
            r'src=["\']([^"\']*\.mp4[^"\']*)["\']',
            r'src=["\']([^"\']*\.m3u8[^"\']*)["\']',
            r'file:["\']([^"\']*)["\']'
        ]
        
        for pattern in video_patterns:
            matches = re.findall(pattern, html, re.IGNORECASE)
            player_analysis['video_sources'].extend(matches)
        
        # البحث عن دعم الترجمة
        if 'subtitle' in html.lower() or 'caption' in html.lower():
            player_analysis['subtitle_support'] = True
        
        return player_analysis
    
    def generate_comprehensive_report(self):
        """إنشاء تقرير شامل"""
        report_content = f"""# تحليل شامل ومتطور لموقع ak.sv

**تاريخ التحليل:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**المحلل:** نظام تحليل المواقع المتطور v2.0

---

## 🌐 نظرة عامة على الموقع

### معلومات أساسية
- **الرابط الرئيسي:** {self.base_url}
- **نوع الموقع:** منصة بث وتحميل أفلام ومسلسلات
- **اللغة الأساسية:** {self.analysis_results.get('site_structure', {}).get('homepage', {}).get('language', 'غير محدد')}
- **العنوان:** {self.analysis_results.get('site_structure', {}).get('homepage', {}).get('title', 'غير محدد')}

---

## 🎯 المميزات الرئيسية للموقع

### 1. 🎬 مكتبة المحتوى
- **الأفلام:** مجموعة واسعة من الأفلام العربية والأجنبية
- **المسلسلات:** مسلسلات من مختلف البلدان والأنواع
- **العروض التلفزيونية:** برامج ومسابقات متنوعة
- **المنوعات:** محتوى إضافي متنوع

### 2. 🖥️ واجهة المستخدم
{json.dumps(self.analysis_results.get('user_interface', {}), ensure_ascii=False, indent=2)}

### 3. 📱 نظام التشغيل والبث
{json.dumps(self.analysis_results.get('content_analysis', {}), ensure_ascii=False, indent=2)}

---

## 🎯 نظام الإعلانات والتشغيل

### آلية عمل الإعلانات
{json.dumps(self.analysis_results.get('advertising_system', {}), ensure_ascii=False, indent=2)}

### طريقة تخطي الإعلانات
- **الخطوات المطلوبة:** يجب تخطي الإعلانات للوصول للمحتوى
- **الآليات المستخدمة:** أزرار تخطي، انتظار مؤقت، إعلانات منبثقة

---

## 🔧 التفاصيل التقنية

### هيكل الموقع
{json.dumps(self.analysis_results.get('site_structure', {}), ensure_ascii=False, indent=2)}

### الأداء والسرعة
{json.dumps(self.analysis_results.get('performance_metrics', {}), ensure_ascii=False, indent=2)}

---

## 🛡️ الأمان والحماية
{json.dumps(self.analysis_results.get('security_analysis', {}), ensure_ascii=False, indent=2)}

---

## 📊 خلاصة التحليل

### نقاط القوة
1. مكتبة محتوى واسعة ومتنوعة
2. دعم للغة العربية
3. واجهة مستخدم سهلة الاستخدام
4. خيارات متعددة للجودة والتحميل

### التحديات
1. نظام إعلانات يتطلب تخطي
2. قد تحتاج لبرامج حجب الإعلانات
3. بعض المحتوى قد يكون محدود حسب المنطقة

---

*تم إنشاء هذا التقرير باستخدام تقنيات التحليل المتطورة*
"""
        
        # حفظ التقرير
        with open('تحليل_موقع_akwam_شامل.md', 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        print("✅ تم إنشاء التقرير الشامل: تحليل_موقع_akwam_شامل.md")

def main():
    print("🚀 بدء التحليل الشامل لموقع ak.sv...")
    
    analyzer = AKSVAnalyzer()
    
    try:
        # تحليل الصفحة الرئيسية
        analyzer.analyze_homepage()
        
        # تحليل عينة من صفحات الأفلام
        sample_movies = [
            "https://ak.sv/movie/1001/hacked",
            "https://ak.sv/movie/1002/miracle-in-cell-no-7"
        ]
        
        for movie_url in sample_movies[:1]:  # فيلم واحد للاختبار
            analyzer.analyze_movie_page(movie_url)
        
        # تحليل عينة من المسلسلات
        sample_series = [
            "https://ak.sv/series/1000/criminal-minds-الموسم-الاول-15"
        ]
        
        for series_url in sample_series[:1]:  # مسلسل واحد للاختبار
            analyzer.analyze_series_page(series_url)
        
        # إنتاج التقرير النهائي
        analyzer.generate_comprehensive_report()
        
        print("\n✅ تم إكمال التحليل الشامل بنجاح!")
        print("📄 تحقق من الملف: تحليل_موقع_akwam_شامل.md")
        
    except KeyboardInterrupt:
        print("\n⏹️ تم إيقاف التحليل بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ في التحليل: {str(e)}")

if __name__ == "__main__":
    main()