#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
高级字体优化工具
支持字体子集化、压缩、格式转换等多种优化方式
"""

import os
import sys
import json
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
import gzip
import shutil

class FontOptimizer:
    def __init__(self):
        self.font_dir = "public/font"
        self.output_dir = "public/font/optimized"
        
    def create_subset(self, input_font_path, output_font_path, text_content):
        """创建字体子集"""
        try:
            font = TTFont(input_font_path)
            
            options = Options()
            options.layout_features = ['*']
            options.hinting = True
            options.desubroutinize = False
            options.name_IDs = ['*']
            options.name_legacy = True
            options.name_languages = ['*']
            
            subsetter = Subsetter(options=options)
            subsetter.populate(text=text_content)
            subsetter.subset(font)
            
            font.save(output_font_path)
            
            original_size = os.path.getsize(input_font_path)
            subset_size = os.path.getsize(output_font_path)
            reduction = ((original_size - subset_size) / original_size) * 100
            
            return {
                'success': True,
                'original_size': original_size,
                'subset_size': subset_size,
                'reduction': reduction
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def compress_font(self, input_font_path, output_font_path):
        """压缩字体文件"""
        try:
            with open(input_font_path, 'rb') as f:
                data = f.read()
            
            with gzip.open(output_font_path, 'wb') as f:
                f.write(data)
            
            original_size = os.path.getsize(input_font_path)
            compressed_size = os.path.getsize(output_font_path)
            compression_ratio = ((original_size - compressed_size) / original_size) * 100
            
            return {
                'success': True,
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': compression_ratio
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_wedding_text(self):
        """获取婚礼请柬文本内容"""
        wedding_text = """
        🎉我们结婚啦！🎉
        ✨诚心邀请您来见证我们的幸福时刻✨
        👫新人介绍👫
        📅婚礼信息📅
        🎪婚礼行程安排🎪
        🎊诚心邀请🎊
        🎊期待您的到来🎊
        💌留下您的祝福💌
        💌收到的祝福💌
        江威张海雁
        经过多年的相知相守，我们决定携手走进婚姻的殿堂，共同开启人生的新篇章！
        时间地点
        荆门市掇刀区高新·凤凰湖酒店一楼凤凰苑
        2025年8月31日（星期天）
        迎宾签到户外仪式午宴用餐
        亲爱的朋友，我们诚心邀请您来参加我们的婚礼！您的到来将为我们的特别日子增添无限的喜悦和温暖。让我们一起见证这个美好的时刻，分享我们的幸福！
        您的姓名出席人数祝福语
        请输入您的姓名请输入您的祝福语
        提交祝福查看祝福隐藏祝福
        还没有收到祝福
        正在为您准备精美的电子请柬
        资源加载中已加载资源
        正在准备正在加载婚礼字体正在加载木瑶字体正在加载婚礼照片
        加载完成加载超时，正在跳过
        请稍候，我们正在为您准备最完美的体验
        正在加载
        0123456789
        年月日星期天
        人
        江威张海雁
        """
        
        punctuation = "，。！？；：""''（）【】《》…—"
        english_numbers = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        
        return wedding_text + punctuation + english_numbers
    
    def generate_css(self, font_files):
        """生成优化的CSS代码"""
        css_template = """/* 优化的字体定义 */
