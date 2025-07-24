#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
أداة التحليل المتطورة الشاملة لموقع AKWAM
تحليل عميق ومتقدم لفهم كل شيء في الموقع
"""

import requests
import re
import json
import time
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import unquote, urljoin, urlparse
from collections import defaultdict, Counter
import trafilatura
import lxml.html
from dataclasses import dataclass
from typing import Dict, List, Any, Optional

@dataclass
class ContentMetadata:
    id: str
    title: str
    url: str
    content_type: str
    language: str
    year: Optional[str] = None
    quality: Optional[str] = None
    genre: Optional[str] = None
    rating: Optional[str] = None
    episode_number: Optional[str] = None
    season_number: Optional[str] = None
    series_name: Optional[str] = None

class AdvancedSiteAnalyzer:
    def __init__(self):
        self.session = self.setup_session()
        self.analysis_results = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'site_structure': {},
            'content_catalog': {},
            'technical_analysis': {},
            'user_experience': {},
            'security_analysis': {},
            'performance_metrics': {},
            'content_metadata': [],
            'link_patterns': {},
            'discovery_insights': {}
        }
        self.processed_urls = set()
        self.content_database = []
        
    def setup_session(self):
        """إعداد جلسة HTTP محسنة"""
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ar,en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        return session
    
    def load_links_from_file(self, filename='site_links.txt'):
        """تحميل الروابط من الملف"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # استخراج جميع الروابط
            links = re.findall(r'https://ak\.sv[^\s]*', content)
            unique_links = list(set(links))
            
            print(f"✅ تم تحميل {len(unique_links)} رابط فريد من أصل {len(links)} رابط")
            return unique_links
            
        except Exception as e:
            print(f"❌ خطأ في تحميل الملف: {e}")
            return []
    
    def analyze_url_patterns(self, links):
        """تحليل أنماط الروابط"""
        patterns = {
            'movies': [],
            'series': [],
            'episodes': [],
            'shows': [],
            'mix': [],
            'admin_pages': [],
            'hash_links': [],
            'main_pages': [],
            'other': []
        }
        
        id_ranges = {
            'movies': {'min': float('inf'), 'max': 0, 'ids': []},
            'series': {'min': float('inf'), 'max': 0, 'ids': []},
            'episodes': {'min': float('inf'), 'max': 0, 'ids': []},
            'shows': {'min': float('inf'), 'max': 0, 'ids': []},
            'mix': {'min': float('inf'), 'max': 0, 'ids': []}
        }
        
        for link in links:
            decoded_link = unquote(link)
            
            # تحليل الأفلام
            if '/movie/' in link:
                match = re.search(r'/movie/(\d+)/', link)
                if match:
                    movie_id = int(match.group(1))
                    patterns['movies'].append(decoded_link)
                    id_ranges['movies']['ids'].append(movie_id)
                    id_ranges['movies']['min'] = min(id_ranges['movies']['min'], movie_id)
                    id_ranges['movies']['max'] = max(id_ranges['movies']['max'], movie_id)
            
            # تحليل المسلسلات
            elif '/series/' in link:
                match = re.search(r'/series/(\d+)/', link)
                if match:
                    series_id = int(match.group(1))
                    patterns['series'].append(decoded_link)
                    id_ranges['series']['ids'].append(series_id)
                    id_ranges['series']['min'] = min(id_ranges['series']['min'], series_id)
                    id_ranges['series']['max'] = max(id_ranges['series']['max'], series_id)
            
            # تحليل الحلقات
            elif '/episode/' in link:
                match = re.search(r'/episode/(\d+)/', link)
                if match:
                    episode_id = int(match.group(1))
                    patterns['episodes'].append(decoded_link)
                    id_ranges['episodes']['ids'].append(episode_id)
                    id_ranges['episodes']['min'] = min(id_ranges['episodes']['min'], episode_id)
                    id_ranges['episodes']['max'] = max(id_ranges['episodes']['max'], episode_id)
            
            # تحليل العروض
            elif '/shows/' in link:
                match = re.search(r'/shows/(\d+)/', link)
                if match:
                    show_id = int(match.group(1))
                    patterns['shows'].append(decoded_link)
                    id_ranges['shows']['ids'].append(show_id)
                    id_ranges['shows']['min'] = min(id_ranges['shows']['min'], show_id)
                    id_ranges['shows']['max'] = max(id_ranges['shows']['max'], show_id)
            
            # تحليل المنوعات
            elif '/mix/' in link:
                match = re.search(r'/mix/(\d+)/', link)
                if match:
                    mix_id = int(match.group(1))
                    patterns['mix'].append(decoded_link)
                    id_ranges['mix']['ids'].append(mix_id)
                    id_ranges['mix']['min'] = min(id_ranges['mix']['min'], mix_id)
                    id_ranges['mix']['max'] = max(id_ranges['mix']['max'], mix_id)
            
            # الصفحات الإدارية
            elif any(admin in link for admin in ['/ad-policy', '/contactus', '/dmca', '/AKWAM-Notifications']):
                patterns['admin_pages'].append(decoded_link)
            
            # الروابط المرجعية
            elif '/#' in link:
                patterns['hash_links'].append(decoded_link)
            
            # الصفحات الرئيسية
            elif link in ['https://ak.sv/', 'https://ak.sv/ones', 'https://ak.sv/movies', 'https://ak.sv/series', 'https://ak.sv/shows', 'https://ak.sv/mix']:
                patterns['main_pages'].append(decoded_link)
            
            else:
                patterns['other'].append(decoded_link)
        
        # تنظيف id_ranges من القيم اللانهائية
        for content_type in id_ranges:
            if id_ranges[content_type]['min'] == float('inf'):
                id_ranges[content_type]['min'] = 0
        
        return patterns, id_ranges
    
    def extract_content_metadata(self, link, content_type):
        """استخراج البيانات الوصفية للمحتوى"""
        metadata = None
        
        try:
            if content_type == 'movie':
                match = re.search(r'/movie/(\d+)/([^?]*)', link)
                if match:
                    movie_id, movie_name = match.groups()
                    metadata = ContentMetadata(
                        id=movie_id,
                        title=unquote(movie_name).replace('-', ' '),
                        url=link,
                        content_type='movie',
                        language=self.detect_language(movie_name)
                    )
            
            elif content_type == 'series':
                match = re.search(r'/series/(\d+)/([^?]*)', link)
                if match:
                    series_id, series_name = match.groups()
                    # البحث عن معلومات الموسم
                    season_match = re.search(r'الموسم-(\w+)', series_name)
                    season_number = season_match.group(1) if season_match else None
                    
                    metadata = ContentMetadata(
                        id=series_id,
                        title=unquote(series_name).replace('-', ' '),
                        url=link,
                        content_type='series',
                        language=self.detect_language(series_name),
                        season_number=season_number
                    )
            
            elif content_type == 'episode':
                match = re.search(r'/episode/(\d+)/([^/]+)/([^?]*)', link)
                if match:
                    episode_id, series_name, episode_name = match.groups()
                    
                    # البحث عن رقم الحلقة
                    episode_match = re.search(r'الحلقة-(\d+)', episode_name)
                    episode_number = episode_match.group(1) if episode_match else None
                    
                    metadata = ContentMetadata(
                        id=episode_id,
                        title=unquote(episode_name).replace('-', ' '),
                        url=link,
                        content_type='episode',
                        language=self.detect_language(series_name),
                        series_name=unquote(series_name).replace('-', ' '),
                        episode_number=episode_number
                    )
            
        except Exception as e:
            print(f"⚠️ خطأ في استخراج البيانات الوصفية: {e}")
        
        return metadata
    
    def detect_language(self, text):
        """كشف اللغة من النص"""
        arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text))
        total_chars = len(re.sub(r'[^a-zA-Z\u0600-\u06FF]', '', text))
        
        if total_chars == 0:
            return 'unknown'
        
        arabic_ratio = arabic_chars / total_chars
        
        if arabic_ratio > 0.7:
            return 'arabic'
        elif arabic_ratio > 0.3:
            return 'mixed'
        else:
            return 'english'
    
    def analyze_site_structure(self, base_url='https://ak.sv'):
        """تحليل بنية الموقع"""
        print("🏗️ تحليل بنية الموقع...")
        
        try:
            response = self.session.get(base_url, timeout=15)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # تحليل القوائم والتنقل
                navigation = self.extract_navigation_structure(soup)
                
                # تحليل البنية التقنية
                technical_structure = self.analyze_technical_structure(response.text, soup)
                
                # تحليل المحتوى الرئيسي
                main_content = self.analyze_main_content_structure(soup)
                
                self.analysis_results['site_structure'] = {
                    'navigation': navigation,
                    'technical': technical_structure,
                    'content_layout': main_content,
                    'page_load_time': response.elapsed.total_seconds()
                }
                
                print("✅ تم تحليل بنية الموقع")
                
        except Exception as e:
            print(f"❌ خطأ في تحليل بنية الموقع: {e}")
    
    def extract_navigation_structure(self, soup):
        """استخراج بنية التنقل"""
        navigation = {
            'main_menu': [],
            'footer_links': [],
            'breadcrumbs': [],
            'category_links': []
        }
        
        # القائمة الرئيسية
        nav_elements = soup.find_all(['nav', 'ul', 'div'], class_=re.compile(r'nav|menu|header', re.I))
        for nav in nav_elements:
            links = nav.find_all('a')
            for link in links[:20]:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                if href and text:
                    navigation['main_menu'].append({
                        'text': text,
                        'url': href,
                        'is_internal': href.startswith('/') or 'ak.sv' in href
                    })
        
        # روابط التذييل
        footer = soup.find('footer') or soup.find('div', class_=re.compile(r'footer', re.I))
        if footer:
            footer_links = footer.find_all('a')
            for link in footer_links:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                if href and text:
                    navigation['footer_links'].append({
                        'text': text,
                        'url': href
                    })
        
        return navigation
    
    def analyze_technical_structure(self, html, soup):
        """تحليل البنية التقنية الشامل"""
        technical = {
            'meta_tags': {},
            'scripts': [],
            'stylesheets': [],
            'external_resources': [],
            'encoding': 'utf-8',
            'doctype': 'HTML5' if '<!DOCTYPE html>' in html.upper() else 'Other',
            'html_structure': {},
            'all_tags': {},
            'attributes_analysis': {},
            'text_content': {},
            'hidden_elements': {},
            'interactive_elements': {},
            'multimedia_elements': {},
            'seo_elements': {},
            'security_elements': {}
        }
        
        # تحليل جميع العلامات في الصفحة
        all_tags = soup.find_all()
        tag_counter = Counter([tag.name for tag in all_tags])
        technical['all_tags'] = dict(tag_counter)
        
        # Meta tags تحليل مفصل
        meta_tags = soup.find_all('meta')
        for meta in meta_tags:
            name = meta.get('name') or meta.get('property') or meta.get('http-equiv')
            content = meta.get('content')
            if name and content:
                technical['meta_tags'][name] = content
        
        # Scripts تحليل مفصل
        scripts = soup.find_all('script')
        for script in scripts:
            script_info = {
                'src': script.get('src', ''),
                'type': script.get('type', 'text/javascript'),
                'content_length': len(script.get_text()) if script.get_text() else 0,
                'has_inline_code': bool(script.get_text().strip()),
                'is_external': bool(script.get('src')),
                'async': script.has_attr('async'),
                'defer': script.has_attr('defer')
            }
            if script_info['src']:
                script_info['is_external_domain'] = not (script_info['src'].startswith('/') or 'ak.sv' in script_info['src'])
            technical['scripts'].append(script_info)
        
        # Stylesheets تحليل مفصل
        links = soup.find_all('link')
        for link in links:
            if link.get('rel') == ['stylesheet'] or 'stylesheet' in str(link.get('rel', [])):
                style_info = {
                    'href': link.get('href', ''),
                    'media': link.get('media', 'all'),
                    'type': link.get('type', 'text/css'),
                    'is_external': not (link.get('href', '').startswith('/') or 'ak.sv' in link.get('href', ''))
                }
                technical['stylesheets'].append(style_info)
        
        # تحليل العناصر التفاعلية
        forms = soup.find_all('form')
        buttons = soup.find_all('button')
        inputs = soup.find_all('input')
        selects = soup.find_all('select')
        textareas = soup.find_all('textarea')
        
        technical['interactive_elements'] = {
            'forms': len(forms),
            'buttons': len(buttons),
            'inputs': len(inputs),
            'selects': len(selects),
            'textareas': len(textareas),
            'form_details': [
                {
                    'method': form.get('method', 'get'),
                    'action': form.get('action', ''),
                    'enctype': form.get('enctype', 'application/x-www-form-urlencoded')
                } for form in forms
            ],
            'input_types': Counter([inp.get('type', 'text') for inp in inputs])
        }
        
        # تحليل عناصر الوسائط المتعددة
        images = soup.find_all('img')
        videos = soup.find_all('video')
        audios = soup.find_all('audio')
        iframes = soup.find_all('iframe')
        objects = soup.find_all('object')
        embeds = soup.find_all('embed')
        
        technical['multimedia_elements'] = {
            'images': len(images),
            'videos': len(videos),
            'audios': len(audios),
            'iframes': len(iframes),
            'objects': len(objects),
            'embeds': len(embeds),
            'image_formats': Counter([img.get('src', '').split('.')[-1].lower() for img in images if img.get('src') and '.' in img.get('src')]),
            'lazy_loading': len([img for img in images if img.get('loading') == 'lazy']),
            'alt_texts': len([img for img in images if img.get('alt')])
        }
        
        # تحليل عناصر SEO
        title = soup.find('title')
        h_tags = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        canonical = soup.find('link', rel='canonical')
        
        technical['seo_elements'] = {
            'title': title.get_text() if title else '',
            'title_length': len(title.get_text()) if title else 0,
            'heading_tags': Counter([h.name for h in h_tags]),
            'total_headings': len(h_tags),
            'canonical_url': canonical.get('href') if canonical else '',
            'meta_description': technical['meta_tags'].get('description', ''),
            'meta_keywords': technical['meta_tags'].get('keywords', ''),
            'og_tags': {k: v for k, v in technical['meta_tags'].items() if k.startswith('og:')},
            'twitter_tags': {k: v for k, v in technical['meta_tags'].items() if k.startswith('twitter:')},
            'robots': technical['meta_tags'].get('robots', '')
        }
        
        # تحليل العناصر المخفية والمشروطة
        hidden_elements = soup.find_all(attrs={'style': re.compile(r'display:\s*none|visibility:\s*hidden', re.I)})
        comments = soup.find_all(string=lambda text: isinstance(text, type(soup.new_string(''))) and text.parent.name == '[document]')
        
        technical['hidden_elements'] = {
            'hidden_by_style': len(hidden_elements),
            'html_comments': len([c for c in soup.contents if str(type(c)) == "<class 'bs4.Comment'>"]),
            'conditional_comments': len(re.findall(r'<!--\[if.*?\]>.*?<!\[endif\]-->', html, re.DOTALL)),
            'noscript_tags': len(soup.find_all('noscript'))
        }
        
        # تحليل عناصر الأمان
        technical['security_elements'] = {
            'csrf_tokens': len(soup.find_all('input', {'name': re.compile(r'csrf|token', re.I)})),
            'https_links': len([a for a in soup.find_all('a', href=True) if a['href'].startswith('https://')]),
            'http_links': len([a for a in soup.find_all('a', href=True) if a['href'].startswith('http://')]),
            'external_links': len([a for a in soup.find_all('a', href=True) if not a['href'].startswith('/') and 'ak.sv' not in a['href'] and a['href'].startswith('http')]),
            'email_links': len([a for a in soup.find_all('a', href=True) if a['href'].startswith('mailto:')]),
            'tel_links': len([a for a in soup.find_all('a', href=True) if a['href'].startswith('tel:')])
        }
        
        # تحليل بنية HTML
        html_structure = soup.find('html')
        head = soup.find('head')
        body = soup.find('body')
        
        technical['html_structure'] = {
            'html_lang': html_structure.get('lang', '') if html_structure else '',
            'html_dir': html_structure.get('dir', '') if html_structure else '',
            'head_elements': len(head.find_all()) if head else 0,
            'body_elements': len(body.find_all()) if body else 0,
            'total_elements': len(all_tags),
            'max_nesting_depth': self.calculate_max_depth(soup) if soup else 0
        }
        
        # تحليل النصوص والمحتوى
        all_text = soup.get_text()
        technical['text_content'] = {
            'total_characters': len(all_text),
            'total_words': len(all_text.split()),
            'paragraphs': len(soup.find_all('p')),
            'lists': len(soup.find_all(['ul', 'ol'])),
            'list_items': len(soup.find_all('li')),
            'tables': len(soup.find_all('table')),
            'table_rows': len(soup.find_all('tr')),
            'table_cells': len(soup.find_all(['td', 'th']))
        }
        
        return technical
    
    def calculate_max_depth(self, element, current_depth=0):
        """حساب أقصى عمق للعناصر المتداخلة"""
        if not element.children:
            return current_depth
        
        max_child_depth = current_depth
        for child in element.children:
            if hasattr(child, 'children'):
                child_depth = self.calculate_max_depth(child, current_depth + 1)
                max_child_depth = max(max_child_depth, child_depth)
        
        return max_child_depth
    
    def analyze_main_content_structure(self, soup):
        """تحليل بنية المحتوى الرئيسي"""
        content_structure = {
            'content_sections': [],
            'media_elements': {},
            'interactive_elements': {},
            'layout_type': 'unknown'
        }
        
        # البحث عن أقسام المحتوى
        main_content = soup.find('main') or soup.find('div', class_=re.compile(r'main|content|container', re.I))
        
        if main_content:
            # تحليل الأقسام
            sections = main_content.find_all(['section', 'div', 'article'], class_=re.compile(r'section|block|item|card', re.I))
            for section in sections[:10]:
                section_info = {
                    'tag': section.name,
                    'class': section.get('class', []),
                    'content_preview': section.get_text(strip=True)[:200]
                }
                content_structure['content_sections'].append(section_info)
        
        # عناصر الوسائط
        images = soup.find_all('img')
        videos = soup.find_all('video')
        iframes = soup.find_all('iframe')
        
        content_structure['media_elements'] = {
            'images_count': len(images),
            'videos_count': len(videos),
            'iframes_count': len(iframes),
            'has_lazy_loading': any('lazy' in img.get('loading', '') for img in images)
        }
        
        # العناصر التفاعلية
        forms = soup.find_all('form')
        buttons = soup.find_all('button')
        inputs = soup.find_all('input')
        
        content_structure['interactive_elements'] = {
            'forms_count': len(forms),
            'buttons_count': len(buttons),
            'inputs_count': len(inputs),
            'has_search': any('search' in input.get('type', '') or 'search' in input.get('class', []) for input in inputs)
        }
        
        return content_structure
    
    def deep_content_analysis(self, links):
        """تحليل عميق للمحتوى"""
        print("🔍 بدء التحليل العميق للمحتوى...")
        
        content_analysis = {
            'movies': {'count': 0, 'samples': [], 'metadata': []},
            'series': {'count': 0, 'samples': [], 'metadata': []},
            'episodes': {'count': 0, 'samples': [], 'metadata': []},
            'shows': {'count': 0, 'samples': [], 'metadata': []},
            'mix': {'count': 0, 'samples': [], 'metadata': []}
        }
        
        # تحليل عينات من كل نوع محتوى
        for link in links[:50]:  # تحليل أول 50 رابط كعينة
            try:
                if '/movie/' in link:
                    metadata = self.extract_content_metadata(link, 'movie')
                    if metadata:
                        content_analysis['movies']['metadata'].append(metadata)
                        content_analysis['movies']['count'] += 1
                
                elif '/series/' in link:
                    metadata = self.extract_content_metadata(link, 'series')
                    if metadata:
                        content_analysis['series']['metadata'].append(metadata)
                        content_analysis['series']['count'] += 1
                
                elif '/episode/' in link:
                    metadata = self.extract_content_metadata(link, 'episode')
                    if metadata:
                        content_analysis['episodes']['metadata'].append(metadata)
                        content_analysis['episodes']['count'] += 1
                
            except Exception as e:
                print(f"⚠️ خطأ في تحليل الرابط {link}: {e}")
        
        self.analysis_results['content_catalog'] = content_analysis
        print(f"✅ تم تحليل {sum(cat['count'] for cat in content_analysis.values())} عنصر محتوى")
    
    def analyze_content_trends(self, metadata_list):
        """تحليل اتجاهات المحتوى"""
        trends = {
            'language_distribution': Counter(),
            'content_type_distribution': Counter(),
            'popular_keywords': Counter(),
            'naming_patterns': []
        }
        
        for metadata in metadata_list:
            if hasattr(metadata, 'language'):
                trends['language_distribution'][metadata.language] += 1
            if hasattr(metadata, 'content_type'):
                trends['content_type_distribution'][metadata.content_type] += 1
            
            # استخراج الكلمات المفتاحية من العناوين
            if hasattr(metadata, 'title'):
                words = re.findall(r'\w+', metadata.title.lower())
                for word in words:
                    if len(word) > 3:  # تجاهل الكلمات القصيرة
                        trends['popular_keywords'][word] += 1
        
        return trends
    
    def perform_comprehensive_analysis(self):
        """تنفيذ التحليل الشامل"""
        print("🚀 بدء التحليل الشامل المتطور...")
        
        # تحميل الروابط
        links = self.load_links_from_file()
        if not links:
            print("❌ لا توجد روابط للتحليل")
            return
        
        # تحليل أنماط الروابط
        patterns, id_ranges = self.analyze_url_patterns(links)
        self.analysis_results['link_patterns'] = {
            'patterns': patterns,
            'id_ranges': id_ranges,
            'total_links': len(links),
            'pattern_distribution': {k: len(v) for k, v in patterns.items()}
        }
        
        # تحليل بنية الموقع
        self.analyze_site_structure()
        
        # التحليل العميق للمحتوى
        self.deep_content_analysis(links)
        
        # تحليل الاتجاهات
        all_metadata = []
        for category in self.analysis_results['content_catalog'].values():
            all_metadata.extend(category.get('metadata', []))
        
        trends = self.analyze_content_trends(all_metadata)
        self.analysis_results['discovery_insights'] = trends
        
        # حفظ النتائج
        self.save_analysis_results()
        
        print("✅ تم إكمال التحليل الشامل المتطور")
    
    def save_analysis_results(self):
        """حفظ نتائج التحليل"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # حفظ JSON مفصل
        json_filename = f'advanced_analysis_{timestamp}.json'
        with open(json_filename, 'w', encoding='utf-8') as f:
            # تحويل ContentMetadata objects إلى dictionaries
            json_data = self.convert_analysis_to_json()
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        # حفظ تقرير نصي مقروء
        report_filename = f'تقرير_التحليل_المتطور_{timestamp}.md'
        self.generate_readable_report(report_filename)
        
        print(f"💾 تم حفظ النتائج في:")
        print(f"   - {json_filename}")
        print(f"   - {report_filename}")
    
    def convert_analysis_to_json(self):
        """تحويل نتائج التحليل إلى JSON"""
        json_data = dict(self.analysis_results)
        
        # تحويل ContentMetadata objects
        for category in json_data.get('content_catalog', {}).values():
            if 'metadata' in category:
                category['metadata'] = [
                    {
                        'id': m.id,
                        'title': m.title,
                        'url': m.url,
                        'content_type': m.content_type,
                        'language': m.language,
                        'year': m.year,
                        'quality': m.quality,
                        'genre': m.genre,
                        'rating': m.rating,
                        'episode_number': m.episode_number,
                        'season_number': m.season_number,
                        'series_name': m.series_name
                    } for m in category['metadata']
                ]
        
        return json_data
    
    def generate_readable_report(self, filename):
        """إنشاء تقرير نصي مقروء"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"""# تقرير التحليل المتطور الشامل لموقع AKWAM

