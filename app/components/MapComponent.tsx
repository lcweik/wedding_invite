'use client'

import { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'

export default function MapComponent() {
  const [showMap, setShowMap] = useState(false)
  const [mapError, setMapError] = useState(false)

  const venueAddress = "荆门市掇刀区高新·凤凰湖酒店一楼凤凰苑"
  const baiduMapUrl = `https://api.map.baidu.com/geocoder?location=30.952,112.1927&output=html&src=webapp.baidu.openAPIdemo`

  // 尝试不同的地图URL
  const mapUrls = [
    '/api/map',
    '/map.html',
    '/map'
  ]

  const handleMapError = () => {
    setMapError(true)
  }

  return (
    <div className="cute-card p-6">
      <h2 className="text-3xl font-cartoon text-wedding-red mb-4 text-center animate-pulse">
        🗺️ 婚礼地点 🗺️
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="text-3xl">📍</div>
          <p className="text-gray-700 text-center font-medium font-bubble text-2xl">
            {venueAddress}
          </p>
        </div>
        
        {!showMap ? (
          <div className="text-center">
            <button
              onClick={() => setShowMap(true)}
              className="bg-gradient-to-r from-wedding-red to-wedding-blue text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all transform animate-pulse flex items-center justify-center space-x-2 mx-auto"
            >
              <div className="text-2xl">🗺️</div>
              <span>睇地图</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              {!mapError ? (
                <iframe
                  src={mapUrls[0]}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={handleMapError}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">地图加载失败</p>
                    <a
                      href={baiduMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-wedding-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      在百度地图中打开
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <a
                href={baiduMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-wedding-blue to-wedding-purple text-white px-6 py-3 rounded-2xl text-center hover:scale-105 transition-all transform font-bold flex items-center justify-center space-x-2"
              >
                <div className="text-xl">🔗</div>
                <span className="text-xl">喺百度地图度打开</span>
              </a>
              
              <button
                onClick={() => {
                  setShowMap(false)
                  setMapError(false)
                }}
                className="text-xl bg-gradient-to-r from-wedding-yellow to-wedding-pink text-gray-800 px-6 py-3 rounded-2xl hover:scale-105 transition-all transform font-bold"
              >
                🎯 收埋地图
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
} 