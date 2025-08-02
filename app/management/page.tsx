'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Users, MessageCircle, BarChart3, RefreshCw } from 'lucide-react'

interface GuestMessage {
  id: string
  name: string
  attendeeCount: number
  message: string
  timestamp: string
}

export default function AdminPage() {
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // 从 API 获取数据
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/guest-data')
        if (response.ok) {
          const data = await response.json()
          setGuestMessages(data)
        } else {
          console.error('Failed to fetch messages')
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  // 刷新数据
  const refreshMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/guest-data')
      if (response.ok) {
        const data = await response.json()
        setGuestMessages(data)
      }
    } catch (error) {
      console.error('Error refreshing messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除选中的消息
  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) return
    
    try {
      const response = await fetch('/api/guest-data/batch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedMessages })
      })

      if (response.ok) {
        await refreshMessages()
        setSelectedMessages([])
      } else {
        console.error('Failed to delete messages')
      }
    } catch (error) {
      console.error('Error deleting messages:', error)
    }
  }

  // 删除单条消息
  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/guest-data?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await refreshMessages()
      } else {
        console.error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedMessages.length === guestMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(guestMessages.map(msg => msg.id))
    }
  }

  // 切换单条消息选择状态
  const toggleMessageSelection = (id: string) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter(msgId => msgId !== id))
    } else {
      setSelectedMessages([...selectedMessages, id])
    }
  }

  // 过滤消息
  const filteredMessages = guestMessages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 统计数据
  const totalGuests = guestMessages.reduce((sum, msg) => sum + msg.attendeeCount, 0)
  const totalMessages = guestMessages.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-title text-wedding-red mb-2">
            🎉 婚礼后台管理 🎉
          </h1>
          <p className="text-lg text-gray-600 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
            管理宾客祝福和出席统计
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-wedding-red">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>总祝福数</p>
                <p className="text-3xl font-bold text-wedding-red" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>{totalMessages}</p>
              </div>
              <MessageCircle className="text-wedding-red" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-wedding-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>总出席人数</p>
                <p className="text-3xl font-bold text-wedding-blue" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>{totalGuests}</p>
              </div>
              <Users className="text-wedding-blue" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-wedding-purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>平均出席</p>
                <p className="text-3xl font-bold text-wedding-purple" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                  {totalMessages > 0 ? (totalGuests / totalMessages).toFixed(1) : 0}
                </p>
              </div>
              <BarChart3 className="text-wedding-purple" size={32} />
            </div>
          </div>
        </motion.div>

        {/* 搜索和操作栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索姓名或祝福内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border-2 border-wedding-yellow rounded-xl focus:outline-none focus:ring-2 focus:ring-wedding-yellow font-muyao"
                style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
              />
            </div>
            
                         <div className="flex gap-3">
               <button
                 onClick={refreshMessages}
                 className="px-4 py-2 bg-wedding-green text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                 style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
               >
                 <RefreshCw size={16} />
                 刷新
               </button>
               
               <button
                 onClick={toggleSelectAll}
                 className="px-4 py-2 bg-wedding-yellow text-gray-800 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                 style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
               >
                 {selectedMessages.length === guestMessages.length ? '取消全选' : '全选'}
               </button>
               
               {selectedMessages.length > 0 && (
                 <button
                   onClick={deleteSelectedMessages}
                   className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                   style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}
                 >
                   <Trash2 size={16} />
                   删除选中 ({selectedMessages.length})
                 </button>
               )}
             </div>
          </div>
        </motion.div>

        {/* 消息列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                {searchTerm ? '没有找到匹配的祝福' : '还没有收到祝福'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    selectedMessages.includes(message.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => toggleMessageSelection(message.id)}
                        className="mt-1 w-4 h-4 text-wedding-red rounded focus:ring-wedding-red"
                        aria-label={`选择 ${message.name} 的祝福`}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800 font-muyao" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                            {message.name}
                          </h3>
                          <span className="bg-wedding-blue text-white px-2 py-1 rounded-lg text-sm font-bold" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                            {message.attendeeCount}人
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 font-muyao leading-relaxed" style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      title="删除此祝福"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-600 font-muyao"
        >
          <p style={{ fontFamily: 'MuyaoFontFull, MuyaoFont, Microsoft YaHei, sans-serif' }}>共 {filteredMessages.length} 条祝福记录</p>
        </motion.div>
      </div>
    </div>
  )
} 