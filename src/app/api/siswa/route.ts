import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all siswa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kelas = searchParams.get('kelas')

    const where = kelas ? { kelas } : {}

    const siswa = await prisma.siswa.findMany({
      where,
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      },
      orderBy: {
        id_siswa: 'desc'
      }
    })
    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch siswa' },
      { status: 500 }
    )
  }
}

// POST create new siswa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nisn, nama_siswa, kelas, kontak_ortu } = body

    // Validation
    if (!nisn || !nama_siswa || !kelas || !kontak_ortu) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if NISN already exists
    const existingSiswa = await prisma.siswa.findUnique({
      where: { nisn }
    })

    if (existingSiswa) {
      return NextResponse.json(
        { error: 'NISN already exists' },
        { status: 409 }
      )
    }

    // Create siswa
    const siswa = await prisma.siswa.create({
      data: {
        nisn,
        nama_siswa,
        kelas,
        kontak_ortu
      }
    })

    return NextResponse.json(siswa, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create siswa' },
      { status: 500 }
    )
  }
}
