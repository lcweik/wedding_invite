'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, MapPin, Clock, Music, Volume2, VolumeX } from 'lucide-react'
import MapComponent from './MapComponent'

export default function WeddingInviteContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [showMusicPrompt, setShowMusicPrompt] = useState(false)
  const [blessings, setBlessings] = useState('')
  const [guestName, setGuestName] = useState('')
  const [attendeeCount, setAttendeeCount] = useState('1')
  const [submittedBlessings, setSubmittedBlessings] = useState<string[]>([])
  const [showMap, setShowMap] = useState(false)
  const [showAllBlessings, setShowAllBlessings] = useState(false)
  const [allBlessings, setAllBlessings] = useState<any[]>([])
  const [userHasManuallyControlled, setUserHasManuallyControlled] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 为每个卡片创建 ref
  const titleRef = useRef(null)
  const coupleRef = useRef(null)
  const weddingInfoRef = useRef(null)
  const mapRef = useRef(null)
  const scheduleRef = useRef(null)
  const invitationRef = useRef(null)
  const bottomInfoRef = useRef(null)
  const blessingsFormRef = useRef(null)
  const blessingsDisplayRef = useRef(null)

  // 使用 useInView hook 检测每个卡片是否在视口中
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" })
  const coupleInView = useInView(coupleRef, { once: true, margin: "-100px" })
  const weddingInfoInView = useInView(weddingInfoRef, { once: true, margin: "-100px" })
  const mapInView = useInView(mapRef, { once: true, margin: "-100px" })
  const scheduleInView = useInView(scheduleRef, { once: true, margin: "-100px" })
  const invitationInView = useInView(invitationRef, { once: true, margin: "-100px" })
  const bottomInfoInView = useInView(bottomInfoRef, { once: true, margin: "-100px" })
  const blessingsFormInView = useInView(blessingsFormRef, { once: true, margin: "-100px" })

  // 自动滚动效果
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (containerRef.current) {
        const scrollHeight = containerRef.current.scrollHeight
        const clientHeight = containerRef.current.clientHeight
        const scrollTop = containerRef.current.scrollTop
        
        // 如果还没有滚动到底部，继续滚动
        if (scrollTop < scrollHeight - clientHeight) {
          containerRef.current.scrollBy({ top: 1, behavior: 'auto' })
        }
        // 如果已经滚动到底部，停止滚动（不执行任何操作）
      }
    }, 50)

    return () => clearInterval(scrollInterval)
  }, [])

  // 自动播放背景音乐
  useEffect(() => {
    const autoPlayMusic = async () => {
      if (audioRef.current && !isPlaying && !audioError && !userHasManuallyControlled) {
        try {
          audioRef.current.volume = 0.3 // 设置较低的音量
          await audioRef.current.play()
          setIsPlaying(true)
          setAudioError(false)
          setShowMusicPrompt(false)
        } catch (error) {
          console.log('自动播放失败，需要用户交互:', error)
          // 显示音乐播放提示
          setShowMusicPrompt(true)
        }
      }
    }

    // 延迟显示提示，给自动播放一个机会
    const timer = setTimeout(() => {
      if (!isPlaying && !audioError && !userHasManuallyControlled) {
        setShowMusicPrompt(true)
      }
    }, 2000)

    // 立即尝试播放
    autoPlayMusic()

    // 监听用户交互事件，一旦用户与页面交互就尝试播放
    const handleUserInteraction = async () => {
      if (!isPlaying && !audioError && !userHasManuallyControlled) {
        await autoPlayMusic()
        // 移除事件监听器，避免重复触发
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    }

    // 添加用户交互事件监听
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [isPlaying, audioError, userHasManuallyControlled])

  // 背景音乐控制
  const toggleMusic = async () => {
    // 标记用户已经手动控制过音乐
    setUserHasManuallyControlled(true)
    
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          // 设置音量
          audioRef.current.volume = 0.5
          await audioRef.current.play()
          setIsPlaying(true)
          setAudioError(false)
        }
      } catch (error) {
        console.error('音频播放失败:', error)
        setAudioError(true)
        setIsPlaying(false)
        // 显示用户友好的错误提示
        alert('音乐播放失败，请点击页面任意位置后再试！')
      }
    }
  }

  // 获取所有祝福
  const fetchAllBlessings = async () => {
    try {
      console.log('fetchAllBlessings called')
      const response = await fetch('/api/guest-data')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched blessings:', data)
        // 按时间戳倒序排序，最新的在最上面
        const sortedData = data.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setAllBlessings(sortedData)
      } else {
        console.error('Failed to fetch blessings, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching blessings:', error)
    }
  }

  // 切换显示所有祝福
  const toggleAllBlessings = async () => {
    console.log('toggleAllBlessings called, current showAllBlessings:', showAllBlessings)
    if (!showAllBlessings) {
      await fetchAllBlessings()
    }
    setShowAllBlessings(!showAllBlessings)
    console.log('setShowAllBlessings to:', !showAllBlessings)
  }

  // 提交祝福
  const submitBlessing = async () => {
    if (blessings.trim() && guestName.trim()) {
      const blessingWithInfo = `${guestName} (${attendeeCount}人): ${blessings}`
      setSubmittedBlessings([...submittedBlessings, blessingWithInfo])
      
      // 创建新的祝福对象
      const newBlessing = {
        id: Date.now().toString(),
        name: guestName,
        attendeeCount: parseInt(attendeeCount),
        message: blessings,
        timestamp: new Date().toISOString()
      }
      
      // 立即添加到本地状态，实现实时更新
      setAllBlessings(prev => [newBlessing, ...prev])
      
      // 如果祝福展示卡片没有显示，自动显示它
      if (!showAllBlessings) {
        setShowAllBlessings(true)
      }
      
      try {
        // 保存到 JSON 文件
        const response = await fetch('/api/guest-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: guestName,
            attendeeCount: parseInt(attendeeCount),
            message: blessings
          })
        })

        if (!response.ok) {
          console.error('Failed to save message')
        }
      } catch (error) {
        console.error('Error saving message:', error)
      }
      
      setBlessings('')
      setGuestName('')
      setAttendeeCount('1')
    }
  }

  // 生成浮动爱心
  const FloatingHearts = () => {
    const hearts = []
    for (let i = 0; i < 20; i++) {
      hearts.push(
        <div
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          <Heart size={20 + Math.random() * 20} />
        </div>
      )
    }
    return <div className="floating-hearts">{hearts}</div>
  }

  return (
    <div className="min-h-screen wedding-gradient relative overflow-hidden">
      <FloatingHearts />
      

      
      {/* 背景音乐控制 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          disabled={audioError}
          className={`text-white hover:text-wedding-yellow transition-all ${
            audioError ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={audioError ? '音乐加载失败' : isPlaying ? '暂停音乐' : '播放音乐'}
        >
          {audioError ? (
            <div className="text-red-500 text-xs">❌</div>
          ) : isPlaying ? (
            <Volume2 size={24} />
          ) : (
            <VolumeX size={24} />
          )}
        </button>
      </div>

        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="/wedding-music.mp3"
          onError={() => {
            setAudioError(true)
          }}
          onEnded={() => setIsPlaying(false)}
        />

      {/* 主内容区域 */}
      <div 
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="max-w-md mx-auto px-4 py-8 space-y-12">
          
          {/* 标题区域 */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 50 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="text-center pt-16"
          >
            <h1 className="text-4xl font-title text-wedding-red text-shadow mb-4 animate-bounce">
              🎉 我们结婚啦！ 🎉
            </h1>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Heart className="text-wedding-red heart-beat" size={32} />
              <span className="text-2xl animate-pulse">💕</span>
              <Heart className="text-wedding-red heart-beat" size={32} />
            </div>
            <p className="text-3xl font-muyao text-gray-700 animate-wiggle">
              ✨ 诚心邀请您来见证我们的幸福时刻 ✨
            </p>
          </motion.div>

          {/* 新人介绍 */}
          <motion.div
            ref={coupleRef}
            initial={{ opacity: 0, y: 50 }}
            animate={coupleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6 text-center"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 animate-pulse">
              👫 新人介绍 👫
            </h2>
            <div className="space-y-4">
              {/* 婚礼照片 */}
              <div className="mb-6">
                <div className="relative w-full max-w-sm mx-auto">
                  <img
                    src="/wedding.jpg"
                    alt="江威与张海雁的婚礼照片"
                    className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl border-4 border-wedding-yellow"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('图片加载失败:', e);
                      // 如果图片加载失败，尝试使用备用图片
                      const target = e.target as HTMLImageElement;
                      target.src = '/wedding-backup.jpg';
                    }}
                  />
                </div>
              </div>
              <div className="text-4xl font-muyao">
                <span className="text-wedding-blue font-bold">江威</span>
                <span className="mx-4 text-5xl animate-bounce">💕</span>
                <span className="text-wedding-blue font-bold">张海雁</span>
              </div>
              <p className="text-2xl font-muyao text-gray-700">
                🎊 经过多年的相知相守，我们决定携手走进婚姻的殿堂，
                共同开启人生的新篇章！ 🎊
              </p>
            </div>
          </motion.div>

          {/* 婚礼信息 */}
          <motion.div
            ref={weddingInfoRef}
            initial={{ opacity: 0, y: 50 }}
            animate={weddingInfoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 text-center animate-pulse">
              📅 婚礼信息 📅
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4">
                <div className="text-3xl">⏰</div>
                <div>
                  <p className="font-bold text-gray-800 font-muyao text-2xl">时间</p>
                  <p className="text-gray-700 font-muyao text-2xl">2025年8月31日（星期天）</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4">
                <div className="text-3xl">📍</div>
                <div>
                  <p className="font-bold text-gray-800 font-muyao text-2xl">地点</p>
                  <p className="text-gray-700 font-muyao text-2xl">荆门市掇刀区高新·凤凰湖酒店一楼凤凰苑</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 地图 */}
          <motion.div
            ref={mapRef}
            initial={{ opacity: 0, y: 50 }}
            animate={mapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
          >
            <MapComponent />
          </motion.div>

          {/* 婚礼行程 */}
          <motion.div
            ref={scheduleRef}
            initial={{ opacity: 0, y: 50 }}
            animate={scheduleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 text-center animate-pulse">
              🎪 婚礼行程安排 🎪
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-white/50 rounded-2xl p-4">
                <div className="text-2xl animate-bounce">🎉</div>
                <div>
                  <p className="font-bold text-gray-800 font-muyao text-2xl">10:00</p>
                  <p className="text-gray-700 font-muyao text-2xl">迎宾签到</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 rounded-2xl p-4">
                <div className="text-2xl animate-bounce">💒</div>
                <div>
                  <p className="font-bold text-gray-800 font-muyao text-2xl">10:38</p>
                  <p className="text-gray-700 font-muyao text-2xl">户外仪式</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/50 rounded-2xl p-4">
                <div className="text-2xl animate-bounce">🍽️</div>
                <div>
                  <p className="font-bold text-gray-800 font-muyao text-2xl">12:00</p>
                  <p className="text-gray-700 font-muyao text-2xl">午宴用餐</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 邀请语 */}
          <motion.div
            ref={invitationRef}
            initial={{ opacity: 0, y: 50 }}
            animate={invitationInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6 text-center"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 animate-pulse">
              🎊 诚心邀请 🎊
            </h2>
            <p className="text-2xl font-muyao text-gray-700 leading-relaxed">
              💝 亲爱的朋友，我们诚心邀请您来参加我们的婚礼！
              🎉 您的到来将为我们的特别日子增添无限的喜悦和温暖。
              ✨ 让我们一起见证这个美好的时刻，分享我们的幸福！ ✨
            </p>
          </motion.div>

          {/* 底部信息 */}
          <motion.div
            ref={bottomInfoRef}
            initial={{ opacity: 0, y: 50 }}
            animate={bottomInfoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6 text-center"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 animate-pulse">
              🎊 期待您的到来 🎊
            </h2>
            <p className="text-3xl font-muyao text-gray-700 mb-4">
              💕 江威 & 张海雁 💕
            </p>
            <div className="flex justify-center space-x-4">
              <span className="text-4xl animate-bounce">💖</span>
              <span className="text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>💖</span>
              <span className="text-4xl animate-bounce" style={{animationDelay: '0.4s'}}>💖</span>
            </div>
          </motion.div>

          {/* 祝福留言 */}
          <motion.div
            ref={blessingsFormRef}
            initial={{ opacity: 0, y: 50 }}
            animate={blessingsFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
            className="cute-card p-6"
          >
            <h2 className="text-3xl font-title text-wedding-red mb-4 text-center animate-pulse">
              💌 留下您的祝福 💌
            </h2>
            <div className="space-y-4">
              {/* 姓名输入 */}
              <div className="space-y-2">
                <label className="block text-2xl font-muyao text-gray-800">
                  👤 您的姓名
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="请输入您的姓名..."
                  className="w-full p-4 border-4 border-wedding-yellow rounded-2xl focus:outline-none focus:ring-4 focus:ring-wedding-yellow font-muyao text-2xl"
                  style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
                />
              </div>
              
              {/* 出席人数选择 */}
              <div className="space-y-2">
                <label className="block text-2xl font-muyao text-gray-800">
                  👥 出席人数
                </label>
                <select
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  aria-label="选择出席人数"
                  className="w-full p-4 border-4 border-wedding-yellow rounded-2xl focus:outline-none focus:ring-4 focus:ring-wedding-yellow font-muyao text-2xl bg-white"
                  style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
                >
                  <option value="1">1人</option>
                  <option value="2">2人</option>
                  <option value="3">3人</option>
                  <option value="4">4人</option>
                  <option value="5">5人</option>
                  <option value="6">6人</option>
                  <option value="7">7人</option>
                  <option value="8">8人</option>
                  <option value="9">9人</option>
                  <option value="10">10人</option>
                </select>
              </div>
              
              {/* 祝福语输入 */}
              <div className="space-y-2">
                <label className="block text-2xl font-muyao text-gray-800">
                  💝 祝福语
                </label>
                <textarea
                  value={blessings}
                  onChange={(e) => setBlessings(e.target.value)}
                  placeholder="✨ 请输入您的祝福语... ✨"
                  className="w-full p-4 border-4 border-wedding-yellow rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-wedding-yellow font-muyao text-2xl"
                  rows={3}
                  style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
                />
              </div>
              
              <button
                onClick={submitBlessing}
                disabled={!guestName.trim() || !blessings.trim()}
                className="w-full bg-gradient-to-r from-wedding-red to-wedding-blue text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all transform animate-pulse disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                🎉 提交祝福 🎉
              </button>
            </div>
            
            {/* 查看祝福按钮 */}
            <div className="mt-6 text-center">
              <button
                onClick={toggleAllBlessings}
                className="text-wedding-red font-muyao text-2xl hover:underline transition-all"
              >
                {showAllBlessings ? '🙈 隐藏祝福 🙈' : '💌 查看祝福 💌'}
              </button>
            </div>
          </motion.div>

          {/* 祝福展示卡片 */}
          {showAllBlessings && (
            <motion.div
              ref={blessingsDisplayRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="cute-card p-6"
              onAnimationStart={() => console.log('Blessings card animation started')}
              onAnimationComplete={() => console.log('Blessings card animation completed')}
            >
            <h2 className="text-3xl font-title text-wedding-red mb-4 text-center animate-pulse">
              💌 收到的祝福 💌
            </h2>
            <div className="space-y-3 overflow-y-auto" style={{ height: '60vh' }}>
              {allBlessings.length > 0 ? (
                allBlessings.map((blessing) => (
                  <div key={blessing.id} className="bg-white/50 rounded-lg p-4 border-2 border-wedding-yellow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-wedding-blue font-muyao text-2xl" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>{blessing.name}</span>
                      <span className="bg-wedding-blue text-white px-3 py-1 rounded-lg text-sm font-bold" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                        {blessing.attendeeCount}人
                      </span>
                    </div>
                    <p className="text-gray-700 font-muyao text-2xl leading-relaxed" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>{blessing.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 font-muyao text-2xl py-8" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                  <div className="text-4xl mb-4">💝</div>
                  还没有收到祝福
                </div>
              )}
            </div>
            </motion.div>
          )}

          {/* 底部间距 */}
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  )
} 