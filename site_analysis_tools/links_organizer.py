#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
منظم الروابط - ترتيب وتنظيم روابط موقع AKWAM
"""

import re
import urllib.parse
from collections import defaultdict

def organize_links():
    """تنظيم وترتيب الروابط حسب النوع"""
    
    # قراءة الملف الأصلي
    with open('site_links.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.strip().split('\n')
    all_links = []
    
    # استخراج الروابط
    for line in lines:
        line = line.strip()
        if line.startswith('https://ak.sv/'):
            all_links.append(line)
    
    # تصنيف الروابط
    organized_links = {
        'main_pages': [],
        'movies': [],
        'series': [],
        'episodes': [],
        'shows': [],
        'persons': [],
        'mix': [],
        'others': []
    }
    
    for link in all_links:
        if '/movie/' in link:
            organized_links['movies'].append(link)
        elif '/series/' in link:
            organized_links['series'].append(link)
        elif '/episode/' in link:
            organized_links['episodes'].append(link)
        elif '/shows/' in link or '/show/' in link:
            organized_links['shows'].append(link)
        elif '/person/' in link:
            organized_links['persons'].append(link)
        elif '/mix/' in link:
            organized_links['mix'].append(link)
        elif link.count('/') == 3:  # صفحات رئيسية
            organized_links['main_pages'].append(link)
        else:
            organized_links['others'].append(link)
    
    # ترتيب كل فئة حسب ID إن وجد
    def extract_id(link):
        """استخراج ID من الرابط للترتيب"""
        match = re.search(r'/(?:movie|series|episode|person|shows?|mix)/(\d+)/', link)
        return int(match.group(1)) if match else 0
    
    # ترتيب الفئات
    organized_links['movies'].sort(key=extract_id)
    organized_links['series'].sort(key=extract_id)
    organized_links['episodes'].sort(key=extract_id)
    organized_links['shows'].sort(key=extract_id)
    organized_links['persons'].sort(key=extract_id)
    organized_links['mix'].sort(key=extract_id)
    organized_links['main_pages'].sort()
    organized_links['others'].sort()
    
    # إنشاء الملف المرتب
    output_content = []
    
    # العنوان
    output_content.append("# روابط موقع AKWAM مرتبة ومنظمة")
    output_content.append("=" * 50)
    output_content.append(f"إجمالي الروابط: {len(all_links):,}")
    output_content.append("")
    
    # الفهرس
    output_content.append("## الفهرس")
    output_content.append("-" * 20)
    output_content.append(f"1. الصفحات الرئيسية ({len(organized_links['main_pages']):,})")
    output_content.append(f"2. الأفلام ({len(organized_links['movies']):,})")
    output_content.append(f"3. المسلسلات ({len(organized_links['series']):,})")
    output_content.append(f"4. الحلقات ({len(organized_links['episodes']):,})")
    output_content.append(f"5. العروض التلفزيونية ({len(organized_links['shows']):,})")
    output_content.append(f"6. الأشخاص/الممثلين ({len(organized_links['persons']):,})")
    output_content.append(f"7. المنوعات ({len(organized_links['mix']):,})")
    output_content.append(f"8. أخرى ({len(organized_links['others']):,})")
    output_content.append("")
    
    # الصفحات الرئيسية
    if organized_links['main_pages']:
        output_content.append("## 1. الصفحات الرئيسية")
        output_content.append("-" * 30)
        for link in organized_links['main_pages']:
            output_content.append(link)
        output_content.append("")
    
    # الأفلام
    if organized_links['movies']:
        output_content.append("## 2. الأفلام")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['movies'], 1):
            # استخراج معلومات الفيلم
            match = re.search(r'/movie/(\d+)/(.+)', link)
            if match:
                movie_id = match.group(1)
                title = urllib.parse.unquote(match.group(2))
                output_content.append(f"{i:4d}. [{movie_id:>5}] {title}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
            
            # فاصل كل 100 فيلم
            if i % 100 == 0:
                output_content.append("")
        output_content.append("")
    
    # المسلسلات
    if organized_links['series']:
        output_content.append("## 3. المسلسلات")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['series'], 1):
            match = re.search(r'/series/(\d+)/(.+)', link)
            if match:
                series_id = match.group(1)
                title = urllib.parse.unquote(match.group(2))
                output_content.append(f"{i:4d}. [{series_id:>5}] {title}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
            
            if i % 50 == 0:
                output_content.append("")
        output_content.append("")
    
    # الحلقات
    if organized_links['episodes']:
        output_content.append("## 4. الحلقات")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['episodes'], 1):
            parts = link.split('/')
            if len(parts) >= 6:
                episode_id = parts[4]
                series_name = urllib.parse.unquote(parts[5]) if len(parts) > 5 else ''
                episode_name = urllib.parse.unquote(parts[6]) if len(parts) > 6 else ''
                output_content.append(f"{i:4d}. [{episode_id:>5}] {series_name} - {episode_name}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
            
            if i % 50 == 0:
                output_content.append("")
        output_content.append("")
    
    # العروض التلفزيونية
    if organized_links['shows']:
        output_content.append("## 5. العروض التلفزيونية")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['shows'], 1):
            match = re.search(r'/shows?/(\d+)/(.+)', link)
            if match:
                show_id = match.group(1)
                title = urllib.parse.unquote(match.group(2))
                output_content.append(f"{i:4d}. [{show_id:>5}] {title}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
        output_content.append("")
    
    # الأشخاص/الممثلين
    if organized_links['persons']:
        output_content.append("## 6. الأشخاص/الممثلين")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['persons'], 1):
            match = re.search(r'/person/(\d+)/(.+)', link)
            if match:
                person_id = match.group(1)
                name = urllib.parse.unquote(match.group(2))
                output_content.append(f"{i:4d}. [{person_id:>5}] {name}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
            
            if i % 50 == 0:
                output_content.append("")
        output_content.append("")
    
    # المنوعات
    if organized_links['mix']:
        output_content.append("## 7. المنوعات")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['mix'], 1):
            match = re.search(r'/mix/(\d+)/(.+)', link)
            if match:
                mix_id = match.group(1)
                title = urllib.parse.unquote(match.group(2))
                output_content.append(f"{i:4d}. [{mix_id:>5}] {title}")
                output_content.append(f"      {link}")
            else:
                output_content.append(f"{i:4d}. {link}")
        output_content.append("")
    
    # أخرى
    if organized_links['others']:
        output_content.append("## 8. أخرى")
        output_content.append("-" * 30)
        for i, link in enumerate(organized_links['others'], 1):
            output_content.append(f"{i:4d}. {link}")
        output_content.append("")
    
    # إحصائيات ختامية
    output_content.append("## الإحصائيات النهائية")
    output_content.append("-" * 30)
    output_content.append(f"إجمالي الروابط المنظمة: {len(all_links):,}")
    output_content.append(f"الأفلام: {len(organized_links['movies']):,} ({len(organized_links['movies'])/len(all_links)*100:.1f}%)")
    output_content.append(f"المسلسلات: {len(organized_links['series']):,} ({len(organized_links['series'])/len(all_links)*100:.1f}%)")
    output_content.append(f"الحلقات: {len(organized_links['episodes']):,} ({len(organized_links['episodes'])/len(all_links)*100:.1f}%)")
    output_content.append(f"الأشخاص: {len(organized_links['persons']):,} ({len(organized_links['persons'])/len(all_links)*100:.1f}%)")
    output_content.append(f"العروض: {len(organized_links['shows']):,} ({len(organized_links['shows'])/len(all_links)*100:.1f}%)")
    output_content.append(f"المنوعات: {len(organized_links['mix']):,} ({len(organized_links['mix'])/len(all_links)*100:.1f}%)")
    output_content.append("")
    output_content.append("تم التنظيم بواسطة أدوات تحليل AKWAM المتطورة")
    
    # حفظ الملف
    with open('روابط_AKWAM_مرتبة_ومنظمة.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_content))
    
    print(f"✅ تم إنشاء الملف المرتب: روابط_AKWAM_مرتبة_ومنظمة.txt")
    print(f"📊 تم تنظيم {len(all_links):,} رابط في {len([k for k, v in organized_links.items() if v])} فئات")
    
    return len(all_links)

if __name__ == "__main__":
    organize_links()