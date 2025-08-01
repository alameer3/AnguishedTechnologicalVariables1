#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
محلل الأنماط المتقدم - تحليل أعمق للأنماط والسلوكيات في موقع AKWAM
"""

import re
import json
import urllib.parse
from collections import defaultdict, Counter
from datetime import datetime
import math

class AdvancedPatternsAnalyzer:
    def __init__(self, filename='site_links.txt'):
        self.filename = filename
        self.all_links = []
        self.insights = {}
        
    def load_links(self):
        """تحميل الروابط"""
        with open(self.filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('https://ak.sv/'):
                self.all_links.append(line)
                
    def analyze_url_patterns(self):
        """تحليل أنماط URLs المتقدمة"""
        url_analysis = {
            'depth_analysis': defaultdict(int),
            'parameter_patterns': defaultdict(int),
            'special_characters': defaultdict(int),
            'encoding_patterns': defaultdict(int)
        }
        
        for link in self.all_links:
            # تحليل عمق URL
            path = link.replace('https://ak.sv/', '')
            depth = path.count('/')
            url_analysis['depth_analysis'][depth] += 1
            
            # تحليل الترميز
            if '%' in link:
                url_analysis['encoding_patterns']['encoded'] += 1
            else:
                url_analysis['encoding_patterns']['plain'] += 1
                
            # تحليل الأحرف الخاصة
            if re.search(r'[\u0600-\u06FF]', link):
                url_analysis['special_characters']['arabic'] += 1
            if re.search(r'[A-Za-z]', link):
                url_analysis['special_characters']['english'] += 1
            if re.search(r'\d', link):
                url_analysis['special_characters']['numbers'] += 1
            if re.search(r'[-_]', link):
                url_analysis['special_characters']['separators'] += 1
                
        self.insights['url_patterns'] = url_analysis
        
    def analyze_content_distribution(self):
        """تحليل توزيع المحتوى الجغرافي واللغوي"""
        content_analysis = {
            'arabic_content': defaultdict(int),
            'international_content': defaultdict(int),
            'mixed_content': defaultdict(int),
            'content_origins': defaultdict(int)
        }
        
        # قوائم الكلمات الدلالية
        arabic_keywords = ['عربي', 'مصري', 'سوري', 'لبناني', 'خليجي', 'مغربي', 'جزائري']
        turkish_keywords = ['turkish', 'turk', 'istanbul', 'ankara']
        korean_keywords = ['korean', 'seoul', 'kpop', 'kdrama']
        indian_keywords = ['bollywood', 'hindi', 'tamil', 'telugu']
        
        for link in self.all_links:
            link_lower = link.lower()
            
            # تحليل المنشأ
            if any(keyword in link_lower for keyword in arabic_keywords):
                content_analysis['content_origins']['عربي'] += 1
            elif any(keyword in link_lower for keyword in turkish_keywords):
                content_analysis['content_origins']['تركي'] += 1
            elif any(keyword in link_lower for keyword in korean_keywords):
                content_analysis['content_origins']['كوري'] += 1
            elif any(keyword in link_lower for keyword in indian_keywords):
                content_analysis['content_origins']['هندي'] += 1
            else:
                content_analysis['content_origins']['دولي'] += 1
                
        self.insights['content_distribution'] = content_analysis
        
    def analyze_popularity_indicators(self):
        """تحليل مؤشرات الشعبية والاهتمام"""
        popularity_analysis = {
            'high_id_content': [],
            'series_with_many_seasons': defaultdict(int),
            'actors_frequency': defaultdict(int),
            'content_clusters': defaultdict(list)
        }
        
        # تحليل المحتوى عالي ID (قد يدل على شعبية)
        for link in self.all_links:
            if '/movie/' in link or '/series/' in link:
                match = re.search(r'/(?:movie|series)/(\d+)/', link)
                if match:
                    content_id = int(match.group(1))
                    if content_id > 8000:  # محتوى حديث أو شعبي
                        title = link.split('/')[-1]
                        title = urllib.parse.unquote(title)
                        popularity_analysis['high_id_content'].append({
                            'id': content_id,
                            'title': title,
                            'type': 'فيلم' if '/movie/' in link else 'مسلسل'
                        })
        
        # تحليل المواسم المتعددة
        series_seasons = defaultdict(set)
        for link in self.all_links:
            if '/series/' in link and 'الموسم' in link:
                series_match = re.search(r'/series/\d+/([^/]+)', link)
                season_match = re.search(r'الموسم-(\d+)', link)
                if series_match and season_match:
                    series_name = series_match.group(1).split('-الموسم')[0]
                    season_num = int(season_match.group(1))
                    series_seasons[series_name].add(season_num)
                    
        for series, seasons in series_seasons.items():
            if len(seasons) > 3:  # مسلسل له أكثر من 3 مواسم
                popularity_analysis['series_with_many_seasons'][series] = len(seasons)
        
        self.insights['popularity_indicators'] = popularity_analysis
        
    def analyze_technical_patterns(self):
        """تحليل الأنماط التقنية"""
        technical_analysis = {
            'id_gaps': [],
            'content_clustering': defaultdict(list),
            'naming_conventions': defaultdict(int),
            'url_efficiency': {}
        }
        
        # تحليل فجوات IDs
        movie_ids = []
        series_ids = []
        
        for link in self.all_links:
            if '/movie/' in link:
                match = re.search(r'/movie/(\d+)/', link)
                if match:
                    movie_ids.append(int(match.group(1)))
            elif '/series/' in link:
                match = re.search(r'/series/(\d+)/', link)
                if match:
                    series_ids.append(int(match.group(1)))
        
        # تحليل فجوات IDs للأفلام
        movie_ids.sort()
        gaps = []
        for i in range(len(movie_ids) - 1):
            gap = movie_ids[i + 1] - movie_ids[i]
            if gap > 100:  # فجوة كبيرة
                gaps.append(gap)
        
        technical_analysis['id_gaps'] = {
            'movie_gaps': gaps[:10],  # أكبر 10 فجوات
            'largest_gap': max(gaps) if gaps else 0,
            'average_gap': sum(gaps) / len(gaps) if gaps else 0
        }
        
        # تحليل اصطلاحات التسمية
        for link in self.all_links:
            if '-' in link:
                technical_analysis['naming_conventions']['dash_separated'] += 1
            if '_' in link:
                technical_analysis['naming_conventions']['underscore_separated'] += 1
            if re.search(r'\d+', link):
                technical_analysis['naming_conventions']['contains_numbers'] += 1
                
        self.insights['technical_patterns'] = technical_analysis
        
    def generate_advanced_insights_report(self):
        """إنشاء تقرير الاستبصارات المتقدمة"""
        report = []
        report.append("🔬 تقرير التحليل المتقدم للأنماط والاستبصارات")
        report.append("=" * 70)
        report.append(f"📅 تاريخ التحليل: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"🔍 عدد الروابط المحللة: {len(self.all_links):,}")
        report.append("")
        
        # تحليل أنماط URLs
        if 'url_patterns' in self.insights:
            url_patterns = self.insights['url_patterns']
            report.append("🌐 تحليل أنماط URLs المتقدمة:")
            report.append("-" * 40)
            
            report.append("• توزيع عمق المسارات:")
            for depth, count in sorted(url_patterns['depth_analysis'].items()):
                percentage = (count / len(self.all_links)) * 100
                report.append(f"  - عمق {depth}: {count:,} ({percentage:.1f}%)")
            
            report.append("• أنماط الترميز:")
            for pattern, count in url_patterns['encoding_patterns'].items():
                percentage = (count / len(self.all_links)) * 100
                report.append(f"  - {pattern}: {count:,} ({percentage:.1f}%)")
            
            report.append("• استخدام الأحرف الخاصة:")
            for char_type, count in url_patterns['special_characters'].items():
                percentage = (count / len(self.all_links)) * 100
                report.append(f"  - {char_type}: {count:,} ({percentage:.1f}%)")
            report.append("")
        
        # تحليل توزيع المحتوى
        if 'content_distribution' in self.insights:
            content_dist = self.insights['content_distribution']
            report.append("🌍 تحليل توزيع المحتوى الجغرافي:")
            report.append("-" * 40)
            
            total_origins = sum(content_dist['content_origins'].values())
            if total_origins > 0:
                report.append("• أصول المحتوى:")
                for origin, count in sorted(content_dist['content_origins'].items(), 
                                          key=lambda x: x[1], reverse=True):
                    percentage = (count / total_origins) * 100
                    report.append(f"  - {origin}: {count:,} ({percentage:.1f}%)")
            report.append("")
        
        # مؤشرات الشعبية
        if 'popularity_indicators' in self.insights:
            popularity = self.insights['popularity_indicators']
            report.append("📈 مؤشرات الشعبية والاهتمام:")
            report.append("-" * 40)
            
            if popularity['high_id_content']:
                report.append(f"• المحتوى عالي ID (مؤشر حداثة): {len(popularity['high_id_content']):,}")
                top_content = sorted(popularity['high_id_content'], 
                                   key=lambda x: x['id'], reverse=True)[:10]
                for content in top_content:
                    report.append(f"  - {content['type']} ID {content['id']}: {content['title']}")
            
            if popularity['series_with_many_seasons']:
                report.append("• المسلسلات متعددة المواسم:")
                for series, seasons in sorted(popularity['series_with_many_seasons'].items(),
                                            key=lambda x: x[1], reverse=True)[:10]:
                    report.append(f"  - {series}: {seasons} مواسم")
            report.append("")
        
        # الأنماط التقنية
        if 'technical_patterns' in self.insights:
            technical = self.insights['technical_patterns']
            report.append("⚙️ تحليل الأنماط التقنية:")
            report.append("-" * 40)
            
            if 'id_gaps' in technical:
                gaps_info = technical['id_gaps']
                report.append(f"• تحليل فجوات IDs:")
                report.append(f"  - أكبر فجوة: {gaps_info['largest_gap']:,}")
                report.append(f"  - متوسط الفجوات: {gaps_info['average_gap']:.0f}")
                if gaps_info['movie_gaps']:
                    report.append(f"  - أكبر 5 فجوات: {gaps_info['movie_gaps'][:5]}")
            
            if technical['naming_conventions']:
                report.append("• اصطلاحات التسمية:")
                total_naming = sum(technical['naming_conventions'].values())
                for convention, count in technical['naming_conventions'].items():
                    percentage = (count / total_naming) * 100
                    report.append(f"  - {convention}: {count:,} ({percentage:.1f}%)")
            report.append("")
        
        # الخلاصة التقنية
        report.append("🎯 الخلاصة التقنية والتوصيات:")
        report.append("-" * 40)
        report.append("• بنية URL منظمة ومنطقية مع نظام ترقيم فعال")
        report.append("• تنوع كبير في المحتوى يغطي أسواق متعددة")
        report.append("• نظام إدارة محتوى متطور مع فهرسة ذكية")
        report.append("• يمكن استخدام هذا التحليل لتطوير:")
        report.append("  - نظام توصيات ذكي")
        report.append("  - محرك بحث متطور")
        report.append("  - نظام تصنيف تلقائي")
        report.append("  - أدوات تحليل المحتوى")
        report.append("")
        
        return "\n".join(report)
    
    def run_analysis(self):
        """تشغيل التحليل الكامل"""
        print("🔬 بدء التحليل المتقدم للأنماط...")
        
        self.load_links()
        self.analyze_url_patterns()
        self.analyze_content_distribution()
        self.analyze_popularity_indicators()
        self.analyze_technical_patterns()
        
        report = self.generate_advanced_insights_report()
        
        # حفظ التقرير
        output_file = f"تحليل_الأنماط_المتقدم_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"✅ تم إنشاء تقرير الأنماط المتقدم: {output_file}")
        return report

if __name__ == "__main__":
    analyzer = AdvancedPatternsAnalyzer()
    report = analyzer.run_analysis()
    print("\n" + "="*70)
    print(report)