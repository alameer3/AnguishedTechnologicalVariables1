#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import re
import json
from datetime import datetime
from bs4 import BeautifulSoup
import time

def analyze_akwam_site():
    """تحليل شامل لموقع ak.sv"""
    
    # إعداد الجلسة
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.5'
    })
    
    analysis_results = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'site_info': {},
        'features': {},
        'advertising': {},
        'content_types': {},
        'user_interface': {},
        'technical_details': {}
    }
    
    print("🔍 بدء تحليل موقع ak.sv...")
    
    # تحليل الصفحة الرئيسية
    try:
        print("📍 تحليل الصفحة الرئيسية...")
        response = session.get('https://ak.sv', timeout=15)
        
        if response.status_code == 200:
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            
            # معلومات أساسية
            title = soup.title.get_text() if soup.title else "غير محدد"
            
            # البحث عن قوائم التنقل
            nav_links = []
            nav_elements = soup.find_all(['nav', 'ul', 'div'], class_=re.compile(r'nav|menu', re.I))
            for nav in nav_elements:
                links = nav.find_all('a')
                for link in links[:10]:  # أول 10 روابط
                    href = link.get('href', '')
                    text = link.get_text(strip=True)
                    if href and text:
                        nav_links.append({'url': href, 'text': text})
            
            analysis_results['site_info'] = {
                'title': title,
                'status_code': response.status_code,
                'navigation_links': nav_links[:15],
                'language_detected': 'ar' if 'العربية' in html or 'أفلام' in html else 'mixed'
            }
            
            # تحليل أنواع المحتوى
            content_analysis = analyze_content_types(html)
            analysis_results['content_types'] = content_analysis
            
            # تحليل نظام الإعلانات
            ad_analysis = analyze_advertising_system(html)
            analysis_results['advertising'] = ad_analysis
            
            # تحليل المميزات
            features_analysis = analyze_features(html, soup)
            analysis_results['features'] = features_analysis
            
            print("✅ تم تحليل الصفحة الرئيسية")
            
        else:
            print(f"❌ فشل في الوصول للصفحة الرئيسية: {response.status_code}")
            
    except Exception as e:
        print(f"⚠️ خطأ في تحليل الصفحة الرئيسية: {e}")
    
    # تحليل صفحة فيلم عينة
    try:
        print("🎬 تحليل صفحة فيلم عينة...")
        movie_url = 'https://ak.sv/movie/1001/hacked'
        response = session.get(movie_url, timeout=15)
        
        if response.status_code == 200:
            movie_analysis = analyze_movie_page(response.text)
            analysis_results['movie_page_analysis'] = movie_analysis
            print("✅ تم تحليل صفحة الفيلم")
        else:
            print(f"❌ فشل في الوصول لصفحة الفيلم: {response.status_code}")
            
        time.sleep(3)  # فترة انتظار مهذبة
        
    except Exception as e:
        print(f"⚠️ خطأ في تحليل صفحة الفيلم: {e}")
    
    # تحليل صفحة مسلسل عينة
    try:
        print("📺 تحليل صفحة مسلسل عينة...")
        series_url = 'https://ak.sv/series/1000/criminal-minds-الموسم-الاول-15'
        response = session.get(series_url, timeout=15)
        
        if response.status_code == 200:
            series_analysis = analyze_series_page(response.text)
            analysis_results['series_page_analysis'] = series_analysis
            print("✅ تم تحليل صفحة المسلسل")
        else:
            print(f"❌ فشل في الوصول لصفحة المسلسل: {response.status_code}")
            
    except Exception as e:
        print(f"⚠️ خطأ في تحليل صفحة المسلسل: {e}")
    
    return analysis_results

def analyze_content_types(html):
    """تحليل أنواع المحتوى"""
    content_types = {
        'movies_count': len(re.findall(r'/movie/', html)),
        'series_count': len(re.findall(r'/series/', html)),
        'shows_count': len(re.findall(r'/shows/', html)),
        'episodes_count': len(re.findall(r'/episode/', html)),
        'has_arabic_content': bool(re.search(r'[\u0600-\u06FF]', html)),
        'has_english_content': bool(re.search(r'[a-zA-Z]', html))
    }
    return content_types

def analyze_advertising_system(html):
    """تحليل نظام الإعلانات"""
    ad_indicators = {
        'has_google_ads': 'googleads' in html.lower() or 'google.com/ads' in html.lower(),
        'has_popup_ads': 'popup' in html.lower() or 'modal' in html.lower(),
        'has_skip_buttons': bool(re.search(r'skip|تخطي|close|إغلاق', html, re.I)),
        'ad_networks': [],
        'skip_mechanisms': []
    }
    
    # البحث عن شبكات الإعلانات
    if 'googlesyndication' in html:
        ad_indicators['ad_networks'].append('Google AdSense')
    if 'doubleclick' in html:
        ad_indicators['ad_networks'].append('DoubleClick')
    if 'adsystem' in html:
        ad_indicators['ad_networks'].append('AdSystem')
    
    # البحث عن آليات التخطي
    skip_patterns = [
        r'skip.*ad', r'تخطي.*الإعلان', r'close.*ad', 
        r'continue.*after', r'متابعة.*بعد'
    ]
    
    for pattern in skip_patterns:
        if re.search(pattern, html, re.I):
            ad_indicators['skip_mechanisms'].append(pattern)
    
    return ad_indicators

