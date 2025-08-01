#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت تشغيل أداة لقطات الشاشة المحسنة
Enhanced Screenshot Tool Runner
"""

import asyncio
import sys
import os
from enhanced_screenshot_website import EnhancedWebsiteScreenshotTool

def print_banner():
    """طباعة شعار الأداة"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                   أداة لقطات الشاشة المحسنة                   ║
║               Enhanced Website Screenshot Tool               ║
║                                                              ║
║   مطورة خصيصاً لبيئة Replit مع دعم كامل للقطات الشاشة PNG    ║
╚══════════════════════════════════════════════════════════════╝
    """)

def get_user_config():
    """الحصول على إعدادات المستخدم"""
    print("\n🔧 إعداد المعاملات:")
    
    # رابط الموقع
    base_url = input("أدخل رابط الموقع المراد تحليله (Enter للافتراضي https://ak.sv/): ").strip()
    if not base_url:
        base_url = "https://ak.sv/"
    
    # مجلد الحفظ
    output_dir = input("أدخل مجلد الحفظ (Enter للافتراضي site_analysis_complete): ").strip()
    if not output_dir:
        output_dir = "site_analysis_complete"
    
    # عدد الصفحات القصوى
    try:
        max_pages = input("عدد الصفحات القصوى للتحليل (Enter للافتراضي 30): ").strip()
        max_pages = int(max_pages) if max_pages else 30
    except ValueError:
        max_pages = 30
    
    # عمق التحليل
    try:
        max_depth = input("عمق التحليل (Enter للافتراضي 3): ").strip()
        max_depth = int(max_depth) if max_depth else 3
    except ValueError:
        max_depth = 3
    
    return {
        'base_url': base_url,
        'output_dir': output_dir,
        'max_pages': max_pages,
        'max_depth': max_depth
    }

async def run_tool_with_config(config):
    """تشغيل الأداة مع الإعدادات"""
    try:
        print(f"\n🚀 بدء التحليل...")
        print(f"📍 الموقع: {config['base_url']}")
        print(f"📁 مجلد الحفظ: {config['output_dir']}")
        print(f"📊 عدد الصفحات القصوى: {config['max_pages']}")
        print(f"🔍 عمق التحليل: {config['max_depth']}")
        print("-" * 60)
        
        # إنشاء الأداة مع الإعدادات المخصصة
        tool = EnhancedWebsiteScreenshotTool(
            base_url=config['base_url'],
            output_dir=config['output_dir']
        )
        
        # تطبيق الإعدادات المخصصة
        tool.max_pages = config['max_pages']
        tool.max_depth = config['max_depth']
        
        # تشغيل التحليل
        await tool.run_analysis()
        
        print("\n✅ تم الانتهاء من التحليل!")
        print(f"📁 يمكنك العثور على النتائج في: {config['output_dir']}")
        print(f"🖼️ لقطات الشاشة في: {os.path.join(config['output_dir'], 'screenshots')}")
        
        return True
        
    except KeyboardInterrupt:
        print("\n⚠️ تم إيقاف التحليل بواسطة المستخدم")
        return False
    except Exception as e:
        print(f"\n❌ خطأ في تشغيل الأداة: {e}")
        return False

def main():
    """الدالة الرئيسية"""
    print_banner()
    
    # فحص المتطلبات
    try:
        import playwright
        import aiofiles
        from PIL import Image
        print("✅ جميع المكتبات المطلوبة متوفرة")
    except ImportError as e:
        print(f"❌ مكتبة مفقودة: {e}")
        print("تأكد من تثبيت جميع المتطلبات أولاً")
        sys.exit(1)
    
    # الحصول على إعدادات المستخدم
    config = get_user_config()
    
    # تشغيل الأداة
    try:
        result = asyncio.run(run_tool_with_config(config))
        if result:
            print("\n🎉 تم التحليل بنجاح!")
        else:
            print("\n❌ فشل التحليل")
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")

if __name__ == "__main__":
    main()