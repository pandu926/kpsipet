import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all templates
export async function GET() {
  try {
    const templates = await prisma.templateSurat.findMany({
      include: {
        _count: {
          select: {
            tindak_lanjut: true
          }
        }
      },
      orderBy: {
        id_template: 'desc'
      }
    })
    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama_template, isi_template } = body

    // Validation
    if (!nama_template || !isi_template) {
      return NextResponse.json(
        { error: 'nama_template and isi_template are required' },
        { status: 400 }
      )
    }

    // Create template
    const template = await prisma.templateSurat.create({
      data: {
        nama_template,
        isi_template
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
