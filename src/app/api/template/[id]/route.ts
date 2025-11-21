import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const template = await prisma.templateSurat.findUnique({
      where: { id_template: parseInt(id) },
      include: {
        _count: {
          select: {
            tindak_lanjut: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nama_template, isi_template } = body

    // Check if template exists
    const existingTemplate = await prisma.templateSurat.findUnique({
      where: { id_template: parseInt(id) }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update template
    const template = await prisma.templateSurat.update({
      where: { id_template: parseInt(id) },
      data: {
        nama_template: nama_template || existingTemplate.nama_template,
        isi_template: isi_template || existingTemplate.isi_template
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if template exists
    const template = await prisma.templateSurat.findUnique({
      where: { id_template: parseInt(id) },
      include: {
        _count: {
          select: {
            tindak_lanjut: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if template is being used
    if (template._count.tindak_lanjut > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template that is being used' },
        { status: 400 }
      )
    }

    // Delete template
    await prisma.templateSurat.delete({
      where: { id_template: parseInt(id) }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
