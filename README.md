# 婚礼邀请函 - 江威 & 张海雁

一个使用 Next.js 制作的精美婚礼邀请函网页，专为手机端优化设计。

## 功能特色

- 🎵 **背景音乐** - 支持播放/暂停背景音乐
- 🎨 **精美设计** - 浪漫的粉色渐变背景和玻璃效果
- 💝 **浮动爱心** - 动态的浮动爱心动画效果
- 📍 **地图导航** - 集成百度地图，方便查看婚礼地点
- 📱 **移动端优化** - 专为手机端设计的响应式布局
- ✨ **自动滚动** - 页面内容自动滚动展示
- 💌 **祝福留言** - 访客可以留下祝福语
- 🎭 **动画效果** - 使用 Framer Motion 的流畅动画

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
wedding_invite/
├── app/
│   ├── components/
│   │   └── MapComponent.tsx    # 地图组件
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 主页面
├── jpg/                        # 图片资源
├── public/                     # 静态资源
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 自定义配置

### 修改婚礼信息

在 `app/page.tsx` 中修改以下信息：

- 新人姓名
- 婚礼日期
- 婚礼地点
- 婚礼行程安排

### 添加背景音乐

将音乐文件放在 `public/` 目录下，命名为 `wedding-music.mp3`。

### 修改样式

在 `app/globals.css` 和 `tailwind.config.js` 中自定义颜色和样式。

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 自动部署完成

### 其他平台

项目可以部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- 阿里云
- 腾讯云

## 浏览器支持

- Chrome (推荐)
- Safari
- Firefox
- Edge

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发者。

---

💕 祝江威和张海雁新婚快乐，百年好合！ 💕 