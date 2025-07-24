#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
from collections import defaultdict
from urllib.parse import unquote

def analyze_and_organize_links():
    # قراءة الملف
    with open('site_links.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # استخراج جميع الروابط
    links = re.findall(r'https://ak\.sv[^\s]*', content)
    
    # تصنيف الروابط
    organized_data = {
        'الصفحات_الرئيسية': [],
        'الأفلام': [],
        'المسلسلات': [],
        'العروض_التلفزيونية': [],
        'المنوعات': [],
        'الحلقات': defaultdict(list),
        'الروابط_المرجعية': [],
        'الصفحات_الإدارية': [],
        'أخرى': []
    }
    
    # إحصائيات شاملة
    stats = {
        'إجمالي_الروابط': len(links),
        'الروابط_الفريدة': len(set(links)),
        'التكرارات': len(links) - len(set(links))
    }
    
    # تحليل وتصنيف كل رابط
    for link in links:
        link_decoded = unquote(link)
        
        if '/movie/' in link:
            # استخراج معلومات الفيلم
            match = re.search(r'/movie/(\d+)/([^?]*)', link)
            if match:
                movie_id, movie_name = match.groups()
                movie_name_decoded = unquote(movie_name)
                organized_data['الأفلام'].append({
                    'الرابط': link,
                    'المعرف': movie_id,
                    'الاسم': movie_name_decoded
                })
        
        elif '/series/' in link:
            # استخراج معلومات المسلسل
            match = re.search(r'/series/(\d+)/([^?]*)', link)
            if match:
                series_id, series_name = match.groups()
                series_name_decoded = unquote(series_name)
                organized_data['المسلسلات'].append({
                    'الرابط': link,
                    'المعرف': series_id,
                    'الاسم': series_name_decoded
                })
        
        elif '/shows/' in link:
            # استخراج معلومات العرض
            match = re.search(r'/shows/(\d+)/([^?]*)', link)
            if match:
                show_id, show_name = match.groups()
                show_name_decoded = unquote(show_name)
                organized_data['العروض_التلفزيونية'].append({
                    'الرابط': link,
                    'المعرف': show_id,
                    'الاسم': show_name_decoded
                })
        
        elif '/mix/' in link:
            # استخراج معلومات المنوعات
            match = re.search(r'/mix/(\d+)/([^?]*)', link)
            if match:
                mix_id, mix_name = match.groups()
                mix_name_decoded = unquote(mix_name)
                organized_data['المنوعات'].append({
                    'الرابط': link,
                    'المعرف': mix_id,
                    'الاسم': mix_name_decoded
                })
        
        elif '/episode/' in link:
            # استخراج معلومات الحلقة
            match = re.search(r'/episode/(\d+)/([^/]+)/([^?]*)', link)
            if match:
                episode_id, series_name, episode_name = match.groups()
                series_name_decoded = unquote(series_name)
                episode_name_decoded = unquote(episode_name)
                organized_data['الحلقات'][series_name_decoded].append({
                    'الرابط': link,
                    'معرف_الحلقة': episode_id,
                    'اسم_الحلقة': episode_name_decoded
                })
        
        elif link.endswith('/') or link == 'https://ak.sv' or '/ones' in link or link.endswith('/movies') or link.endswith('/series') or link.endswith('/shows') or link.endswith('/mix'):
            organized_data['الصفحات_الرئيسية'].append(link)
        
        elif '/#' in link:
            organized_data['الروابط_المرجعية'].append(link)
        
        elif any(page in link for page in ['/ad-policy', '/contactus', '/dmca', '/AKWAM-Notifications']):
            organized_data['الصفحات_الإدارية'].append(link)
        
        else:
            organized_data['أخرى'].append(link)
    
    return organized_data, stats

def write_organized_file(organized_data, stats):
    with open('الروابط_المنظمة_شامل.md', 'w', encoding='utf-8') as f:
        f.write('# تحليل شامل ومنظم لروابط موقع ak.sv\n\n')
        f.write(f'**تاريخ التحليل:** {__import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
        
        # كتابة الإحصائيات
        f.write('## 📊 الإحصائيات العامة\n\n')
        f.write(f'- **إجمالي الروابط:** {stats["إجمالي_الروابط"]:,}\n')
        f.write(f'- **الروابط الفريدة:** {stats["الروابط_الفريدة"]:,}\n')
        f.write(f'- **التكرارات:** {stats["التكرارات"]:,}\n\n')
        
        # كتابة التصنيفات
        f.write('## 📑 التصنيف التفصيلي\n\n')
        
        # الصفحات الرئيسية
        if organized_data['الصفحات_الرئيسية']:
            f.write('### 🏠 الصفحات الرئيسية\n\n')
            for link in sorted(set(organized_data['الصفحات_الرئيسية'])):
                f.write(f'- {link}\n')
            f.write(f'\n**المجموع:** {len(set(organized_data["الصفحات_الرئيسية"]))} صفحة\n\n')
        
        # الأفلام
        if organized_data['الأفلام']:
            f.write('### 🎬 الأفلام\n\n')
            movies_sorted = sorted(organized_data['الأفلام'], key=lambda x: int(x['المعرف']))
            for movie in movies_sorted[:50]:  # أول 50 فيلم
                f.write(f'- **{movie["الاسم"]}** (ID: {movie["المعرف"]})\n')
                f.write(f'  - {movie["الرابط"]}\n')
            
            if len(movies_sorted) > 50:
                f.write(f'\n... و {len(movies_sorted) - 50} فيلم آخر\n')
            
            f.write(f'\n**المجموع:** {len(organized_data["الأفلام"])} فيلم\n')
            f.write(f'**نطاق المعرفات:** {movies_sorted[0]["المعرف"]} - {movies_sorted[-1]["المعرف"]}\n\n')
        
        # المسلسلات
        if organized_data['المسلسلات']:
            f.write('### 📺 المسلسلات\n\n')
            series_sorted = sorted(organized_data['المسلسلات'], key=lambda x: int(x['المعرف']))
            for series in series_sorted[:30]:  # أول 30 مسلسل
                f.write(f'- **{series["الاسم"]}** (ID: {series["المعرف"]})\n')
                f.write(f'  - {series["الرابط"]}\n')
            
            if len(series_sorted) > 30:
                f.write(f'\n... و {len(series_sorted) - 30} مسلسل آخر\n')
            
            f.write(f'\n**المجموع:** {len(organized_data["المسلسلات"])} مسلسل\n')
            f.write(f'**نطاق المعرفات:** {series_sorted[0]["المعرف"]} - {series_sorted[-1]["المعرف"]}\n\n')
        
        # العروض التلفزيونية
        if organized_data['العروض_التلفزيونية']:
            f.write('### 📡 العروض التلفزيونية\n\n')
            shows_sorted = sorted(organized_data['العروض_التلفزيونية'], key=lambda x: int(x['المعرف']))
            for show in shows_sorted[:20]:  # أول 20 عرض
                f.write(f'- **{show["الاسم"]}** (ID: {show["المعرف"]})\n')
                f.write(f'  - {show["الرابط"]}\n')
            
            if len(shows_sorted) > 20:
                f.write(f'\n... و {len(shows_sorted) - 20} عرض آخر\n')
            
            f.write(f'\n**المجموع:** {len(organized_data["العروض_التلفزيونية"])} عرض\n\n')
        
        # المنوعات
        if organized_data['المنوعات']:
            f.write('### 🎭 المنوعات\n\n')
            for mix_item in organized_data['المنوعات']:
                f.write(f'- **{mix_item["الاسم"]}** (ID: {mix_item["المعرف"]})\n')
                f.write(f'  - {mix_item["الرابط"]}\n')
            f.write(f'\n**المجموع:** {len(organized_data["المنوعات"])} عنصر\n\n')
        
        # الحلقات (مجمعة حسب المسلسل)
        if organized_data['الحلقات']:
            f.write('### 🎞️ الحلقات (مرتبة حسب المسلسل)\n\n')
            episodes_by_series = dict(organized_data['الحلقات'])
            
            # ترتيب المسلسلات حسب عدد الحلقات
            series_by_episode_count = sorted(episodes_by_series.items(), 
                                           key=lambda x: len(x[1]), reverse=True)
            
            total_episodes = sum(len(episodes) for episodes in episodes_by_series.values())
            f.write(f'**إجمالي الحلقات:** {total_episodes}\n')
            f.write(f'**عدد المسلسلات:** {len(episodes_by_series)}\n\n')
            
            for series_name, episodes in series_by_episode_count[:10]:  # أكثر 10 مسلسلات
                f.write(f'#### {series_name} ({len(episodes)} حلقة)\n\n')
                for episode in sorted(episodes, key=lambda x: int(x['معرف_الحلقة']))[:10]:
                    f.write(f'- {episode["اسم_الحلقة"]} (ID: {episode["معرف_الحلقة"]})\n')
                if len(episodes) > 10:
                    f.write(f'  ... و {len(episodes) - 10} حلقة أخرى\n')
                f.write('\n')
        
        # الروابط المرجعية
        if organized_data['الروابط_المرجعية']:
            f.write('### 🔗 الروابط المرجعية (Fragments)\n\n')
            for link in sorted(set(organized_data['الروابط_المرجعية'])):
                f.write(f'- {link}\n')
            f.write(f'\n**المجموع:** {len(set(organized_data["الروابط_المرجعية"]))} رابط\n\n')
        
        # الصفحات الإدارية
        if organized_data['الصفحات_الإدارية']:
            f.write('### ⚙️ الصفحات الإدارية\n\n')
            for link in sorted(set(organized_data['الصفحات_الإدارية'])):
                f.write(f'- {link}\n')
            f.write(f'\n**المجموع:** {len(set(organized_data["الصفحات_الإدارية"]))} صفحة\n\n')
        
        # روابط أخرى
        if organized_data['أخرى']:
            f.write('### ❓ روابط أخرى\n\n')
            for link in sorted(set(organized_data['أخرى']))[:20]:
                f.write(f'- {link}\n')
            if len(set(organized_data['أخرى'])) > 20:
                f.write(f'\n... و {len(set(organized_data["أخرى"])) - 20} رابط آخر\n')
            f.write(f'\n**المجموع:** {len(set(organized_data["أخرى"]))} رابط\n\n')
        
        f.write('---\n\n')
        f.write('*تم إنشاء هذا التقرير تلقائياً من تحليل ملف site_links.txt*\n')

if __name__ == '__main__':
    print("جاري تحليل وتنظيم الروابط...")
    organized_data, stats = analyze_and_organize_links()
    write_organized_file(organized_data, stats)
    print("تم إنشاء الملف المنظم: الروابط_المنظمة_شامل.md")
    print(f"تم تحليل {stats['إجمالي_الروابط']:,} رابط")