@font-face {
  font-family: 'TitleFont';
  src: url('/font/optimized/title_subset.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MuyaoFont';
  src: url('/font/optimized/muyao_subset.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* 字体预加载 */
<link rel="preload" href="/font/optimized/title_subset.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="/font/optimized/muyao_subset.ttf" as="font" type="font/ttf" crossorigin>
"""
        
        return css_template
    
    def optimize_all_fonts(self):
        """优化所有字体文件"""
        print("🎨 高级字体优化工具")
        print("=" * 60)
        
        # 创建输出目录
        os.makedirs(self.output_dir, exist_ok=True)
        
        font_files = {
            "title": "title.ttf",
            "muyao": "Muyao-Softbrush.ttf"
        }
        
        results = {}
        text_content = self.get_wedding_text()
        
        for font_name, font_file in font_files.items():
            input_path = os.path.join(self.font_dir, font_file)
            
            if not os.path.exists(input_path):
                print(f"❌ 字体文件不存在: {input_path}")
                continue
            
            print(f"\n📝 处理字体: {font_name}")
            print(f"📁 输入文件: {input_path}")
            
            # 子集化
            subset_path = os.path.join(self.output_dir, f"{font_name}_subset.ttf")
            subset_result = self.create_subset(input_path, subset_path, text_content)
            
            if subset_result['success']:
                print(f"✅ 子集化成功!")
                print(f"📊 原始大小: {subset_result['original_size'] / 1024:.1f} KB")
                print(f"📊 子集大小: {subset_result['subset_size'] / 1024:.1f} KB")
                print(f"📉 减少大小: {subset_result['reduction']:.1f}%")
                
                # 压缩
                compressed_path = os.path.join(self.output_dir, f"{font_name}_subset.gz")
                compress_result = self.compress_font(subset_path, compressed_path)
                
                if compress_result['success']:
                    print(f"✅ 压缩成功!")
                    print(f"📊 压缩大小: {compress_result['compressed_size'] / 1024:.1f} KB")
                    print(f"📉 压缩率: {compress_result['compression_ratio']:.1f}%")
                
                results[font_name] = {
                    'subset': subset_result,
                    'compress': compress_result
                }
            else:
                print(f"❌ 子集化失败: {subset_result['error']}")
        
        # 生成报告
        self.generate_report(results)
        
        # 生成CSS
        css_content = self.generate_css(font_files)
        css_path = os.path.join(self.output_dir, "optimized_fonts.css")
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css_content)
        
        print(f"\n📄 优化的CSS已保存到: {css_path}")
        print("🎉 所有字体优化完成!")
    
    def generate_report(self, results):
        """生成优化报告"""
        report = {
            'summary': {
                'total_fonts': len(results),
                'total_original_size': 0,
                'total_subset_size': 0,
                'total_compressed_size': 0
            },
            'fonts': results
        }
        
        for font_name, result in results.items():
            if result['subset']['success']:
                report['summary']['total_original_size'] += result['subset']['original_size']
                report['summary']['total_subset_size'] += result['subset']['subset_size']
                
                if result['compress']['success']:
                    report['summary']['total_compressed_size'] += result['compress']['compressed_size']
        
        # 计算总体节省
        if report['summary']['total_original_size'] > 0:
            subset_saving = ((report['summary']['total_original_size'] - report['summary']['total_subset_size']) / report['summary']['total_original_size']) * 100
            report['summary']['subset_saving_percent'] = subset_saving
            
            if report['summary']['total_compressed_size'] > 0:
                total_saving = ((report['summary']['total_original_size'] - report['summary']['total_compressed_size']) / report['summary']['total_original_size']) * 100
                report['summary']['total_saving_percent'] = total_saving
        
        # 保存报告
        report_path = os.path.join(self.output_dir, "optimization_report.json")
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📊 优化报告:")
        print(f"📁 总字体数: {report['summary']['total_fonts']}")
        print(f"📊 原始总大小: {report['summary']['total_original_size'] / 1024 / 1024:.2f} MB")
        print(f"📊 子集总大小: {report['summary']['total_subset_size'] / 1024 / 1024:.2f} MB")
        if 'subset_saving_percent' in report['summary']:
            print(f"📉 子集化节省: {report['summary']['subset_saving_percent']:.1f}%")
        if 'total_compressed_size' in report['summary'] and report['summary']['total_compressed_size'] > 0:
            print(f"📊 压缩总大小: {report['summary']['total_compressed_size'] / 1024 / 1024:.2f} MB")
            print(f"📉 总节省: {report['summary']['total_saving_percent']:.1f}%")
        
        print(f"📄 详细报告已保存到: {report_path}")

def main():
    optimizer = FontOptimizer()
    optimizer.optimize_all_fonts()

if __name__ == "__main__":
    main() 