**تاريخ التحليل:** {self.analysis_results['timestamp']}

## 📊 نظرة عامة على النتائج

### إجمالي الروابط المحللة
- **العدد الإجمالي:** {self.analysis_results.get('link_patterns', {}).get('total_links', 0):,}
- **الأفلام:** {len(self.analysis_results.get('link_patterns', {}).get('patterns', {}).get('movies', [])):,}
- **المسلسلات:** {len(self.analysis_results.get('link_patterns', {}).get('patterns', {}).get('series', [])):,}
- **الحلقات:** {len(self.analysis_results.get('link_patterns', {}).get('patterns', {}).get('episodes', [])):,}
- **العروض التلفزيونية:** {len(self.analysis_results.get('link_patterns', {}).get('patterns', {}).get('shows', [])):,}
- **المنوعات:** {len(self.analysis_results.get('link_patterns', {}).get('patterns', {}).get('mix', [])):,}

## 🔢 تحليل معرفات المحتوى

""")
            
            # كتابة تحليل نطاقات المعرفات
            id_ranges = self.analysis_results.get('link_patterns', {}).get('id_ranges', {})
            for content_type, ranges in id_ranges.items():
                if ranges.get('ids'):
                    f.write(f"""### {content_type.upper()}
- **أصغر معرف:** {ranges['min']:,}
- **أكبر معرف:** {ranges['max']:,}
- **إجمالي المعرفات:** {len(ranges['ids']):,}
- **النطاق:** {ranges['max'] - ranges['min']:,}

