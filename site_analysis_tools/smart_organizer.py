#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
منظم الروابط الذكي - ترتيب متطور حسب معايير ذكية متعددة
"""

import re
import urllib.parse
from collections import defaultdict, Counter
import math

class SmartLinksOrganizer:
    def __init__(self, filename='site_links.txt'):
        self.filename = filename
        self.all_links = []
        self.smart_categories = {}
        
    def load_links(self):
        """تحميل الروابط"""
        with open(self.filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('https://ak.sv/'):
                self.all_links.append(line)
                
    def calculate_popularity_score(self, link):
        """حساب نقاط الشعبية بناء على معايير متعددة"""
        score = 0
        
        # معيار ID (كلما كان أحدث كلما زادت النقاط)
        id_match = re.search(r'/(?:movie|series|episode|person|shows?|mix)/(\d+)/', link)
        if id_match:
            link_id = int(id_match.group(1))
            # تطبيع النقاط حسب النطاق
            max_id = 25000  # تقدير للحد الأقصى
            score += (link_id / max_id) * 30
        
        # معيار اللغة العربية (محتوى عربي يحصل على نقاط إضافية)
        if re.search(r'[\u0600-\u06FF]', link):
            score += 15
            
        # معيار طول العنوان (عناوين أطول قد تكون أكثر تفصيلاً)
        title = link.split('/')[-1]
        title = urllib.parse.unquote(title)
        if len(title) > 20:
            score += 10
        elif len(title) > 10:
            score += 5
            
        # معيار المواسم للمسلسلات
        if '/series/' in link and 'الموسم' in link:
            season_match = re.search(r'الموسم-(\d+)', link)
            if season_match:
                season_num = int(season_match.group(1))
                if season_num > 3:  # مسلسل طويل
                    score += 20
                elif season_num > 1:
                    score += 10
                    
        # معيار الترجمة/الدبلجة
        if 'مترجم' in link or 'مدبلج' in link:
            score += 10
            
        return score
    
    def get_content_quality_indicators(self, link):
        """تحديد مؤشرات جودة المحتوى"""
        indicators = []
        
        if 'hd' in link.lower():
            indicators.append('HD')
        if '4k' in link.lower():
            indicators.append('4K')
        if 'bluray' in link.lower():
            indicators.append('BluRay')
        if 'مترجم' in link:
            indicators.append('مترجم')
        if 'مدبلج' in link:
            indicators.append('مدبلج')
        if re.search(r'[\u0600-\u06FF]', link):
            indicators.append('عربي')
            
        return indicators
    
    def categorize_by_genre(self, links):
        """تصنيف حسب النوع المتوقع"""
        genre_patterns = {
            'أكشن': ['action', 'fight', 'war', 'battle', 'combat'],
            'كوميديا': ['comedy', 'funny', 'laugh', 'humor'],
            'دراما': ['drama', 'life', 'family', 'love'],
            'رعب': ['horror', 'scary', 'ghost', 'demon'],
            'خيال علمي': ['sci-fi', 'space', 'future', 'robot'],
            'رومانسي': ['romance', 'love', 'wedding', 'heart'],
            'إثارة': ['thriller', 'suspense', 'mystery'],
            'مغامرة': ['adventure', 'journey', 'quest'],
            'جريمة': ['crime', 'police', 'detective', 'murder'],
            'تاريخي': ['history', 'historical', 'ancient'],
            'وثائقي': ['documentary', 'real', 'true'],
            'أنمي': ['anime', 'animation', 'cartoon']
        }
        
        categorized = defaultdict(list)
        
        for link in links:
            link_lower = link.lower()
            title = urllib.parse.unquote(link.split('/')[-1]).lower()
            
            found_genre = False
            for genre, keywords in genre_patterns.items():
                if any(keyword in link_lower or keyword in title for keyword in keywords):
                    categorized[genre].append(link)
                    found_genre = True
                    break
            
            if not found_genre:
                categorized['عام'].append(link)
                
        return categorized
    
    def smart_sort_by_multiple_criteria(self, links):
        """ترتيب ذكي حسب معايير متعددة"""
        def smart_key(link):
            # حساب نقاط الشعبية
            popularity = self.calculate_popularity_score(link)
            
            # استخراج ID للترتيب الثانوي
            id_match = re.search(r'/(?:movie|series|episode|person|shows?|mix)/(\d+)/', link)
            link_id = int(id_match.group(1)) if id_match else 0
            
            # ترتيب حسب الشعبية أولاً، ثم ID
            return (-popularity, -link_id)
        
        return sorted(links, key=smart_key)
    
    def create_smart_organized_file(self):
        """إنشاء ملف منظم بذكاء"""
        output_content = []
        
        # العنوان
        output_content.append("# 🧠 روابط موقع AKWAM - ترتيب ذكي متطور")
        output_content.append("=" * 60)
        output_content.append(f"📊 إجمالي الروابط: {len(self.all_links):,}")
        output_content.append("🎯 مرتب حسب: الشعبية، الحداثة، الجودة، اللغة")
        output_content.append("")
        
        # تصنيف الروابط
        categories = {
            'movies': [link for link in self.all_links if '/movie/' in link],
            'series': [link for link in self.all_links if '/series/' in link],
            'episodes': [link for link in self.all_links if '/episode/' in link],
            'shows': [link for link in self.all_links if '/shows/' in link or '/show/' in link],
            'persons': [link for link in self.all_links if '/person/' in link],
            'mix': [link for link in self.all_links if '/mix/' in link],
            'main_pages': [link for link in self.all_links if link.count('/') == 3],
            'others': []
        }
        
        # إضافة الروابط غير المصنفة
        all_categorized = sum(categories.values(), [])
        categories['others'] = [link for link in self.all_links if link not in all_categorized]
        
        # الفهرس الذكي
        output_content.append("## 📋 الفهرس الذكي")
        output_content.append("-" * 30)
        
        # 1. الأفلام الأكثر شعبية
        if categories['movies']:
            top_movies = self.smart_sort_by_multiple_criteria(categories['movies'])[:50]
            output_content.append("### 🎬 أفضل 50 فيلم (حسب الشعبية والحداثة)")
            output_content.append("-" * 40)
            
            for i, link in enumerate(top_movies, 1):
                match = re.search(r'/movie/(\d+)/(.+)', link)
                if match:
                    movie_id = match.group(1)
                    title = urllib.parse.unquote(match.group(2))
                    score = self.calculate_popularity_score(link)
                    indicators = self.get_content_quality_indicators(link)
                    indicators_str = f" [{', '.join(indicators)}]" if indicators else ""
                    
                    output_content.append(f"{i:2d}. 🎭 [{movie_id:>5}] {title}{indicators_str}")
                    output_content.append(f"    📊 نقاط الشعبية: {score:.1f}")
                    output_content.append(f"    🔗 {link}")
                    output_content.append("")
            output_content.append("")
        
        # 2. المسلسلات الأكثر شعبية
        if categories['series']:
            top_series = self.smart_sort_by_multiple_criteria(categories['series'])[:30]
            output_content.append("### 📺 أفضل 30 مسلسل (حسب الشعبية والحداثة)")
            output_content.append("-" * 40)
            
            for i, link in enumerate(top_series, 1):
                match = re.search(r'/series/(\d+)/(.+)', link)
                if match:
                    series_id = match.group(1)
                    title = urllib.parse.unquote(match.group(2))
                    score = self.calculate_popularity_score(link)
                    indicators = self.get_content_quality_indicators(link)
                    indicators_str = f" [{', '.join(indicators)}]" if indicators else ""
                    
                    output_content.append(f"{i:2d}. 📺 [{series_id:>5}] {title}{indicators_str}")
                    output_content.append(f"    📊 نقاط الشعبية: {score:.1f}")
                    output_content.append(f"    🔗 {link}")
                    output_content.append("")
            output_content.append("")
        
        # 3. تصنيف الأفلام حسب النوع (ذكي)
        if categories['movies']:
            movie_genres = self.categorize_by_genre(categories['movies'])
            output_content.append("### 🎭 الأفلام مصنفة حسب النوع")
            output_content.append("-" * 40)
            
            for genre, genre_movies in movie_genres.items():
                if len(genre_movies) >= 5:  # عرض الأنواع التي لها 5 أفلام على الأقل
                    top_genre_movies = self.smart_sort_by_multiple_criteria(genre_movies)[:10]
                    output_content.append(f"#### 🏷️ {genre} ({len(genre_movies)} فيلم)")
                    
                    for i, link in enumerate(top_genre_movies, 1):
                        match = re.search(r'/movie/(\d+)/(.+)', link)
                        if match:
                            movie_id = match.group(1)
                            title = urllib.parse.unquote(match.group(2))
                            output_content.append(f"  {i:2d}. [{movie_id:>5}] {title}")
                    output_content.append("")
        
        # 4. المحتوى العربي المميز
        arabic_content = [link for link in self.all_links if re.search(r'[\u0600-\u06FF]', link)]
        if arabic_content:
            top_arabic = self.smart_sort_by_multiple_criteria(arabic_content)[:20]
            output_content.append("### 🇸🇦 أفضل المحتوى العربي")
            output_content.append("-" * 40)
            
            for i, link in enumerate(top_arabic, 1):
                content_type = "🎬 فيلم" if '/movie/' in link else "📺 مسلسل" if '/series/' in link else "🎭 محتوى"
                
                id_match = re.search(r'/(?:movie|series|episode|person|shows?|mix)/(\d+)/', link)
                content_id = id_match.group(1) if id_match else "---"
                title = urllib.parse.unquote(link.split('/')[-1])
                
                output_content.append(f"{i:2d}. {content_type} [{content_id:>5}] {title}")
                output_content.append(f"    🔗 {link}")
                output_content.append("")
        
        # 5. الممثلين والمشاهير الأكثر شعبية
        if categories['persons']:
            top_persons = self.smart_sort_by_multiple_criteria(categories['persons'])[:25]
            output_content.append("### 🌟 أشهر الممثلين والمشاهير")
            output_content.append("-" * 40)
            
            for i, link in enumerate(top_persons, 1):
                match = re.search(r'/person/(\d+)/(.+)', link)
                if match:
                    person_id = match.group(1)
                    name = urllib.parse.unquote(match.group(2))
                    score = self.calculate_popularity_score(link)
                    
                    flag = "🇸🇦" if re.search(r'[\u0600-\u06FF]', name) else "🌍"
                    output_content.append(f"{i:2d}. {flag} [{person_id:>5}] {name}")
                    output_content.append(f"    📊 نقاط الشعبية: {score:.1f}")
                    output_content.append("")
        
        # 6. إحصائيات ذكية
        output_content.append("### 📊 إحصائيات ذكية")
        output_content.append("-" * 40)
        
        # حساب المتوسطات
        movie_scores = [self.calculate_popularity_score(link) for link in categories['movies']]
        series_scores = [self.calculate_popularity_score(link) for link in categories['series']]
        
        if movie_scores:
            output_content.append(f"🎬 متوسط نقاط شعبية الأفلام: {sum(movie_scores)/len(movie_scores):.1f}")
        if series_scores:
            output_content.append(f"📺 متوسط نقاط شعبية المسلسلات: {sum(series_scores)/len(series_scores):.1f}")
        
        output_content.append(f"🇸🇦 المحتوى العربي: {len(arabic_content):,} ({len(arabic_content)/len(self.all_links)*100:.1f}%)")
        output_content.append(f"🌍 المحتوى الدولي: {len(self.all_links)-len(arabic_content):,} ({(len(self.all_links)-len(arabic_content))/len(self.all_links)*100:.1f}%)")
        
        # التوزيع حسب النوع
        output_content.append("")
        output_content.append("📈 التوزيع حسب النوع:")
        for cat_name, cat_links in categories.items():
            if cat_links:
                percentage = len(cat_links) / len(self.all_links) * 100
                output_content.append(f"  • {cat_name}: {len(cat_links):,} ({percentage:.1f}%)")
        
        output_content.append("")
        output_content.append("=" * 60)
        output_content.append("🚀 تم إنشاء هذا الترتيب الذكي باستخدام خوارزميات متطورة")
        output_content.append("📊 معايير الترتيب: ID، اللغة، جودة العنوان، المواسم، الترجمة")
        output_content.append("🎯 الهدف: تسهيل الوصول للمحتوى الأكثر أهمية وشعبية")
        
        # حفظ الملف
        with open('روابط_AKWAM_ترتيب_ذكي.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(output_content))
        
        print(f"✅ تم إنشاء الملف الذكي: روابط_AKWAM_ترتيب_ذكي.txt")
        print(f"🧠 تم تطبيق {len([c for c in categories.values() if c])} معيار ذكي للترتيب")
        
        return output_content
    
    def run_smart_organization(self):
        """تشغيل التنظيم الذكي"""
        print("🧠 بدء التنظيم الذكي المتطور...")
        
        self.load_links()
        result = self.create_smart_organized_file()
        
        print(f"📊 تم تحليل {len(self.all_links):,} رابط")
        print("🎯 تم تطبيق معايير: الشعبية، الحداثة، الجودة، التصنيف الذكي")
        
        return result

if __name__ == "__main__":
    organizer = SmartLinksOrganizer()
    organizer.run_smart_organization()