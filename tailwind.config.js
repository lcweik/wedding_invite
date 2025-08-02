/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          red: '#FF6B6B', // 活泼的珊瑚红
          blue: '#4ECDC4', // 清新的青绿色
          pink: '#FFE5E5', // 柔和的浅粉色
          yellow: '#FFE66D', // 明亮的黄色
          purple: '#A8E6CF', // 薄荷绿
        }
      },
      fontFamily: {
        'title': ['TitleFont', 'Microsoft YaHei', 'sans-serif'],
        'muyao': ['MuyaoFont', 'Microsoft YaHei', 'sans-serif'],
        'cute': ['MuyaoFont', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
        'fun': ['TitleFont', 'Microsoft YaHei UI', 'sans-serif'],
        'playful': ['MuyaoFont', 'Microsoft YaHei', 'sans-serif'],
        'cartoon': ['TitleFont', 'Microsoft YaHei', 'sans-serif'],
        'bubble': ['MuyaoFont', 'Microsoft YaHei', 'sans-serif'],
        'kawaii': ['MuyaoFont', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-in',
        'slide-up': 'slideUp 0.8s ease-out',
        'bounce': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rainbow': 'rainbow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} 