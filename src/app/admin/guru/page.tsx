'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/app/components/admin/AdminLayout'
import AdminHeader from '@/app/components/admin/AdminHeader'
import Modal from '@/app/components/ui/Modal'
import ConfirmDialog from '@/app/components/ui/ConfirmDialog'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { ToastProvider, useToast } from '@/app/components/ui/ToastContainer'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

interface Guru {
  id_guru: number
  nip: string
  nama_guru: string
  no_telp: string | null
  _count?: {
    pengaduan: number
  }
}

function GuruPageContent() {
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [formData, setFormData] = useState({ nip: '', nama_guru: '', no_telp: '' })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchGuru()
  }, [])

  const fetchGuru = async () => {
    try {
      const response = await fetch('/api/guru')
      const data = await response.json()
      setGuru(data)
    } catch (error) {
      showToast('Failed to fetch guru', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = selectedGuru ? `/api/guru/${selectedGuru.id_guru}` : '/api/guru'
      const method = selectedGuru ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save guru')
      }

      showToast(
        selectedGuru ? 'Guru updated successfully' : 'Guru created successfully',
        'success'
      )
      setIsModalOpen(false)
      fetchGuru()
      resetForm()
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedGuru) return

    try {
      const response = await fetch(`/api/guru/${selectedGuru.id_guru}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete guru')
      }

      showToast('Guru deleted successfully', 'success')
      fetchGuru()
      setSelectedGuru(null)
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const openCreateModal = () => {
    resetForm()
    setSelectedGuru(null)
    setIsModalOpen(true)
  }

  const openEditModal = (guru: Guru) => {
    setSelectedGuru(guru)
    setFormData({ nip: guru.nip, nama_guru: guru.nama_guru, no_telp: guru.no_telp || '' })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (guru: Guru) => {
    setSelectedGuru(guru)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ nip: '', nama_guru: '', no_telp: '' })
  }

  const filteredGuru = guru.filter(g =>
    g.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.nip.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading guru..." />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Guru"
        subtitle="Manajemen data guru"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Guru
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
                  NIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Guru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Telepon
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
              {filteredGuru.map((g) => (
                <tr key={g.id_guru} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g.id_guru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {g.nip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g.nama_guru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {g.no_telp || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g._count?.pengaduan || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(g)}
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

          {filteredGuru.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No guru found
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGuru ? 'Edit Guru' : 'Tambah Guru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIP
            </label>
            <input
              type="text"
              required
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Guru
            </label>
            <input
              type="text"
              required
              value={formData.nama_guru}
              onChange={(e) => setFormData({ ...formData, nama_guru: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. Telepon (Optional)
            </label>
            <input
              type="text"
              value={formData.no_telp}
              onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : (selectedGuru ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Guru"
        message={`Are you sure you want to delete guru "${selectedGuru?.nama_guru}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  )
}

export default function GuruPage() {
  return (
    <ToastProvider>
      <GuruPageContent />
    </ToastProvider>
  )
}