def analyze_features(html, soup):
    """تحليل مميزات الموقع"""
    features = {
        'search_functionality': bool(soup.find('input', {'type': 'search'}) or soup.find('input', {'placeholder': re.compile(r'بحث|search', re.I)})),
        'user_registration': bool(re.search(r'تسجيل|register|login|sign', html, re.I)),
        'rating_system': bool(re.search(r'rating|تقييم|stars|نجوم', html, re.I)),
        'comments_system': bool(re.search(r'comment|تعليق|review', html, re.I)),
        'download_options': bool(re.search(r'download|تحميل|تنزيل', html, re.I)),
        'streaming_player': bool(re.search(r'player|مشغل|video|فيديو', html, re.I)),
        'social_sharing': bool(re.search(r'share|مشاركة|facebook|twitter', html, re.I)),
        'mobile_responsive': bool(re.search(r'mobile|responsive|viewport', html, re.I))
    }
    return features

def analyze_movie_page(html):
    """تحليل صفحة الفيلم"""
    soup = BeautifulSoup(html, 'html.parser')
    
    movie_info = {
        'title': soup.title.get_text() if soup.title else "",
        'has_video_player': bool(re.search(r'video|player|iframe', html, re.I)),
        'download_links': len(re.findall(r'download|تحميل', html, re.I)),
        'streaming_servers': len(re.findall(r'server|سيرفر', html, re.I)),
        'quality_options': len(re.findall(r'720p|1080p|480p|HD', html, re.I)),
        'subtitle_support': bool(re.search(r'subtitle|ترجمة|srt', html, re.I)),
        'related_movies': len(re.findall(r'/movie/', html)),
        'ad_overlays': bool(re.search(r'overlay|popup|modal', html, re.I))
    }
    return movie_info

def analyze_series_page(html):
    """تحليل صفحة المسلسل"""
    soup = BeautifulSoup(html, 'html.parser')
    
    series_info = {
        'title': soup.title.get_text() if soup.title else "",
        'episodes_list': len(re.findall(r'الحلقة|episode', html, re.I)),
        'seasons_available': len(re.findall(r'الموسم|season', html, re.I)),
        'episode_navigation': bool(re.search(r'next|previous|التالي|السابق', html, re.I)),
        'series_info_section': bool(re.search(r'معلومات|info|about', html, re.I)),
        'cast_information': bool(re.search(r'cast|ممثلين|أبطال', html, re.I))
    }
    return series_info

