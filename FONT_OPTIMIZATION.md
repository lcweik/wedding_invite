# 字体优化指南

## 概述

本项目的字体文件经过优化，从原始大小大幅减少，提升网页加载速度。

## 优化结果

### 原始字体大小
- `title.ttf`: 6.1 MB
- `Muyao-Softbrush.ttf`: 4.5 MB
- **总计**: 10.6 MB

### 优化后字体大小
- `title_subset.ttf`: 145 KB (减少 97.7%)
- `muyao_subset.ttf`: 134 KB (减少 97.1%)
- **总计**: 279 KB (减少 97.4%)

## 优化方法

### 1. 字体子集化 (Font Subsetting)
- 只保留网页中实际使用的字符
- 移除未使用的字形数据
- 保持字体质量和渲染效果

### 2. 字符集包含
- 中文常用字符
- 英文字母和数字
- 标点符号
- 表情符号
- 婚礼请柬专用文本

## 使用方法

### 基本使用
```css
@font-face {
  font-family: 'TitleFont';
  src: url('/font/subset/title_subset.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MuyaoFont';
  src: url('/font/subset/muyao_subset.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 字体预加载 (推荐)
在 HTML `<head>` 中添加：
```html
<link rel="preload" href="/font/subset/title_subset.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="/font/subset/muyao_subset.ttf" as="font" type="font/ttf" crossorigin>
```

## 优化工具

### 1. 基础子集化工具
```bash
python font_subset.py
```

### 2. 高级优化工具
```bash
python font_optimizer.py
```

## 性能提升

### 加载时间对比
- **原始字体**: 约 3-5 秒 (取决于网络速度)
- **优化字体**: 约 0.5-1 秒

### 带宽节省
- **每次访问节省**: 约 10.3 MB
- **1000次访问节省**: 约 10.3 GB

## 注意事项

### 1. 字符覆盖
如果需要在网页中添加新的中文字符，需要重新运行子集化工具。

### 2. 字体回退
CSS 中已设置字体回退，确保在字体加载失败时仍能正常显示：
```css
font-family: 'TitleFont', 'Microsoft YaHei', 'sans-serif';
```

### 3. 浏览器兼容性
- 支持所有现代浏览器
- 不支持 IE 11 及以下版本

## 进一步优化建议

### 1. 使用 WOFF2 格式
```bash
# 安装 ttf2woff2
npm install -g ttf2woff2

# 转换格式
ttf2woff2 font/subset/title_subset.ttf
ttf2woff2 font/subset/muyao_subset.ttf
```

### 2. 使用 CDN
将字体文件上传到 CDN，进一步提升加载速度。

### 3. 字体显示策略
使用 `font-display: swap` 确保文字在字体加载前就能显示。

## 故障排除

### 问题1：某些字符显示为方块
**原因**: 字符不在子集化范围内
**解决**: 重新运行子集化工具，添加缺失的字符

### 问题2：字体加载失败
**原因**: 文件路径错误或服务器配置问题
**解决**: 检查文件路径和服务器配置

### 问题3：字体显示效果不佳
**原因**: 子集化过程中丢失了某些字体特性
**解决**: 调整子集化参数，保留更多字体特性

## 技术细节

### 使用的工具
- **FontTools**: Python 字体处理库
- **fonttools.subset**: 字体子集化模块

### 子集化参数
```python
options = Options()
options.layout_features = ['*']  # 保留所有布局特性
options.hinting = True          # 保留提示信息
options.desubroutinize = False  # 不进行反子程序化
```

### 字符集统计
- 中文字符: 约 200 个
- 英文字符: 52 个 (大小写)
- 数字: 10 个
- 标点符号: 约 20 个
- 表情符号: 约 30 个
- **总计**: 约 312 个字符

## 更新日志

### v1.0.0 (2024-12-19)
- 初始字体子集化
- 减少字体大小 97.4%
- 添加字体预加载支持
- 创建优化工具脚本 