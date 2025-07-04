export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
//pages/api/permit-check.ts
import { NextRequest, NextResponse } from 'next/server'
import { permit } from '@/lib/permit'

export async function POST(req: NextRequest) {
  const { user, action, resourceId } = await req.json()
  const { id, email } = user || {}

  // normalize to { type, id }
  const [type, idPart] = resourceId.includes(':')
    ? resourceId.split(':')
    : ['zego-one', resourceId]
  const resourceKey = `${type}:${idPart}`       // e.g. "zego-one:024c7…"
  const permissionKey = `${resourceKey}:${action}`   // e.g. "zego-one:024c7…:speak"
  const instancePermKey = `${type}:${action}`        // e.g. "zego-one:speak"

  console.log('Permit check request:', { id, email, action, resourceKey })

  try {
    let perms: Record<string, any> | null = null

    // Try by email first (if provided)
    if (email) {
      perms = await permit.getUserPermissions(email)
      const inst = perms[resourceKey]
      if (inst?.permissions.includes(instancePermKey)) {
        console.log('Permission granted via email')
        return NextResponse.json({ allowed: true })
      }
    }

    // If not allowed or no email, try by ID
    if (id) {
      perms = await permit.getUserPermissions(id)
      const inst = perms[resourceKey]
      if (inst?.permissions.includes(instancePermKey)) {
        console.log('Permission granted via user ID')
        return NextResponse.json({ allowed: true })
      }
    }

    // fallback check for global `listen` access
    if (action === 'listen') {
      const globalKey = '__tenant:default'
      if (perms?.[globalKey]?.permissions.includes(instancePermKey)) {
        console.log('Permission granted via global listen role')
        return NextResponse.json({ allowed: true })
      }
    }

    console.log('Permission denied')
    return NextResponse.json({ allowed: false })
  } catch (err: any) {
    console.error('Permit lookup error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}