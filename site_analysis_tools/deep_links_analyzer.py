#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
محلل الروابط المتطور - تحليل عميق لملف site_links.txt
تحليل شامل لبنية موقع AKWAM ومحتواه
"""

import re
import json
import urllib.parse
from collections import defaultdict, Counter
from datetime import datetime
import statistics

class DeepLinksAnalyzer:
    def __init__(self, filename='site_links.txt'):
        self.filename = filename
        self.all_links = []
        self.categories = defaultdict(int)
        self.patterns = defaultdict(int)
        self.detailed_analysis = {}
        
    def load_links(self):
        """تحميل وتنظيف الروابط من الملف"""
        with open(self.filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('https://ak.sv/'):
                self.all_links.append(line)
                
        print(f"✅ تم تحميل {len(self.all_links):,} رابط بنجاح")
        
    def analyze_structure(self):
        """تحليل هيكل الروابط وتصنيفها"""
        for link in self.all_links:
            # تحليل نوع المحتوى
            if '/movie/' in link:
                self.categories['أفلام'] += 1
            elif '/series/' in link:
                self.categories['مسلسلات'] += 1
            elif '/episode/' in link:
                self.categories['حلقات'] += 1
            elif '/shows/' in link:
                self.categories['عروض تلفزيونية'] += 1
            elif '/show/' in link:
                self.categories['عروض'] += 1
            elif '/mix/' in link:
                self.categories['منوعات'] += 1
            elif '/person/' in link:
                self.categories['أشخاص/ممثلين'] += 1
            elif link.count('/') == 3:
                self.categories['صفحات رئيسية'] += 1
            else:
                self.categories['أخرى'] += 1
                
            # تحليل الأنماط
            path = link.replace('https://ak.sv/', '')
            if '/' in path:
                pattern = path.split('/')[0]
                self.patterns[pattern] += 1
                
    def analyze_movies(self):
        """تحليل تفصيلي للأفلام"""
        movies = [link for link in self.all_links if '/movie/' in link]
        movie_analysis = {
            'total_count': len(movies),
            'ids_range': {'min': float('inf'), 'max': 0},
            'languages': defaultdict(int),
            'sample_titles': []
        }
        
        movie_ids = []
        for movie in movies:
            # استخراج ID
            match = re.search(r'/movie/(\d+)/', movie)
            if match:
                movie_id = int(match.group(1))
                movie_ids.append(movie_id)
                
            # تحليل اللغة من النص
            title = movie.split('/')[-1]
            title = urllib.parse.unquote(title)
            if re.search(r'[\u0600-\u06FF]', title):  # نص عربي
                movie_analysis['languages']['عربي'] += 1
            else:
                movie_analysis['languages']['أجنبي'] += 1
                
            # عينة من العناوين
            if len(movie_analysis['sample_titles']) < 20:
                movie_analysis['sample_titles'].append({
                    'id': movie_id if match else 'غير محدد',
                    'title': title,
                    'url': movie
                })
        
        if movie_ids:
            movie_analysis['ids_range']['min'] = min(movie_ids)
            movie_analysis['ids_range']['max'] = max(movie_ids)
            movie_analysis['average_id'] = statistics.mean(movie_ids)
            movie_analysis['median_id'] = statistics.median(movie_ids)
            
        self.detailed_analysis['movies'] = movie_analysis
        
    def analyze_series(self):
        """تحليل تفصيلي للمسلسلات"""
        series = [link for link in self.all_links if '/series/' in link]
        series_analysis = {
            'total_count': len(series),
            'ids_range': {'min': float('inf'), 'max': 0},
            'languages': defaultdict(int),
            'seasons_pattern': defaultdict(int),
            'sample_titles': []
        }
        
        series_ids = []
        for serie in series:
            # استخراج ID
            match = re.search(r'/series/(\d+)/', serie)
            if match:
                series_id = int(match.group(1))
                series_ids.append(series_id)
                
            # تحليل الموسم
            if 'الموسم' in serie:
                season_match = re.search(r'الموسم-(\d+)', serie)
                if season_match:
                    season = int(season_match.group(1))
                    series_analysis['seasons_pattern'][f'الموسم {season}'] += 1
                    
            # تحليل اللغة
            title = serie.split('/')[-1]
            title = urllib.parse.unquote(title)
            if re.search(r'[\u0600-\u06FF]', title):
                series_analysis['languages']['عربي'] += 1
            else:
                series_analysis['languages']['أجنبي'] += 1
                
            # عينة من العناوين
            if len(series_analysis['sample_titles']) < 20:
                series_analysis['sample_titles'].append({
                    'id': series_id if match else 'غير محدد',
                    'title': title,
                    'url': serie
                })
        
        if series_ids:
            series_analysis['ids_range']['min'] = min(series_ids)
            series_analysis['ids_range']['max'] = max(series_ids)
            series_analysis['average_id'] = statistics.mean(series_ids)
            
        self.detailed_analysis['series'] = series_analysis
        
    def analyze_episodes(self):
        """تحليل تفصيلي للحلقات"""
        episodes = [link for link in self.all_links if '/episode/' in link]
        episodes_analysis = {
            'total_count': len(episodes),
            'languages': defaultdict(int),
            'episode_numbers': defaultdict(int),
            'series_distribution': defaultdict(int),
            'sample_episodes': []
        }
        
        for episode in episodes:
            # تحليل رقم الحلقة
            if 'الحلقة' in episode:
                episodes_analysis['languages']['عربي'] += 1
                episode_match = re.search(r'الحلقة-(\d+)', episode)
                if episode_match:
                    ep_num = int(episode_match.group(1))
                    episodes_analysis['episode_numbers'][ep_num] += 1
            else:
                episodes_analysis['languages']['أجنبي'] += 1
                
            # تحليل توزيع المسلسلات
            parts = episode.split('/')
            if len(parts) >= 5:
                series_name = parts[4].split('-')[0]  # أول جزء من اسم المسلسل
                episodes_analysis['series_distribution'][series_name] += 1
                
            # عينة من الحلقات
            if len(episodes_analysis['sample_episodes']) < 15:
                episodes_analysis['sample_episodes'].append({
                    'series': parts[4] if len(parts) >= 5 else 'غير محدد',
                    'episode': parts[-1] if len(parts) > 5 else 'غير محدد',
                    'url': episode
                })
        
        self.detailed_analysis['episodes'] = episodes_analysis
        
    def analyze_persons(self):
        """تحليل صفحات الأشخاص/الممثلين"""
        persons = [link for link in self.all_links if '/person/' in link]
        persons_analysis = {
            'total_count': len(persons),
            'ids_range': {'min': float('inf'), 'max': 0},
            'name_patterns': defaultdict(int),
            'sample_persons': []
        }
        
        person_ids = []
        for person in persons:
            # استخراج ID
            match = re.search(r'/person/(\d+)/', person)
            if match:
                person_id = int(match.group(1))
                person_ids.append(person_id)
                
            # تحليل الأسماء
            name = person.split('/')[-1]
            name = urllib.parse.unquote(name)
            if re.search(r'[\u0600-\u06FF]', name):
                persons_analysis['name_patterns']['عربي'] += 1
            else:
                persons_analysis['name_patterns']['أجنبي'] += 1
                
            # عينة من الأشخاص
            if len(persons_analysis['sample_persons']) < 15:
                persons_analysis['sample_persons'].append({
                    'id': person_id if match else 'غير محدد',
                    'name': name,
                    'url': person
                })
        
        if person_ids:
            persons_analysis['ids_range']['min'] = min(person_ids)
            persons_analysis['ids_range']['max'] = max(person_ids)
            
        self.detailed_analysis['persons'] = persons_analysis
        
    def generate_comprehensive_report(self):
        """إنشاء تقرير شامل ومفصل"""
        report = []
        report.append("🎬 تقرير التحليل الشامل العميق لموقع AKWAM")
        report.append("=" * 60)
        report.append(f"📅 تاريخ التحليل: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"📊 إجمالي الروابط المحللة: {len(self.all_links):,}")
        report.append("")
        
        # الإحصائيات العامة
        report.append("📈 الإحصائيات العامة:")
        report.append("-" * 30)
        for category, count in sorted(self.categories.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(self.all_links)) * 100
            report.append(f"• {category}: {count:,} ({percentage:.1f}%)")
        report.append("")
        
        # تحليل الأفلام
        if 'movies' in self.detailed_analysis:
            movies = self.detailed_analysis['movies']
            report.append("🎥 تحليل الأفلام المتعمق:")
            report.append("-" * 30)
            report.append(f"• إجمالي الأفلام: {movies['total_count']:,}")
            report.append(f"• نطاق IDs: {movies['ids_range']['min']:,} - {movies['ids_range']['max']:,}")
            if 'average_id' in movies:
                report.append(f"• متوسط ID: {movies['average_id']:.0f}")
            report.append(f"• توزيع اللغات:")
            for lang, count in movies['languages'].items():
                percentage = (count / movies['total_count']) * 100
                report.append(f"  - {lang}: {count:,} ({percentage:.1f}%)")
            
            report.append(f"• عينة من الأفلام:")
            for movie in movies['sample_titles'][:10]:
                report.append(f"  - ID {movie['id']}: {movie['title']}")
            report.append("")
        
        # تحليل المسلسلات
        if 'series' in self.detailed_analysis:
            series = self.detailed_analysis['series']
            report.append("📺 تحليل المسلسلات المتعمق:")
            report.append("-" * 30)
            report.append(f"• إجمالي المسلسلات: {series['total_count']:,}")
            report.append(f"• نطاق IDs: {series['ids_range']['min']:,} - {series['ids_range']['max']:,}")
            report.append(f"• توزيع اللغات:")
            for lang, count in series['languages'].items():
                percentage = (count / series['total_count']) * 100
                report.append(f"  - {lang}: {count:,} ({percentage:.1f}%)")
            
            if series['seasons_pattern']:
                report.append(f"• أنماط المواسم الأكثر شيوعاً:")
                for season, count in sorted(series['seasons_pattern'].items(), key=lambda x: x[1], reverse=True)[:5]:
                    report.append(f"  - {season}: {count:,}")
            
            report.append(f"• عينة من المسلسلات:")
            for serie in series['sample_titles'][:10]:
                report.append(f"  - ID {serie['id']}: {serie['title']}")
            report.append("")
        
        # تحليل الحلقات
        if 'episodes' in self.detailed_analysis:
            episodes = self.detailed_analysis['episodes']
            report.append("🎬 تحليل الحلقات المتعمق:")
            report.append("-" * 30)
            report.append(f"• إجمالي الحلقات: {episodes['total_count']:,}")
            report.append(f"• توزيع اللغات:")
            for lang, count in episodes['languages'].items():
                percentage = (count / episodes['total_count']) * 100
                report.append(f"  - {lang}: {count:,} ({percentage:.1f}%)")
            
            # أكثر أرقام الحلقات شيوعاً
            if episodes['episode_numbers']:
                top_episodes = sorted(episodes['episode_numbers'].items(), key=lambda x: x[1], reverse=True)[:10]
                report.append(f"• أرقام الحلقات الأكثر شيوعاً:")
                for ep_num, count in top_episodes:
                    report.append(f"  - الحلقة {ep_num}: {count:,} مرة")
            
            # توزيع المسلسلات
            top_series = sorted(episodes['series_distribution'].items(), key=lambda x: x[1], reverse=True)[:10]
            report.append(f"• المسلسلات الأكثر حلقات:")
            for series_name, count in top_series:
                report.append(f"  - {series_name}: {count:,} حلقة")
            report.append("")
        
        # تحليل الأشخاص
        if 'persons' in self.detailed_analysis:
            persons = self.detailed_analysis['persons']
            report.append("👥 تحليل الأشخاص/الممثلين:")
            report.append("-" * 30)
            report.append(f"• إجمالي الأشخاص: {persons['total_count']:,}")
            report.append(f"• نطاق IDs: {persons['ids_range']['min']:,} - {persons['ids_range']['max']:,}")
            report.append(f"• توزيع الأسماء:")
            for pattern, count in persons['name_patterns'].items():
                percentage = (count / persons['total_count']) * 100
                report.append(f"  - {pattern}: {count:,} ({percentage:.1f}%)")
            
            report.append(f"• عينة من الأشخاص:")
            for person in persons['sample_persons'][:10]:
                report.append(f"  - ID {person['id']}: {person['name']}")
            report.append("")
        
        # الخلاصة والتوصيات
        report.append("🔍 الخلاصة والتوصيات:")
        report.append("-" * 30)
        report.append("• الموقع يحتوي على مكتبة ضخمة ومتنوعة من المحتوى")
        report.append("• نظام ترقيم منظم للمحتوى مع IDs فريدة")
        report.append("• دعم قوي للمحتوى العربي والأجنبي")
        report.append("• بنية URL واضحة ومنطقية")
        report.append("• يمكن استخدام هذا التحليل لبناء نظام فهرسة متطور")
        report.append("")
        
        return "\n".join(report)
    
    def run_complete_analysis(self):
        """تشغيل التحليل الكامل"""
        print("🚀 بدء التحليل الشامل العميق...")
        
        self.load_links()
        self.analyze_structure()
        self.analyze_movies()
        self.analyze_series() 
        self.analyze_episodes()
        self.analyze_persons()
        
        report = self.generate_comprehensive_report()
        
        # حفظ التقرير
        output_file = f"تحليل_الروابط_الشامل_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"✅ تم إنشاء التقرير الشامل: {output_file}")
        return report

if __name__ == "__main__":
    analyzer = DeepLinksAnalyzer()
    report = analyzer.run_complete_analysis()
    print("\n" + "="*60)
    print(report)