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
    return []
  }
}

// 写入消息文件
async function writeMessagesFile(messages: any[]) {
  await ensureDataDirectory()
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8')
}

// DELETE - 批量删除消息
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Message IDs array is required' },
        { status: 400 }
      )
    }

    const messages = await readMessagesFile()
    const filteredMessages = messages.filter((msg: any) => !ids.includes(msg.id))
    await writeMessagesFile(filteredMessages)

    return NextResponse.json({ 
      success: true, 
      deletedCount: messages.length - filteredMessages.length 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 }
    )
  }
} 