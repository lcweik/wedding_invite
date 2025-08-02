#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
字体子集化工具
用于裁剪字体文件，只保留需要的字符，减小文件大小
"""

import os
import sys
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

def create_font_subset(input_font_path, output_font_path, text_content):
    """
    创建字体子集
    
    Args:
        input_font_path: 输入字体文件路径
        output_font_path: 输出字体文件路径
        text_content: 需要保留的文本内容
    """
    try:
        # 加载字体
        font = TTFont(input_font_path)
        
        # 创建子集化选项
        options = Options()
        options.layout_features = ['*']  # 保留所有布局特性
        options.hinting = True  # 保留提示信息
        options.desubroutinize = False  # 不进行反子程序化
        options.name_IDs = ['*']  # 保留所有名称ID
        options.name_legacy = True  # 保留传统名称
        options.name_languages = ['*']  # 保留所有语言
        
        # 创建子集化器
        subsetter = Subsetter(options=options)
        
        # 添加文本内容
        subsetter.populate(text=text_content)
        
        # 执行子集化
        subsetter.subset(font)
        
        # 保存子集化后的字体
        font.save(output_font_path)
        
        # 获取文件大小信息
        original_size = os.path.getsize(input_font_path)
        subset_size = os.path.getsize(output_font_path)
        reduction = ((original_size - subset_size) / original_size) * 100
        
        print(f"✅ 字体子集化完成!")
        print(f"📁 输入文件: {input_font_path}")
        print(f"📁 输出文件: {output_font_path}")
        print(f"📊 原始大小: {original_size / 1024:.1f} KB")
        print(f"📊 子集大小: {subset_size / 1024:.1f} KB")
        print(f"📉 减少大小: {reduction:.1f}%")
        
        return True
        
    except Exception as e:
        print(f"❌ 字体子集化失败: {e}")
        return False

def get_wedding_text():
    """
    获取婚礼请柬中使用的所有文本内容
    """
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
    婚礼后台管理
    """
    
    # 添加常用标点符号
    punctuation = "，。！？；：""''（）【】《》…—"
    
    # 添加英文字母和数字
    english_numbers = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    
    return wedding_text + punctuation + english_numbers

def main():
    """
    主函数
    """
    print("🎨 字体子集化工具")
    print("=" * 50)
    
    # 检查字体文件是否存在
    font_files = {
        "title": "public/font/title.ttf",
        "muyao": "public/font/Muyao-Softbrush.ttf"
    }
    
    for font_name, font_path in font_files.items():
        if not os.path.exists(font_path):
            print(f"❌ 字体文件不存在: {font_path}")
            continue
            
        print(f"\n📝 处理字体: {font_name}")
        
        # 创建输出目录
        output_dir = "public/font/subset"
        os.makedirs(output_dir, exist_ok=True)
        
        # 生成输出文件名
        output_path = os.path.join(output_dir, f"{font_name}_subset.ttf")
        
        # 获取需要保留的文本
        text_content = get_wedding_text()
        
        # 执行子集化
        success = create_font_subset(font_path, output_path, text_content)
        
        if success:
            print(f"✅ {font_name} 字体子集化成功!")
        else:
            print(f"❌ {font_name} 字体子集化失败!")
    
    print("\n🎉 所有字体处理完成!")
    print("📁 子集化后的字体文件保存在: public/font/subset/")

if __name__ == "__main__":
    main() 