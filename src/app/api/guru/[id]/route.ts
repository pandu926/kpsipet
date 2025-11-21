import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single guru
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const guru = await prisma.guru.findUnique({
      where: { id_guru: parseInt(id) },
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      }
    })

    if (!guru) {
      return NextResponse.json(
        { error: 'Guru not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guru)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch guru' },
      { status: 500 }
    )
  }
}

// PUT update guru
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nip, nama_guru, no_telp } = body

    // Check if guru exists
    const existingGuru = await prisma.guru.findUnique({
      where: { id_guru: parseInt(id) }
    })

    if (!existingGuru) {
      return NextResponse.json(
        { error: 'Guru not found' },
        { status: 404 }
      )
    }

    // Check if new NIP conflicts with another guru
    if (nip && nip !== existingGuru.nip) {
      const nipExists = await prisma.guru.findUnique({
        where: { nip }
      })

      if (nipExists) {
        return NextResponse.json(
          { error: 'NIP already exists' },
          { status: 409 }
        )
      }
    }

    // Update guru
    const guru = await prisma.guru.update({
      where: { id_guru: parseInt(id) },
      data: {
        nip: nip || existingGuru.nip,
        nama_guru: nama_guru || existingGuru.nama_guru,
        no_telp: no_telp !== undefined ? no_telp : existingGuru.no_telp
      }
    })

    return NextResponse.json(guru)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update guru' },
      { status: 500 }
    )
  }
}

// DELETE guru
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if guru exists
    const guru = await prisma.guru.findUnique({
      where: { id_guru: parseInt(id) },
      include: {
        _count: {
          select: {
            pengaduan: true
          }
        }
      }
    })

    if (!guru) {
      return NextResponse.json(
        { error: 'Guru not found' },
        { status: 404 }
      )
    }

    // Check if guru has pengaduan
    if (guru._count.pengaduan > 0) {
      return NextResponse.json(
        { error: 'Cannot delete guru with existing pengaduan' },
        { status: 400 }
      )
    }

    // Delete guru
    await prisma.guru.delete({
      where: { id_guru: parseInt(id) }
    })

    return NextResponse.json({ message: 'Guru deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete guru' },
      { status: 500 }
    )
  }
}
