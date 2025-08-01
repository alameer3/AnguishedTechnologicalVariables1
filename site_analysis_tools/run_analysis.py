#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت تشغيل أداة تحليل الموقع ولقطات الشاشة
Run Script for Website Analysis and Screenshot Tool
"""

import sys
import os
import subprocess
from datetime import datetime

def print_header():
    """طباعة ترويسة الأداة"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                    🚀 أداة تحليل المواقع الشاملة                ║
║                  Complete Website Analysis Tool             ║
║                                                              ║
║  📋 يقرأ الروابط من: روابط_AKWAM_ترتيب_هرمي_شامل.txt         ║
║  📸 يأخذ لقطات شاشة بصيغة PNG عالية الجودة                  ║
║  🔍 يحلل المحتوى والبيانات الوصفية                          ║
║  💾 يحفظ جميع الأصول والملفات                              ║
║  📊 يُنشئ تقارير شاملة ومفصلة                              ║
║  🗺️ يُنشئ خريطة الموقع XML                                ║
╚══════════════════════════════════════════════════════════════╝
    """)

def check_requirements():
    """فحص المتطلبات والتبعيات"""
    print("🔍 فحص المتطلبات...")
    
    # فحص ملف الروابط
    links_file = "روابط_AKWAM_ترتيب_هرمي_شامل.txt"
    if not os.path.exists(links_file):
        print(f"❌ لم يتم العثور على ملف الروابط: {links_file}")
        return False
    
    print(f"✅ تم العثور على ملف الروابط: {links_file}")
    
    # فحص المكتبات المطلوبة
    required_modules = [
        'playwright',
        'beautifulsoup4', 
        'fake_useragent',
        'nest_asyncio',
        'aiofiles',
        'PIL'
    ]
    
    missing_modules = []
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module} متوفر")
        except ImportError:
            missing_modules.append(module)
            print(f"❌ {module} غير متوفر")
    
    if missing_modules:
        print(f"\n⚠️ المكتبات المفقودة: {', '.join(missing_modules)}")
        print("يرجى تثبيت المكتبات المطلوبة أولاً")
        return False
    
    return True

def get_user_settings():
    """الحصول على إعدادات المستخدم"""
    print("\n⚙️ إعدادات التحليل:")
    print("=" * 50)
    
    settings = {}
    
    # عدد الصفحات القصوى
    try:
        max_pages = input("عدد الصفحات القصوى للتحليل (افتراضي: 100): ").strip()
        settings['max_pages'] = int(max_pages) if max_pages else 100
    except ValueError:
        settings['max_pages'] = 100
    
    # عمق التحليل
    try:
        max_depth = input("عمق التحليل (افتراضي: 2): ").strip()
        settings['max_depth'] = int(max_depth) if max_depth else 2
    except ValueError:
        settings['max_depth'] = 2
    
    # مجلد الحفظ
    output_dir = input("مجلد حفظ النتائج (افتراضي: site_analysis_complete): ").strip()
    settings['output_dir'] = output_dir if output_dir else "site_analysis_complete"
    
    print(f"""
📋 ملخص الإعدادات:
- الحد الأقصى للصفحات: {settings['max_pages']}
- عمق التحليل: {settings['max_depth']}
- مجلد الحفظ: {settings['output_dir']}
    """)
    
    confirm = input("هل تريد المتابعة بهذه الإعدادات؟ (y/n): ").strip().lower()
    if confirm not in ['y', 'yes', 'نعم', '']:
        print("تم إلغاء العملية.")
        return None
    
    return settings

def run_analysis():
    """تشغيل التحليل"""
    print_header()
    
    # فحص المتطلبات
    if not check_requirements():
        print("\n❌ فشل في فحص المتطلبات. يرجى إصلاح المشاكل أولاً.")
        return False
    
    # الحصول على إعدادات المستخدم
    settings = get_user_settings()
    if not settings:
        return False
    
    print("\n🚀 بدء تحليل الموقع...")
    print("=" * 50)
    
    start_time = datetime.now()
    
    try:
        # تشغيل أداة التحليل
        result = subprocess.run([
            sys.executable, 
            "screenshot_website.py"
        ], 
        capture_output=True, 
        text=True,
        cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        if result.returncode == 0:
            end_time = datetime.now()
            duration = end_time - start_time
            
            print("\n" + "=" * 60)
            print("🎉 تم الانتهاء من التحليل بنجاح!")
            print(f"⏱️ المدة الإجمالية: {duration.total_seconds():.2f} ثانية")
            print(f"📁 النتائج محفوظة في: {settings['output_dir']}")
            print("=" * 60)
            
            # طباعة المخرجات
            if result.stdout:
                print("\n📊 تفاصيل التحليل:")
                print(result.stdout)
            
            return True
        else:
            print(f"\n❌ فشل في تشغيل التحليل:")
            if result.stderr:
                print(result.stderr)
            return False
            
    except Exception as e:
        print(f"\n❌ خطأ في تشغيل التحليل: {e}")
        return False

def main():
    """الدالة الرئيسية"""
    try:
        success = run_analysis()
        if success:
            print("\n✅ تم إنجاز جميع المهام بنجاح!")
        else:
            print("\n❌ فشل في إنجاز بعض المهام.")
            return 1
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف العملية بواسطة المستخدم.")
        return 1
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)