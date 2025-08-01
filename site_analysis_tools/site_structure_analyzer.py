#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
محلل بنية الموقع - ترتيب خاص لفهم هيكل وبنية موقع AKWAM
"""

import re
import urllib.parse
from collections import defaultdict, OrderedDict
import json

class SiteStructureAnalyzer:
    def __init__(self, filename='site_links.txt'):
        self.filename = filename
        self.all_links = []
        self.structure_analysis = {}
        
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
        """تحليل أنماط URLs لفهم بنية الموقع"""
        patterns = {
            'main_sections': defaultdict(list),
            'content_types': defaultdict(list),
            'parameters': defaultdict(list),
            'depth_levels': defaultdict(list),
            'id_ranges': defaultdict(list),
            'language_patterns': defaultdict(list)
        }
        
        for link in self.all_links:
            # تحليل المسار الأساسي
            path = link.replace('https://ak.sv/', '')
            parts = path.split('/')
            
            # مستوى العمق
            depth = len([p for p in parts if p and not p.startswith('#') and '?' not in p])
            patterns['depth_levels'][f'depth_{depth}'].append(link)
            
            # أنواع المحتوى
            if '/movie/' in link:
                id_match = re.search(r'/movie/(\d+)/', link)
                if id_match:
                    movie_id = int(id_match.group(1))
                    patterns['content_types']['movies'].append((movie_id, link))
                    patterns['id_ranges']['movie_ids'].append(movie_id)
                    
            elif '/series/' in link:
                id_match = re.search(r'/series/(\d+)/', link)
                if id_match:
                    series_id = int(id_match.group(1))
                    patterns['content_types']['series'].append((series_id, link))
                    patterns['id_ranges']['series_ids'].append(series_id)
                    
            elif '/episode/' in link:
                id_match = re.search(r'/episode/(\d+)/', link)
                if id_match:
                    episode_id = int(id_match.group(1))
                    patterns['content_types']['episodes'].append((episode_id, link))
                    patterns['id_ranges']['episode_ids'].append(episode_id)
                    
            elif '/person/' in link:
                id_match = re.search(r'/person/(\d+)/', link)
                if id_match:
                    person_id = int(id_match.group(1))
                    patterns['content_types']['persons'].append((person_id, link))
                    patterns['id_ranges']['person_ids'].append(person_id)
                    
            elif '/shows/' in link or '/show/' in link:
                patterns['content_types']['shows'].append(link)
                
            elif '/mix/' in link:
                patterns['content_types']['mix'].append(link)
                
            # المعاملات والفلاتر
            if '?' in link:
                query_part = link.split('?')[1]
                params = query_part.split('&')
                for param in params:
                    if '=' in param:
                        key, value = param.split('=', 1)
                        patterns['parameters'][key].append(value)
                        
            # الأقسام الرئيسية
            if parts and parts[0]:
                main_section = parts[0].split('?')[0]  # إزالة المعاملات
                patterns['main_sections'][main_section].append(link)
                
            # أنماط اللغة
            if re.search(r'[\u0600-\u06FF]', link):
                patterns['language_patterns']['arabic'].append(link)
            else:
                patterns['language_patterns']['english'].append(link)
        
        return patterns
    
    def analyze_content_organization(self):
        """تحليل تنظيم المحتوى"""
        organization = {
            'navigation_structure': {},
            'content_hierarchy': {},
            'naming_conventions': {},
            'content_relationships': {}
        }
        
        # بنية التنقل
        main_pages = [link for link in self.all_links if link.count('/') <= 4 and '?' not in link]
        organization['navigation_structure'] = {
            'main_pages': len(main_pages),
            'categories': len([link for link in self.all_links if '?category=' in link]),
            'pages': len([link for link in self.all_links if '?page=' in link]),
            'tags': len([link for link in self.all_links if '?tag=' in link])
        }
        
        # اصطلاحات التسمية
        arabic_titles = []
        english_titles = []
        
        for link in self.all_links:
            title = link.split('/')[-1]
            if title:
                title = urllib.parse.unquote(title)
                if re.search(r'[\u0600-\u06FF]', title):
                    arabic_titles.append(title)
                else:
                    english_titles.append(title)
        
        organization['naming_conventions'] = {
            'arabic_titles': len(arabic_titles),
            'english_titles': len(english_titles),
            'total_titles': len(arabic_titles) + len(english_titles)
        }
        
        return organization
    
    def create_structure_understanding_file(self):
        """إنشاء ملف لفهم بنية الموقع"""
        patterns = self.analyze_url_patterns()
        organization = self.analyze_content_organization()
        
        output_content = []
        
        # العنوان
        output_content.append("# 🏗️ دليل فهم بنية موقع AKWAM")
        output_content.append("=" * 50)
        output_content.append(f"📊 إجمالي الروابط المحللة: {len(self.all_links):,}")
        output_content.append("🎯 الهدف: فهم تنظيم وهيكل الموقع")
        output_content.append("")
        
        # 1. الهيكل الأساسي للموقع
        output_content.append("## 1️⃣ الهيكل الأساسي للموقع")
        output_content.append("-" * 40)
        output_content.append("### الأقسام الرئيسية:")
        
        main_sections = dict(sorted(patterns['main_sections'].items(), key=lambda x: len(x[1]), reverse=True))
        for section, links in main_sections.items():
            if len(links) >= 5:  # عرض الأقسام المهمة فقط
                output_content.append(f"  📂 /{section}/ → {len(links):,} رابط")
                
                # عرض نماذج من كل قسم
                sample_links = links[:3]
                for sample in sample_links:
                    output_content.append(f"      ↳ {sample}")
                if len(links) > 3:
                    output_content.append(f"      ↳ ... و {len(links)-3:,} رابط آخر")
                output_content.append("")
        
        # 2. أنواع المحتوى ونطاقات IDs
        output_content.append("## 2️⃣ أنواع المحتوى ونطاقات الأرقام")
        output_content.append("-" * 40)
        
        content_types = ['movies', 'series', 'episodes', 'persons']
        for content_type in content_types:
            if content_type in patterns['content_types']:
                items = patterns['content_types'][content_type]
                if items:
                    ids = [item[0] if isinstance(item, tuple) else 0 for item in items]
                    ids = [id_val for id_val in ids if id_val > 0]
                    
                    if ids:
                        min_id, max_id = min(ids), max(ids)
                        output_content.append(f"### 📋 {content_type.upper()}")
                        output_content.append(f"  العدد: {len(items):,}")
                        output_content.append(f"  نطاق IDs: {min_id:,} - {max_id:,}")
                        output_content.append(f"  المدى: {max_id - min_id:,}")
                        output_content.append("")
                        
                        # أمثلة من البداية والوسط والنهاية
                        sorted_items = sorted(items, key=lambda x: x[0] if isinstance(x, tuple) else 0)
                        
                        output_content.append("  🔍 أمثلة:")
                        output_content.append("  الأقدم:")
                        for i, item in enumerate(sorted_items[:2]):
                            if isinstance(item, tuple):
                                id_val, link = item
                                title = urllib.parse.unquote(link.split('/')[-1])
                                output_content.append(f"    [{id_val:>5}] {title}")
                        
                        output_content.append("  الأحدث:")
                        for i, item in enumerate(sorted_items[-2:]):
                            if isinstance(item, tuple):
                                id_val, link = item
                                title = urllib.parse.unquote(link.split('/')[-1])
                                output_content.append(f"    [{id_val:>5}] {title}")
                        output_content.append("")
        
        # 3. نظام التصفح والفلترة
        output_content.append("## 3️⃣ نظام التصفح والفلترة")
        output_content.append("-" * 40)
        
        # المعاملات
        if patterns['parameters']:
            output_content.append("### معاملات التصفح:")
            param_stats = {}
            for param, values in patterns['parameters'].items():
                unique_values = len(set(values))
                param_stats[param] = {
                    'total': len(values),
                    'unique': unique_values,
                    'samples': list(set(values))[:5]
                }
            
            # ترتيب حسب الأهمية
            sorted_params = sorted(param_stats.items(), key=lambda x: x[1]['total'], reverse=True)
            
            for param, stats in sorted_params:
                output_content.append(f"  🔧 {param}:")
                output_content.append(f"    الاستخدام: {stats['total']:,} مرة")
                output_content.append(f"    القيم المختلفة: {stats['unique']:,}")
                output_content.append(f"    أمثلة: {', '.join(map(str, stats['samples']))}")
                output_content.append("")
        
        # 4. التوزيع حسب مستوى العمق
        output_content.append("## 4️⃣ التوزيع حسب عمق المسار")
        output_content.append("-" * 40)
        
        for depth, links in sorted(patterns['depth_levels'].items()):
            depth_num = depth.split('_')[1]
            percentage = len(links) / len(self.all_links) * 100
            output_content.append(f"📊 مستوى {depth_num}: {len(links):,} رابط ({percentage:.1f}%)")
            
            # أمثلة لكل مستوى
            samples = links[:3]
            for sample in samples:
                output_content.append(f"  ↳ {sample}")
            output_content.append("")
        
        # 5. تحليل اللغة والمحتوى
        output_content.append("## 5️⃣ تحليل اللغة والمحتوى")
        output_content.append("-" * 40)
        
        arabic_links = patterns['language_patterns']['arabic']
        english_links = patterns['language_patterns']['english']
        
        output_content.append(f"🇸🇦 المحتوى العربي: {len(arabic_links):,} ({len(arabic_links)/len(self.all_links)*100:.1f}%)")
        output_content.append(f"🌍 المحتوى الإنجليزي: {len(english_links):,} ({len(english_links)/len(self.all_links)*100:.1f}%)")
        output_content.append("")
        
        # أمثلة من المحتوى العربي
        if arabic_links:
            output_content.append("### نماذج من المحتوى العربي:")
            arabic_samples = arabic_links[:10]
            for sample in arabic_samples:
                title = urllib.parse.unquote(sample.split('/')[-1])
                content_type = "فيلم" if "/movie/" in sample else "مسلسل" if "/series/" in sample else "حلقة" if "/episode/" in sample else "محتوى"
                output_content.append(f"  • {content_type}: {title}")
            output_content.append("")
        
        # 6. ملخص البنية والاستنتاجات
        output_content.append("## 6️⃣ ملخص بنية الموقع والاستنتاجات")
        output_content.append("-" * 40)
        
        output_content.append("### خصائص بنية الموقع:")
        output_content.append("✅ نظام ترقيم منظم ومتسلسل للمحتوى")
        output_content.append("✅ تصنيف واضح حسب نوع المحتوى (أفلام، مسلسلات، حلقات)")
        output_content.append("✅ نظام فلترة متطور (فئات، صفحات، علامات)")
        output_content.append("✅ دعم المحتوى متعدد اللغات (عربي/إنجليزي)")
        output_content.append("✅ هيكل URL منطقي وقابل للفهم")
        output_content.append("")
        
        output_content.append("### نمط تنظيم المحتوى:")
        output_content.append("📋 الأفلام: نظام ID متسلسل مع عناوين واضحة")
        output_content.append("📋 المسلسلات: ترقيم منفصل مع ربط بالحلقات")
        output_content.append("📋 الحلقات: ترقيم فريد مع ربط بالمسلسل الأصلي")
        output_content.append("📋 الأشخاص: قاعدة بيانات شاملة للممثلين والمشاهير")
        output_content.append("")
        
        output_content.append("### قابلية الاستفادة لـ YEMEN_FLIX:")
        output_content.append("🎯 يمكن تطبيق نفس نظام الترقيم المنظم")
        output_content.append("🎯 استخدام بنية URL مشابهة للسهولة")
        output_content.append("🎯 تطبيق نظام فلترة متطور")
        output_content.append("🎯 دعم المحتوى العربي والدولي")
        output_content.append("🎯 إنشاء قاعدة بيانات شاملة للممثلين")
        
        output_content.append("")
        output_content.append("=" * 50)
        output_content.append("📖 تم إنشاء هذا الدليل لفهم بنية موقع AKWAM بعمق")
        output_content.append("🎯 الهدف: الاستفادة من التنظيم الممتاز في تطوير YEMEN_FLIX")
        
        # حفظ الملف
        with open('دليل_فهم_بنية_موقع_AKWAM.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(output_content))
        
        print(f"✅ تم إنشاء دليل فهم البنية: دليل_فهم_بنية_موقع_AKWAM.txt")
        print(f"🏗️ تم تحليل {len(self.all_links):,} رابط لفهم بنية الموقع")
        
        return output_content
    
    def run_structure_analysis(self):
        """تشغيل تحليل البنية"""
        print("🏗️ بدء تحليل بنية الموقع...")
        
        self.load_links()
        result = self.create_structure_understanding_file()
        
        print("🎯 تم إنشاء دليل شامل لفهم بنية وتنظيم الموقع")
        
        return result

if __name__ == "__main__":
    analyzer = SiteStructureAnalyzer()
    analyzer.run_structure_analysis()