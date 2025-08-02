'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Music, Image, Type } from 'lucide-react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('正在准备...')
  const [loadedResources, setLoadedResources] = useState<string[]>([])
  const [isTimeout, setIsTimeout] = useState(false)

  // 需要预加载的资源列表 - 使用子集化后的字体和完整版字体
  const resourcesToLoad = [
    { type: 'font', name: '婚礼字体', url: '/font/subset/title_subset.ttf', fontFamily: 'TitleFont' },
    { type: 'font', name: '木瑶字体', url: '/font/subset/muyao_subset.ttf', fontFamily: 'MuyaoFont' },
    { type: 'image', name: '婚礼照片', url: '/wedding.jpg' }
  ]

  useEffect(() => {
    let completedCount = 0
    const totalResources = resourcesToLoad.length
    let timeoutId: ReturnType<typeof setTimeout>

    // 设置10秒超时
    const startTimeout = () => {
      timeoutId = setTimeout(() => {
        console.warn('加载超时，强制跳过加载页面')
        setIsTimeout(true)
        setCurrentStep('加载超时，正在跳过...')
        setTimeout(() => {
          onLoadingComplete()
        }, 1000)
      }, 10000) // 10秒超时
    }

    // 清除超时
    const clearMainTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    const loadResource = async (resource: any) => {
      try {
        if (resource.type === 'font') {
          // 加载字体 - 添加超时控制
          console.log(`开始加载字体: ${resource.name}`);
          const font = new FontFace(resource.fontFamily, `url(${resource.url})`)
          
          // 为字体加载添加超时
          const fontLoadPromise = font.load()
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Font load timeout')), 5000) // 5秒字体加载超时
          })
          
          await Promise.race([fontLoadPromise, timeoutPromise])
          document.fonts.add(font)
          
          // 等待字体完全加载，但设置较短超时
          const fontsReadyPromise = document.fonts.ready
          const fontsTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Fonts ready timeout')), 3000) // 3秒字体应用超时
          })
          
          await Promise.race([fontsReadyPromise, fontsTimeoutPromise])
          console.log(`字体加载完成: ${resource.name}`);
                 } else if (resource.type === 'image') {
           // 加载图片 - 添加超时控制
           await new Promise<void>((resolve, reject) => {
             const img = new window.Image()
             const imgTimeout = setTimeout(() => {
               reject(new Error('Image load timeout'))
             }, 5000) // 5秒图片加载超时
             
             img.onload = () => {
               clearTimeout(imgTimeout)
               console.log(`图片加载成功: ${resource.url}`);
               resolve();
             }
             img.onerror = (error) => {
               clearTimeout(imgTimeout)
               console.error(`图片加载失败: ${resource.url}`, error);
               reject(new Error(`Failed to load image: ${resource.url}`));
             }
             img.src = resource.url
           })
                 } else if (resource.type === 'audio') {
           // 加载音频 - 添加超时控制
           await new Promise<void>((resolve, reject) => {
             const audio = new Audio()
             const audioTimeout = setTimeout(() => {
               reject(new Error('Audio load timeout'))
             }, 5000) // 5秒音频加载超时
             
             audio.oncanplaythrough = () => {
               clearTimeout(audioTimeout)
               resolve()
             }
             audio.onerror = () => {
               clearTimeout(audioTimeout)
               reject()
             }
             audio.src = resource.url
           })
        }

        completedCount++
        setLoadedResources(prev => [...prev, resource.name])
        setLoadingProgress((completedCount / totalResources) * 100)
        
        // 更新当前步骤
        if (completedCount < totalResources) {
          setCurrentStep(`正在加载 ${resourcesToLoad[completedCount]?.name}...`)
        } else {
          setCurrentStep('加载完成！')
        }

        // 所有资源加载完成
        if (completedCount === totalResources) {
          clearMainTimeout() // 清除超时
          // 对于字体资源，额外等待一下确保字体完全应用
          if (resource.type === 'font') {
            setTimeout(() => {
              onLoadingComplete()
            }, 500) // 字体加载完成后额外等待500ms
          } else {
            setTimeout(() => {
              onLoadingComplete()
            }, 1000) // 延迟1秒显示完成状态
          }
        }
      } catch (error) {
        console.error(`Failed to load ${resource.name}:`, error)
        
        // 对于字体资源，如果加载失败，只重试1次且时间更短
        if (resource.type === 'font') {
          console.log(`字体加载失败，尝试重试: ${resource.name}`);
          try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒后重试
            const font = new FontFace(resource.fontFamily, `url(${resource.url})`)
            await font.load()
            document.fonts.add(font)
            await document.fonts.ready;
            console.log(`字体重试成功: ${resource.name}`);
          } catch (retryError) {
            console.error(`字体重试失败: ${resource.name}`, retryError);
            console.error(`字体加载最终失败: ${resource.name}`);
            // 即使字体加载失败，也继续加载其他资源
          }
        }
        
        // 继续加载其他资源
        completedCount++
        setLoadedResources(prev => [...prev, `${resource.name} (跳过)`])
        setLoadingProgress((completedCount / totalResources) * 100)
        
        if (completedCount === totalResources) {
          clearMainTimeout() // 清除超时
          // 确保所有字体都已加载，但设置较短超时
          try {
            await Promise.race([
              document.fonts.ready,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Fonts ready timeout')), 2000))
            ])
          } catch (error) {
            console.warn('字体应用超时，继续加载页面')
          }
          
          setTimeout(() => {
            onLoadingComplete()
          }, 1000)
        }
      }
    }

    // 开始超时计时
    startTimeout()

    // 开始加载所有资源
    resourcesToLoad.forEach(loadResource)

    // 清理函数
    return () => {
      clearMainTimeout()
    }
  }, [onLoadingComplete])

  return (
    <div className="min-h-screen wedding-gradient flex items-center justify-center relative overflow-hidden">
      {/* 浮动爱心背景 */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="heart absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            <Heart 
              size={20 + Math.random() * 20} 
              className="text-wedding-red"
            />
          </div>
        ))}
      </div>

      {/* 主加载内容 */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-title text-wedding-red text-shadow mb-4 animate-bounce">
            🎉 我们结婚啦！ 🎉
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Heart className="text-wedding-red heart-beat" size={32} />
            <span className="text-2xl animate-pulse">💕</span>
            <Heart className="text-wedding-red heart-beat" size={32} />
          </div>
          <p className="text-2xl font-muyao text-gray-700">
            ✨ 正在为您准备精美的电子请柬 ✨
          </p>
        </motion.div>

        {/* 加载进度 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="cute-card p-6 mb-6"
        >
          <h2 className="text-2xl font-title text-wedding-red mb-4">
            📦 资源加载中...
          </h2>
          
          {/* 进度条 */}
          <div className="w-full bg-white/50 rounded-full h-4 mb-4 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isTimeout 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                  : 'bg-gradient-to-r from-wedding-red to-wedding-blue'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-lg font-muyao text-gray-700 mb-4">
            {currentStep}
          </p>
          
          <p className="text-sm font-muyao text-gray-600">
            {Math.round(loadingProgress)}% 完成
            {isTimeout && <span className="text-orange-600 ml-2">(超时跳过)</span>}
          </p>
        </motion.div>

        {/* 已加载资源列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="cute-card p-4"
        >
          <h3 className="text-lg font-title text-wedding-red mb-3">
            ✅ 已加载资源
          </h3>
          <div className="space-y-2">
            {loadedResources.map((resource, index) => (
              <motion.div
                key={resource}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-2 text-sm font-muyao text-gray-700"
              >
                <div className={resource.includes('(跳过)') ? 'text-orange-500' : 'text-green-500'}>
                  {resource.includes('(跳过)') ? '⚠️' : '✓'}
                </div>
                <span>{resource}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 加载提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm font-muyao text-gray-600">
            {isTimeout ? (
              '⏰ 加载超时，正在跳过...'
            ) : (
              '💝 请稍候，我们正在为您准备最完美的体验 💝'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
} 