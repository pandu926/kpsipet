import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all guru
export async function GET() {
  try {
    const guru = await prisma.guru.findMany({
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      },
      orderBy: {
        id_guru: 'desc'
      }
    })
    return NextResponse.json(guru)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch guru' },
      { status: 500 }
    )
  }
}

// POST create new guru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nip, nama_guru, no_telp } = body

    // Validation
    if (!nip || !nama_guru) {
      return NextResponse.json(
        { error: 'NIP and nama_guru are required' },
        { status: 400 }
      )
    }

    // Check if NIP already exists
    const existingGuru = await prisma.guru.findUnique({
      where: { nip }
    })

    if (existingGuru) {
      return NextResponse.json(
        { error: 'NIP already exists' },
        { status: 409 }
      )
    }

    // Create guru
    const guru = await prisma.guru.create({
      data: {
        nip,
        nama_guru,
        no_telp: no_telp || null
      }
    })

    return NextResponse.json(guru, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create guru' },
      { status: 500 }
    )
  }
}
