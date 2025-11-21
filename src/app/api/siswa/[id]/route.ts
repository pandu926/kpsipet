import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single siswa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const siswa = await prisma.siswa.findUnique({
      where: { id_siswa: parseInt(id) },
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      }
    })

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch siswa' },
      { status: 500 }
    )
  }
}

// PUT update siswa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nisn, nama_siswa, kelas, kontak_ortu } = body

    // Check if siswa exists
    const existingSiswa = await prisma.siswa.findUnique({
      where: { id_siswa: parseInt(id) }
    })

    if (!existingSiswa) {
      return NextResponse.json(
        { error: 'Siswa not found' },
        { status: 404 }
      )
    }

    // Check if new NISN conflicts with another siswa
    if (nisn && nisn !== existingSiswa.nisn) {
      const nisnExists = await prisma.siswa.findUnique({
        where: { nisn }
      })

      if (nisnExists) {
        return NextResponse.json(
          { error: 'NISN already exists' },
          { status: 409 }
        )
      }
    }

    // Update siswa
    const siswa = await prisma.siswa.update({
      where: { id_siswa: parseInt(id) },
      data: {
        nisn: nisn || existingSiswa.nisn,
        nama_siswa: nama_siswa || existingSiswa.nama_siswa,
        kelas: kelas || existingSiswa.kelas,
        kontak_ortu: kontak_ortu || existingSiswa.kontak_ortu
      }
    })

    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update siswa' },
      { status: 500 }
    )
  }
}

// DELETE siswa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if siswa exists
    const siswa = await prisma.siswa.findUnique({
      where: { id_siswa: parseInt(id) },
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      }
    })

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa not found' },
        { status: 404 }
      )
    }

    // Check if siswa has pengaduan
    if (siswa._count.pengaduan > 0) {
      return NextResponse.json(
        { error: 'Cannot delete siswa with existing pengaduan' },
        { status: 400 }
      )
    }

    // Delete siswa
    await prisma.siswa.delete({
      where: { id_siswa: parseInt(id) }
    })

    return NextResponse.json({ message: 'Siswa deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete siswa' },
      { status: 500 }
    )
  }
}
