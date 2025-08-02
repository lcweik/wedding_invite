import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const messagesFilePath = path.join(process.cwd(), 'data', 'guest-messages.json')

// 确保数据目录存在
async function ensureDataDirectory() {
  const dataDir = path.dirname(messagesFilePath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// 读取消息文件
async function readMessagesFile() {
  try {
    await ensureDataDirectory()
    const fileContent = await fs.readFile(messagesFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // 如果文件不存在，返回空数组
    return []
  }
}

// 写入消息文件
async function writeMessagesFile(messages: any[]) {
  await ensureDataDirectory()
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8')
}

// GET - 获取所有消息
export async function GET() {
  try {
    const messages = await readMessagesFile()
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read messages' },
      { status: 500 }
    )
  }
}

// POST - 添加新消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attendeeCount, message } = body

    if (!name || !message || !attendeeCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      attendeeCount: parseInt(attendeeCount),
      message,
      timestamp: new Date().toISOString()
    }

    const messages = await readMessagesFile()
    messages.push(newMessage)
    await writeMessagesFile(messages)

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    )
  }
}

// DELETE - 删除消息
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const messages = await readMessagesFile()
    const filteredMessages = messages.filter((msg: any) => msg.id !== id)
    await writeMessagesFile(filteredMessages)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
} 