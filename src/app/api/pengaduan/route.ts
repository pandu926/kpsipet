import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all pengaduan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status_laporan: status as any } : {}

    const pengaduan = await prisma.pengaduan.findMany({
      where,
      include: {
        guru: {
          select: {
            id_guru: true,
            nama_guru: true,
            nip: true
          }
        },
        siswa: {
          select: {
            id_siswa: true,
            nama_siswa: true,
            nisn: true,
            kelas: true
          }
        },
        tindak_lanjut: {
          select: {
            id_tindak_lanjut: true,
            tgl_proses: true,
            catatan_admin: true
          }
        }
      },
      orderBy: {
        tgl_pengaduan: 'desc'
      }
    })
    return NextResponse.json(pengaduan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pengaduan' },
      { status: 500 }
    )
  }
}

// POST create new pengaduan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deskripsi_masalah, id_guru, id_siswa, status_laporan, alasan_penolakan } = body

    // Validation
    if (!deskripsi_masalah || !id_guru || !id_siswa) {
      return NextResponse.json(
        { error: 'deskripsi_masalah, id_guru, and id_siswa are required' },
        { status: 400 }
      )
    }

    // Verify guru exists
    const guruExists = await prisma.guru.findUnique({
      where: { id_guru: parseInt(id_guru) }
    })

    if (!guruExists) {
      return NextResponse.json(
        { error: 'Guru not found' },
        { status: 404 }
      )
    }

    // Verify siswa exists
    const siswaExists = await prisma.siswa.findUnique({
      where: { id_siswa: parseInt(id_siswa) }
    })

    if (!siswaExists) {
      return NextResponse.json(
        { error: 'Siswa not found' },
        { status: 404 }
      )
    }

    // Create pengaduan
    const pengaduan = await prisma.pengaduan.create({
      data: {
        tgl_pengaduan: new Date(),
        deskripsi_masalah,
        status_laporan: status_laporan || 'Menunggu',
        alasan_penolakan: alasan_penolakan || null,
        id_guru: parseInt(id_guru),
        id_siswa: parseInt(id_siswa)
      },
      include: {
        guru: true,
        siswa: true
      }
    })

    return NextResponse.json(pengaduan, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create pengaduan' },
      { status: 500 }
    )
  }
}