""")
            
            # تحليل اللغات
            insights = self.analysis_results.get('discovery_insights', {})
            if insights.get('language_distribution'):
                f.write("""## 🌐 توزيع اللغات

""")
                for lang, count in insights['language_distribution'].most_common():
                    f.write(f"- **{lang}:** {count:,}\n")
                f.write("\n")
            
            # الكلمات المفتاحية الشائعة
            if insights.get('popular_keywords'):
                f.write("""## 🔑 الكلمات المفتاحية الأكثر شيوعاً

""")
                for keyword, count in insights['popular_keywords'].most_common(20):
                    f.write(f"- **{keyword}:** {count:,}\n")
                f.write("\n")
            
            # تحليل بنية الموقع
            site_structure = self.analysis_results.get('site_structure', {})
            if site_structure:
                f.write("""## 🏗️ تحليل بنية الموقع

### التنقل الرئيسي
""")
                navigation = site_structure.get('navigation', {})
                main_menu = navigation.get('main_menu', [])
                for item in main_menu[:10]:
                    f.write(f"- **{item.get('text', 'بدون نص')}:** {item.get('url', 'بدون رابط')}\n")
                
                f.write(f"""

### المعلومات التقنية
- **وقت تحميل الصفحة:** {site_structure.get('page_load_time', 0):.2f} ثانية
- **عدد الـ Scripts:** {len(site_structure.get('technical', {}).get('scripts', []))}
- **عدد أوراق الأنماط:** {len(site_structure.get('technical', {}).get('stylesheets', []))}

""")
            
            f.write("""## 🎯 توصيات التحسين

### للمطورين
1. **تحسين الأداء:** تقليل وقت تحميل الصفحة
2. **تحسين SEO:** إضافة meta tags أكثر تفصيلاً
3. **تحسين التنقل:** تبسيط هيكل القوائم

### لمحتوى
1. **تنظيم أفضل:** تصنيف المحتوى حسب اللغة والنوع
2. **بيانات وصفية:** إضافة معلومات أكثر للأفلام والمسلسلات
3. **البحث:** تحسين خوارزمية البحث

---

*تم إنشاء هذا التقرير بواسطة أداة التحليل المتطورة الشاملة*
""")

if __name__ == "__main__":
    analyzer = AdvancedSiteAnalyzer()
    analyzer.perform_comprehensive_analysis()