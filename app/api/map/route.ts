import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // 读取public目录下的map.html文件
    const filePath = join(process.cwd(), 'public', 'map.html')
    const htmlContent = readFileSync(filePath, 'utf-8')
    
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error reading map.html:', error)
    return new NextResponse('Map not found', { status: 404 })
  }
} 