import { NextRequest, NextResponse } from 'next/server'
import { permit } from '@/lib/permit'

export async function POST(req: NextRequest) {
  const { user, action, resource } = await req.json()
  console.log('Permit check request:', { user, action, resource })
  try {
    const allowed = await permit.check(user, action, resource)
    console.log('Permit check result:', allowed)
    return NextResponse.json({ allowed })
  } catch (err: any) {
    console.error('Permit check error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