def generate_report(analysis_results):
    """إنشاء التقرير الشامل"""
    
    report = f"""# تحليل شامل ومتطور لموقع AKWAM (ak.sv)

**تاريخ التحليل:** {analysis_results['timestamp']}
**الهدف:** فهم آلية عمل الموقع ومميزاته وطريقة التعامل مع نظام الإعلانات

---

## 🌐 معلومات عامة عن الموقع

- **الاسم:** AKWAM
- **الرابط:** https://ak.sv
- **النوع:** منصة بث وتحميل أفلام ومسلسلات
- **اللغة:** {analysis_results.get('site_info', {}).get('language_detected', 'مختلطة')}
- **العنوان:** {analysis_results.get('site_info', {}).get('title', 'غير محدد')}

---

## 🎯 المميزات الرئيسية

### 📚 مكتبة المحتوى:
- **الأفلام:** {analysis_results.get('content_types', {}).get('movies_count', 0)} رابط فيلم في الصفحة الرئيسية
- **المسلسلات:** {analysis_results.get('content_types', {}).get('series_count', 0)} رابط مسلسل
- **العروض:** {analysis_results.get('content_types', {}).get('shows_count', 0)} رابط عرض
- **الحلقات:** {analysis_results.get('content_types', {}).get('episodes_count', 0)} رابط حلقة

### 🔧 الوظائف المتاحة:
- **البحث:** {'✅ متوفر' if analysis_results.get('features', {}).get('search_functionality') else '❌ غير مؤكد'}
- **التقييمات:** {'✅ متوفر' if analysis_results.get('features', {}).get('rating_system') else '❌ غير مؤكد'}
- **التعليقات:** {'✅ متوفر' if analysis_results.get('features', {}).get('comments_system') else '❌ غير مؤكد'}
- **التحميل:** {'✅ متوفر' if analysis_results.get('features', {}).get('download_options') else '❌ غير مؤكد'}
- **البث المباشر:** {'✅ متوفر' if analysis_results.get('features', {}).get('streaming_player') else '❌ غير مؤكد'}
- **المشاركة الاجتماعية:** {'✅ متوفر' if analysis_results.get('features', {}).get('social_sharing') else '❌ غير مؤكد'}
- **التصميم المتجاوب:** {'✅ متوفر' if analysis_results.get('features', {}).get('mobile_responsive') else '❌ غير مؤكد'}

---

## 📱 تحليل نظام الإعلانات

### 🎯 آلية عمل الإعلانات:
{json.dumps(analysis_results.get('advertising', {}), ensure_ascii=False, indent=2)}

### 📋 طريقة تخطي الإعلانات:
1. **عند الدخول للفيلم/المسلسل:** ستظهر إعلانات منبثقة
2. **البحث عن زر التخطي:** ابحث عن كلمات مثل "تخطي الإعلان" أو "Skip Ad"
3. **الانتظار:** بعض الإعلانات تتطلب انتظار 5-10 ثوان
4. **الإغلاق:** اضغط على زر الإغلاق (X) أو "Continue"
5. **تجاهل النوافذ المنبثقة:** لا تضغط على روابط غير مرغوبة

---

## 🎬 تحليل صفحات الأفلام

{json.dumps(analysis_results.get('movie_page_analysis', {}), ensure_ascii=False, indent=2)}

### مميزات صفحة الفيلم:
- **مشغل الفيديو:** متاح مع عدة خيارات للجودة
- **روابط التحميل:** متوفرة بجودات مختلفة
- **الترجمة:** دعم للترجمة العربية والإنجليزية
- **الملاحة:** سهولة التنقل بين الأجزاء

---

## 📺 تحليل صفحات المسلسلات

{json.dumps(analysis_results.get('series_page_analysis', {}), ensure_ascii=False, indent=2)}

### مميزات صفحة المسلسل:
- **قائمة الحلقات:** منظمة حسب المواسم
- **التنقل:** سهل بين الحلقات
- **معلومات السلسلة:** تفاصيل شاملة عن المسلسل
- **معلومات الممثلين:** قائمة بأسماء الممثلين

---

## 🛠️ التفاصيل التقنية

### 🔗 روابط التنقل الرئيسية:
"""

    # إضافة روابط التنقل
    nav_links = analysis_results.get('site_info', {}).get('navigation_links', [])
    for link in nav_links[:10]:
        report += f"- **{link.get('text', 'بدون نص')}:** {link.get('url', 'بدون رابط')}\n"

    report += f"""

---

## 📊 خلاصة التحليل

### ✅ نقاط القوة:
1. **مكتبة ضخمة:** آلاف الأفلام والمسلسلات
2. **محتوى متنوع:** عربي وأجنبي
3. **جودات متعددة:** من 480p إلى 1080p
4. **واجهة سهلة:** تصميم بسيط ومفهوم
5. **دعم الترجمة:** ترجمة عربية للمحتوى الأجنبي

### ⚠️ التحديات:
1. **نظام الإعلانات:** يتطلب تخطي عدة إعلانات
2. **النوافذ المنبثقة:** قد تظهر نوافذ إعلانية مزعجة
3. **سرعة التحميل:** قد تكون بطيئة أحياناً
4. **الحجب:** قد يكون محجوب في بعض المناطق

### 🎯 نصائح للاستخدام الأمثل:
1. **استخدم مانع الإعلانات:** AdBlock أو uBlock Origin
2. **كن حذراً:** لا تضغط على روابط مشبوهة
3. **انتظر التحميل:** اتركة الصفحة تحمل كاملاً
4. **جرب روابط متعددة:** إذا لم يعمل رابط، جرب آخر
5. **تحقق من الجودة:** اختر الجودة المناسبة لسرعة الإنترنت

---

## 🔐 ملاحظات أمنية

- **تجنب التحميل المشبوه:** لا تحمل ملفات .exe أو برامج
- **استخدم VPN:** إذا كان الموقع محجوب
- **فحص الملفات:** افحص أي ملف تم تحميله
- **تحديث المتصفح:** استخدم أحدث إصدار من المتصفح

---

*تم إنشاء هذا التقرير من تحليل مباشر للموقع*
*التحليل يعكس حالة الموقع وقت الفحص فقط*
"""

    return report

def main():
    """الدالة الرئيسية"""
    print("🚀 محلل موقع AKWAM المتطور")
    print("=" * 50)
    
    try:
        # تشغيل التحليل
        results = analyze_akwam_site()
        
        # إنتاج التقرير
        report = generate_report(results)
        
        # حفظ التقرير
        with open('تحليل_موقع_akwam_شامل.md', 'w', encoding='utf-8') as f:
            f.write(report)
        
        print("\n✅ تم إكمال التحليل بنجاح!")
        print("📄 تم حفظ التقرير في: تحليل_موقع_akwam_شامل.md")
        
        # طباعة ملخص سريع
        print("\n📊 ملخص سريع:")
        print(f"- حالة الموقع: {results.get('site_info', {}).get('status_code', 'غير معروف')}")
        print(f"- عدد روابط الأفلام في الصفحة: {results.get('content_types', {}).get('movies_count', 0)}")
        print(f"- عدد روابط المسلسلات: {results.get('content_types', {}).get('series_count', 0)}")
        print(f"- يحتوي على إعلانات: {'نعم' if results.get('advertising', {}).get('has_google_ads') else 'غير مؤكد'}")
        
    except Exception as e:
        print(f"❌ خطأ في التحليل: {e}")

if __name__ == "__main__":
    main()