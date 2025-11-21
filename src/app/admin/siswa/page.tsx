'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/app/components/admin/AdminLayout'
import AdminHeader from '@/app/components/admin/AdminHeader'
import Modal from '@/app/components/ui/Modal'
import ConfirmDialog from '@/app/components/ui/ConfirmDialog'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { ToastProvider, useToast } from '@/app/components/ui/ToastContainer'
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react'

interface Siswa {
  id_siswa: number
  nisn: string
  nama_siswa: string
  kelas: string
  kontak_ortu: string
  _count?: {
    pengaduan: number
  }
}

function SiswaPageContent() {
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [kelasFilter, setKelasFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null)
  const [formData, setFormData] = useState({ nisn: '', nama_siswa: '', kelas: '', kontak_ortu: '' })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchSiswa()
  }, [])

  const fetchSiswa = async () => {
    try {
      const response = await fetch('/api/siswa')
      const data = await response.json()
      setSiswa(data)
    } catch (error) {
      showToast('Failed to fetch siswa', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = selectedSiswa ? `/api/siswa/${selectedSiswa.id_siswa}` : '/api/siswa'
      const method = selectedSiswa ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save siswa')
      }

      showToast(
        selectedSiswa ? 'Siswa updated successfully' : 'Siswa created successfully',
        'success'
      )
      setIsModalOpen(false)
      fetchSiswa()
      resetForm()
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSiswa) return

    try {
      const response = await fetch(`/api/siswa/${selectedSiswa.id_siswa}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete siswa')
      }

      showToast('Siswa deleted successfully', 'success')
      fetchSiswa()
      setSelectedSiswa(null)
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const openCreateModal = () => {
    resetForm()
    setSelectedSiswa(null)
    setIsModalOpen(true)
  }

  const openEditModal = (siswa: Siswa) => {
    setSelectedSiswa(siswa)
    setFormData({
      nisn: siswa.nisn,
      nama_siswa: siswa.nama_siswa,
      kelas: siswa.kelas,
      kontak_ortu: siswa.kontak_ortu
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (siswa: Siswa) => {
    setSelectedSiswa(siswa)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ nisn: '', nama_siswa: '', kelas: '', kontak_ortu: '' })
  }

  const filteredSiswa = siswa.filter(s =>
    (s.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nisn.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (kelasFilter === '' || s.kelas === kelasFilter)
  )

  const uniqueKelas = Array.from(new Set(siswa.map(s => s.kelas))).sort()

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading siswa..." />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Siswa"
        subtitle="Manajemen data siswa"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Siswa
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={kelasFilter}
                onChange={(e) => setKelasFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Kelas</option>
                {uniqueKelas.map(kelas => (
                  <option key={kelas} value={kelas}>{kelas}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NISN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak Ortu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengaduan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSiswa.map((s) => (
                <tr key={s.id_siswa} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.id_siswa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {s.nisn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.nama_siswa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {s.kelas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {s.kontak_ortu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s._count?.pengaduan || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(s)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSiswa.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No siswa found
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSiswa ? 'Edit Siswa' : 'Tambah Siswa'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NISN
            </label>
            <input
              type="text"
              required
              value={formData.nisn}
              onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Siswa
            </label>
            <input
              type="text"
              required
              value={formData.nama_siswa}
              onChange={(e) => setFormData({ ...formData, nama_siswa: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kelas
            </label>
            <input
              type="text"
              required
              placeholder="e.g., X IPA 1"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kontak Orang Tua
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 08123456789"
              value={formData.kontak_ortu}
              onChange={(e) => setFormData({ ...formData, kontak_ortu: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : (selectedSiswa ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Siswa"
        message={`Are you sure you want to delete siswa "${selectedSiswa?.nama_siswa}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  )
}

export default function SiswaPage() {
  return (
    <ToastProvider>
      <SiswaPageContent />
    </ToastProvider>
  )
}
