import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single pengaduan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id_pengaduan: parseInt(id) },
      include: {
        guru: true,
        siswa: true,
        tindak_lanjut: {
          include: {
            user: {
              select: {
                id_user: true,
                username: true,
                role: true
              }
            },
            template: true
          }
        }
      }
    })

    if (!pengaduan) {
      return NextResponse.json(
        { error: 'Pengaduan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pengaduan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pengaduan' },
      { status: 500 }
    )
  }
}

// PUT update pengaduan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { deskripsi_masalah, status_laporan, alasan_penolakan, id_guru, id_siswa } = body

    // Check if pengaduan exists
    const existingPengaduan = await prisma.pengaduan.findUnique({
      where: { id_pengaduan: parseInt(id) }
    })

    if (!existingPengaduan) {
      return NextResponse.json(
        { error: 'Pengaduan not found' },
        { status: 404 }
      )
    }

    // If guru is being updated, verify it exists
    if (id_guru && id_guru !== existingPengaduan.id_guru) {
      const guruExists = await prisma.guru.findUnique({
        where: { id_guru: parseInt(id_guru) }
      })

      if (!guruExists) {
        return NextResponse.json(
          { error: 'Guru not found' },
          { status: 404 }
        )
      }
    }

    // If siswa is being updated, verify it exists
    if (id_siswa && id_siswa !== existingPengaduan.id_siswa) {
      const siswaExists = await prisma.siswa.findUnique({
        where: { id_siswa: parseInt(id_siswa) }
      })

      if (!siswaExists) {
        return NextResponse.json(
          { error: 'Siswa not found' },
          { status: 404 }
        )
      }
    }

    // Update pengaduan
    const pengaduan = await prisma.pengaduan.update({
      where: { id_pengaduan: parseInt(id) },
      data: {
        deskripsi_masalah: deskripsi_masalah || existingPengaduan.deskripsi_masalah,
        status_laporan: status_laporan || existingPengaduan.status_laporan,
        alasan_penolakan: alasan_penolakan !== undefined ? alasan_penolakan : existingPengaduan.alasan_penolakan,
        id_guru: id_guru ? parseInt(id_guru) : existingPengaduan.id_guru,
        id_siswa: id_siswa ? parseInt(id_siswa) : existingPengaduan.id_siswa
      },
      include: {
        guru: true,
        siswa: true
      }
    })

    return NextResponse.json(pengaduan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update pengaduan' },
      { status: 500 }
    )
  }
}

// DELETE pengaduan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if pengaduan exists
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id_pengaduan: parseInt(id) },
      include: {
        tindak_lanjut: true
      }
    })

    if (!pengaduan) {
      return NextResponse.json(
        { error: 'Pengaduan not found' },
        { status: 404 }
      )
    }

    // Delete tindak lanjut first if exists
    if (pengaduan.tindak_lanjut) {
      await prisma.tindakLanjut.delete({
        where: { id_pengaduan: parseInt(id) }
      })
    }

    // Delete pengaduan
    await prisma.pengaduan.delete({
      where: { id_pengaduan: parseInt(id) }
    })

    return NextResponse.json({ message: 'Pengaduan deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete pengaduan' },
      { status: 500 }
    )
  }
}
