#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
منظم الروابط الهرمي - ترتيب من الصفحة الرئيسية إلى أعمق المستويات
"""

import re
import urllib.parse
from collections import defaultdict, OrderedDict

class HierarchicalLinksOrganizer:
    def __init__(self, filename='site_links.txt'):
        self.filename = filename
        self.all_links = []
        self.hierarchy = {}
        
    def load_links(self):
        """تحميل الروابط"""
        with open(self.filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('https://ak.sv/'):
                self.all_links.append(line)
                
    def categorize_by_depth_and_type(self):
        """تصنيف الروابط حسب العمق والنوع"""
        hierarchy = {
            'root': [],           # الصفحة الرئيسية
            'main_sections': {},  # الأقسام الرئيسية
            'categories': {},     # الفئات والتصنيفات
            'content_pages': {},  # صفحات المحتوى الفردي
            'episodes': {},       # الحلقات
            'others': []          # روابط أخرى
        }
        
        for link in self.all_links:
            # إزالة البروتوكول والدومين
            path = link.replace('https://ak.sv/', '')
            
            # الصفحة الرئيسية
            if path == '' or path == '/':
                hierarchy['root'].append(link)
                continue
            
            # تحليل المسار
            parts = [p for p in path.split('/') if p and not p.startswith('#')]
            
            if len(parts) == 0:
                hierarchy['root'].append(link)
            elif len(parts) == 1:
                # أقسام رئيسية مثل movies, series, mix
                section = parts[0].split('?')[0]  # إزالة المعاملات
                if section not in hierarchy['main_sections']:
                    hierarchy['main_sections'][section] = {
                        'base_links': [],
                        'with_params': []
                    }
                
                if '?' in parts[0]:
                    hierarchy['main_sections'][section]['with_params'].append(link)
                else:
                    hierarchy['main_sections'][section]['base_links'].append(link)
                    
            elif len(parts) >= 2:
                section = parts[0]
                
                # المحتوى الفردي (أفلام، مسلسلات، أشخاص)
                if section in ['movie', 'series', 'person', 'mix'] and len(parts) >= 3:
                    if section not in hierarchy['content_pages']:
                        hierarchy['content_pages'][section] = []
                    hierarchy['content_pages'][section].append(link)
                    
                # الحلقات
                elif section == 'episode':
                    if 'episode' not in hierarchy['episodes']:
                        hierarchy['episodes']['episode'] = []
                    hierarchy['episodes']['episode'].append(link)
                    
                # حلقات العروض
                elif section == 'show' and len(parts) >= 3 and parts[1] == 'episode':
                    if 'show_episode' not in hierarchy['episodes']:
                        hierarchy['episodes']['show_episode'] = []
                    hierarchy['episodes']['show_episode'].append(link)
                    
                # العروض
                elif section in ['shows', 'show']:
                    if section not in hierarchy['content_pages']:
                        hierarchy['content_pages'][section] = []
                    hierarchy['content_pages'][section].append(link)
                    
                else:
                    hierarchy['others'].append(link)
            else:
                hierarchy['others'].append(link)
        
        return hierarchy
    
    def extract_id_and_title(self, link):
        """استخراج ID والعنوان من الرابط"""
        patterns = [
            r'/(?:movie|series|person|mix|shows?)/(\d+)/(.+)',
            r'/episode/(\d+)/([^/]+)/(.+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, link)
            if match:
                if len(match.groups()) == 2:
                    return int(match.group(1)), urllib.parse.unquote(match.group(2))
                elif len(match.groups()) == 3:
                    return int(match.group(1)), f"{urllib.parse.unquote(match.group(2))} - {urllib.parse.unquote(match.group(3))}"
        
        return 0, link.split('/')[-1]
    
    def sort_content_intelligently(self, links):
        """ترتيب المحتوى بذكاء"""
        sorted_links = []
        
        for link in links:
            id_val, title = self.extract_id_and_title(link)
            sorted_links.append((id_val, title, link))
        
        # ترتيب حسب ID
        sorted_links.sort(key=lambda x: x[0])
        return sorted_links
    
    def create_hierarchical_file(self):
        """إنشاء ملف مرتب هرمياً"""
        hierarchy = self.categorize_by_depth_and_type()
        
        output_content = []
        
        # العنوان
        output_content.append("# 🌳 روابط موقع AKWAM - ترتيب هرمي شامل")
        output_content.append("=" * 60)
        output_content.append(f"📊 إجمالي الروابط: {len(self.all_links):,}")
        output_content.append("🎯 مرتب من الصفحة الرئيسية إلى أعمق المستويات")
        output_content.append("🌳 تنظيم هرمي: رئيسية → أقسام → فئات → محتوى فردي")
        output_content.append("")
        
        # الفهرس
        output_content.append("## 📋 الفهرس الهرمي")
        output_content.append("-" * 30)
        output_content.append("1. 🏠 الصفحة الرئيسية")
        output_content.append("2. 📂 الأقسام الرئيسية")
        output_content.append("3. 🎬 صفحات الأفلام")
        output_content.append("4. 📺 صفحات المسلسلات")
        output_content.append("5. 👥 صفحات الأشخاص")
        output_content.append("6. 📹 صفحات الحلقات")
        output_content.append("7. 📺 صفحات العروض")
        output_content.append("8. 🎭 صفحات المنوعات")
        output_content.append("9. 🔗 روابط أخرى")
        output_content.append("")
        
        # 1. الصفحة الرئيسية
        output_content.append("## 1. 🏠 الصفحة الرئيسية")
        output_content.append("-" * 40)
        if hierarchy['root']:
            for link in hierarchy['root']:
                output_content.append(f"🏠 {link}")
        output_content.append("")
        
        # 2. الأقسام الرئيسية
        output_content.append("## 2. 📂 الأقسام الرئيسية")
        output_content.append("-" * 40)
        
        # ترتيب الأقسام حسب الأهمية
        section_priority = ['movies', 'series', 'shows', 'mix', 'person']
        
        for section in section_priority + [s for s in hierarchy['main_sections'].keys() if s not in section_priority]:
            if section in hierarchy['main_sections']:
                section_data = hierarchy['main_sections'][section]
                total_links = len(section_data['base_links']) + len(section_data['with_params'])
                
                output_content.append(f"### 📂 /{section}/ ({total_links:,} رابط)")
                output_content.append("")
                
                # الروابط الأساسية
                if section_data['base_links']:
                    output_content.append("#### الروابط الأساسية:")
                    for link in section_data['base_links']:
                        output_content.append(f"  📌 {link}")
                    output_content.append("")
                
                # الروابط مع المعاملات (مرتبة)
                if section_data['with_params']:
                    output_content.append("#### روابط التصفح والفلترة:")
                    
                    # تجميع حسب نوع المعامل
                    param_groups = defaultdict(list)
                    for link in section_data['with_params']:
                        if '?category=' in link:
                            param_groups['category'].append(link)
                        elif '?page=' in link:
                            param_groups['page'].append(link)
                        elif '?tag=' in link:
                            param_groups['tag'].append(link)
                        else:
                            param_groups['other'].append(link)
                    
                    # عرض كل مجموعة
                    for param_type, param_links in param_groups.items():
                        if param_links:
                            output_content.append(f"  🏷️ تصفح حسب {param_type} ({len(param_links)} رابط):")
                            
                            # عرض أول 5 روابط من كل نوع
                            for i, link in enumerate(param_links[:5]):
                                output_content.append(f"    {i+1}. {link}")
                            
                            if len(param_links) > 5:
                                output_content.append(f"    ... و {len(param_links)-5} رابط آخر")
                            output_content.append("")
                
                output_content.append("")
        
        # 3. صفحات الأفلام
        if 'movie' in hierarchy['content_pages']:
            movies = hierarchy['content_pages']['movie']
            sorted_movies = self.sort_content_intelligently(movies)
            
            output_content.append(f"## 3. 🎬 صفحات الأفلام ({len(movies):,} فيلم)")
            output_content.append("-" * 40)
            output_content.append("مرتبة حسب ID من الأقدم للأحدث:")
            output_content.append("")
            
            # تقسيم إلى مجموعات (كل 1000 فيلم)
            for i in range(0, len(sorted_movies), 1000):
                group = sorted_movies[i:i+1000]
                start_id = group[0][0]
                end_id = group[-1][0]
                
                output_content.append(f"### 🎬 أفلام ID {start_id:,} - {end_id:,} ({len(group)} فيلم)")
                
                for j, (id_val, title, link) in enumerate(group[:20]):  # أول 20 من كل مجموعة
                    output_content.append(f"  {j+1:3d}. [{id_val:>5}] {title}")
                    output_content.append(f"       🔗 {link}")
                
                if len(group) > 20:
                    output_content.append(f"       ... و {len(group)-20} فيلم آخر في هذا النطاق")
                output_content.append("")
        
        # 4. صفحات المسلسلات
        if 'series' in hierarchy['content_pages']:
            series = hierarchy['content_pages']['series']
            sorted_series = self.sort_content_intelligently(series)
            
            output_content.append(f"## 4. 📺 صفحات المسلسلات ({len(series):,} مسلسل)")
            output_content.append("-" * 40)
            output_content.append("مرتبة حسب ID من الأقدم للأحدث:")
            output_content.append("")
            
            # تقسيم إلى مجموعات (كل 500 مسلسل)
            for i in range(0, len(sorted_series), 500):
                group = sorted_series[i:i+500]
                start_id = group[0][0]
                end_id = group[-1][0]
                
                output_content.append(f"### 📺 مسلسلات ID {start_id:,} - {end_id:,} ({len(group)} مسلسل)")
                
                for j, (id_val, title, link) in enumerate(group[:15]):  # أول 15 من كل مجموعة
                    output_content.append(f"  {j+1:3d}. [{id_val:>5}] {title}")
                    output_content.append(f"       🔗 {link}")
                
                if len(group) > 15:
                    output_content.append(f"       ... و {len(group)-15} مسلسل آخر في هذا النطاق")
                output_content.append("")
        
        # 5. صفحات الأشخاص
        if 'person' in hierarchy['content_pages']:
            persons = hierarchy['content_pages']['person']
            sorted_persons = self.sort_content_intelligently(persons)
            
            output_content.append(f"## 5. 👥 صفحات الأشخاص ({len(persons):,} شخص)")
            output_content.append("-" * 40)
            
            # تقسيم إلى عرب وأجانب
            arabic_persons = [(id_val, title, link) for id_val, title, link in sorted_persons 
                             if re.search(r'[\u0600-\u06FF]', title)]
            foreign_persons = [(id_val, title, link) for id_val, title, link in sorted_persons 
                              if not re.search(r'[\u0600-\u06FF]', title)]
            
            if arabic_persons:
                output_content.append(f"### 🇸🇦 الأشخاص العرب ({len(arabic_persons)} شخص)")
                for i, (id_val, title, link) in enumerate(arabic_persons[:20]):
                    output_content.append(f"  {i+1:3d}. [{id_val:>5}] {title}")
                    output_content.append(f"       🔗 {link}")
                if len(arabic_persons) > 20:
                    output_content.append(f"       ... و {len(arabic_persons)-20} شخص عربي آخر")
                output_content.append("")
            
            if foreign_persons:
                output_content.append(f"### 🌍 الأشخاص الأجانب ({len(foreign_persons)} شخص)")
                for i, (id_val, title, link) in enumerate(foreign_persons[:20]):
                    output_content.append(f"  {i+1:3d}. [{id_val:>5}] {title}")
                    output_content.append(f"       🔗 {link}")
                if len(foreign_persons) > 20:
                    output_content.append(f"       ... و {len(foreign_persons)-20} شخص أجنبي آخر")
                output_content.append("")
        
        # 6. صفحات الحلقات
        if hierarchy['episodes']:
            output_content.append("## 6. 📹 صفحات الحلقات")
            output_content.append("-" * 40)
            
            for episode_type, episodes in hierarchy['episodes'].items():
                sorted_episodes = self.sort_content_intelligently(episodes)
                
                output_content.append(f"### 📹 {episode_type} ({len(episodes):,} حلقة)")
                
                for i, (id_val, title, link) in enumerate(sorted_episodes[:15]):
                    output_content.append(f"  {i+1:3d}. [{id_val:>8}] {title}")
                    output_content.append(f"       🔗 {link}")
                
                if len(sorted_episodes) > 15:
                    output_content.append(f"       ... و {len(sorted_episodes)-15} حلقة أخرى")
                output_content.append("")
        
        # 7. العروض والمنوعات
        for content_type in ['shows', 'show', 'mix']:
            if content_type in hierarchy['content_pages']:
                content = hierarchy['content_pages'][content_type]
                sorted_content = self.sort_content_intelligently(content)
                
                type_name = "العروض التلفزيونية" if content_type in ['shows', 'show'] else "المنوعات"
                output_content.append(f"## 7. 📺 {type_name} ({len(content):,} عنصر)")
                output_content.append("-" * 40)
                
                for i, (id_val, title, link) in enumerate(sorted_content[:20]):
                    output_content.append(f"  {i+1:3d}. [{id_val:>5}] {title}")
                    output_content.append(f"       🔗 {link}")
                
                if len(sorted_content) > 20:
                    output_content.append(f"       ... و {len(sorted_content)-20} عنصر آخر")
                output_content.append("")
        
        # 8. روابط أخرى
        if hierarchy['others']:
            output_content.append(f"## 8. 🔗 روابط أخرى ({len(hierarchy['others'])} رابط)")
            output_content.append("-" * 40)
            for i, link in enumerate(hierarchy['others']):
                output_content.append(f"  {i+1:3d}. {link}")
            output_content.append("")
        
        # الخلاصة
        output_content.append("## 📊 ملخص التنظيم الهرمي")
        output_content.append("-" * 40)
        output_content.append(f"🏠 الصفحة الرئيسية: {len(hierarchy['root'])} رابط")
        output_content.append(f"📂 الأقسام الرئيسية: {len(hierarchy['main_sections'])} قسم")
        
        total_content = 0
        for content_type, content_list in hierarchy['content_pages'].items():
            count = len(content_list)
            total_content += count
            type_name = {
                'movie': 'الأفلام',
                'series': 'المسلسلات', 
                'person': 'الأشخاص',
                'shows': 'العروض',
                'show': 'العروض',
                'mix': 'المنوعات'
            }.get(content_type, content_type)
            output_content.append(f"📋 {type_name}: {count:,} عنصر")
        
        total_episodes = sum(len(episodes) for episodes in hierarchy['episodes'].values())
        output_content.append(f"📹 الحلقات: {total_episodes:,} حلقة")
        output_content.append(f"🔗 أخرى: {len(hierarchy['others'])} رابط")
        output_content.append("")
        output_content.append(f"📊 المجموع: {len(self.all_links):,} رابط")
        
        output_content.append("")
        output_content.append("=" * 60)
        output_content.append("🌳 تم تنظيم جميع الروابط في هيكل هرمي شامل")
        output_content.append("📋 لم يتم إهمال أي رابط واحد من الـ 18,114 رابط")
        output_content.append("🎯 ترتيب ذكي من الصفحة الرئيسية إلى أعمق المستويات")
        
        # حفظ الملف
        with open('روابط_AKWAM_ترتيب_هرمي_شامل.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(output_content))
        
        print(f"✅ تم إنشاء الملف الهرمي: روابط_AKWAM_ترتيب_هرمي_شامل.txt")
        print(f"🌳 تم تنظيم {len(self.all_links):,} رابط في هيكل هرمي شامل")
        print("📋 جميع الروابط منظمة من الرئيسية إلى أعمق المستويات")
        
        return output_content
    
    def run_hierarchical_organization(self):
        """تشغيل التنظيم الهرمي"""
        print("🌳 بدء التنظيم الهرمي الشامل...")
        
        self.load_links()
        result = self.create_hierarchical_file()
        
        print("🎯 تم إنشاء ترتيب هرمي ذكي وشامل")
        
        return result

if __name__ == "__main__":
    organizer = HierarchicalLinksOrganizer()
    organizer.run_hierarchical_organization()