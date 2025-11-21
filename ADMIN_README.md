# Admin Dashboard - Sistem Pengaduan Siswa

Dashboard admin yang lengkap untuk mengelola sistem pengaduan siswa dengan UI yang responsif dan elegan.

## Fitur Admin Dashboard

### 1. **Dashboard Utama** (`/admin/dashboard`)
- Statistik real-time:
  - Total Pengguna
  - Total Guru
  - Total Siswa
  - Total Pengaduan
- Status Pengaduan (Menunggu, Disetujui, Ditolak, Selesai)
- Quick Actions untuk akses cepat ke semua halaman

### 2. **Kelola Pengguna** (`/admin/users`)
- Create, Read, Update, Delete (CRUD) pengguna
- Dua role: Admin & Petugas
- Password hashing dengan bcryptjs
- Search dan filter
- Tampilan jumlah tindak lanjut per user

### 3. **Kelola Guru** (`/admin/guru`)
- CRUD data guru
- Field: NIP, Nama Guru, No. Telepon
- Search by nama atau NIP
- Tampilan jumlah pengaduan per guru
- Validasi: tidak bisa hapus guru yang memiliki pengaduan

### 4. **Kelola Siswa** (`/admin/siswa`)
- CRUD data siswa
- Field: NISN, Nama Siswa, Kelas, Kontak Orang Tua
- Search dan filter by kelas
- Tampilan jumlah pengaduan per siswa
- Validasi: tidak bisa hapus siswa yang memiliki pengaduan

### 5. **Kelola Pengaduan** (`/admin/pengaduan`)
- CRUD pengaduan siswa
- View detail lengkap pengaduan
- Status: Menunggu, Disetujui, Ditolak, Selesai
- Field alasan penolakan (conditional)
- Relasi dengan Guru dan Siswa
- Search dan filter by status
- Color-coded status badges

### 6. **Kelola Template Surat** (`/admin/template`)
- CRUD template surat
- Field: Nama Template, Isi Template
- Preview template
- Grid view dengan card design
- Tampilan jumlah penggunaan template
- Placeholder support ([NAMA_SISWA], [KELAS], dll)
- Validasi: tidak bisa hapus template yang sedang digunakan

## Komponen UI Reusable

### 1. **Modal** (`/components/ui/Modal.tsx`)
- Responsive modal dialog
- Ukuran: sm, md, lg, xl
- Close dengan ESC key
- Backdrop blur effect
- Smooth animations

### 2. **Toast Notifications** (`/components/ui/Toast.tsx`)
- 4 tipe: success, error, warning, info
- Auto-dismiss dengan timer
- Stacking support
- Color-coded dengan icons

### 3. **Confirm Dialog** (`/components/ui/ConfirmDialog.tsx`)
- Konfirmasi untuk aksi destruktif
- 3 tipe: danger, warning, info
- Custom message dan button text

### 4. **Loading Spinner** (`/components/ui/LoadingSpinner.tsx`)
- 3 ukuran: sm, md, lg
- Optional text
- Smooth spinning animation

## API Routes

Semua API routes menggunakan Next.js App Router (Route Handlers):

### Users API
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Guru API
- `GET /api/guru` - Get all guru
- `POST /api/guru` - Create guru
- `GET /api/guru/[id]` - Get guru by ID
- `PUT /api/guru/[id]` - Update guru
- `DELETE /api/guru/[id]` - Delete guru

### Siswa API
- `GET /api/siswa?kelas=X IPA 1` - Get all siswa (optional filter)
- `POST /api/siswa` - Create siswa
- `GET /api/siswa/[id]` - Get siswa by ID
- `PUT /api/siswa/[id]` - Update siswa
- `DELETE /api/siswa/[id]` - Delete siswa

### Pengaduan API
- `GET /api/pengaduan?status=Menunggu` - Get all pengaduan (optional filter)
- `POST /api/pengaduan` - Create pengaduan
- `GET /api/pengaduan/[id]` - Get pengaduan by ID with relations
- `PUT /api/pengaduan/[id]` - Update pengaduan
- `DELETE /api/pengaduan/[id]` - Delete pengaduan

### Template API
- `GET /api/template` - Get all templates
- `POST /api/template` - Create template
- `GET /api/template/[id]` - Get template by ID
- `PUT /api/template/[id]` - Update template
- `DELETE /api/template/[id]` - Delete template

### Stats API
- `GET /api/stats` - Get dashboard statistics

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (admin user, sample data)
npm run db:seed
```

### 3. Environment Variables
Create `.env` file (copy from `.env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kpsipet?schema=public"
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access Admin Dashboard
Open [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

## Default Credentials (After Seeding)

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Petugas Account:**
- Username: `petugas`
- Password: `petugas123`

⚠️ **IMPORTANT:** Change these passwords in production!

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Password Hashing:** bcryptjs
- **Animations:** Tailwind Animate CSS

## Folder Structure

```
/src/app/
  /admin/
    /dashboard/        # Dashboard utama
    /users/           # Kelola pengguna
    /guru/            # Kelola guru
    /siswa/           # Kelola siswa
    /pengaduan/       # Kelola pengaduan
    /template/        # Kelola template surat
  /api/               # API routes
    /users/
    /guru/
    /siswa/
    /pengaduan/
    /template/
    /stats/
  /components/
    /admin/           # Admin layout components
    /ui/              # Reusable UI components
```

## Features Highlights

### Responsiveness
- Mobile-first design
- Sidebar collapse pada mobile
- Responsive tables dengan horizontal scroll
- Grid layouts yang adaptive

### User Experience
- Toast notifications untuk feedback
- Confirm dialogs untuk aksi penting
- Loading states
- Search dan filter pada semua tabel
- Color-coded status badges
- Smooth animations
- Keyboard shortcuts (ESC untuk close modal)

### Security
- Password hashing dengan bcryptjs (10 rounds)
- Input validation
- SQL injection prevention (Prisma ORM)
- Unique constraints pada database

### Data Validation
- Required fields validation
- Unique constraints (username, NIP, NISN)
- Relational integrity (tidak bisa hapus data yang masih berelasi)
- Custom error messages

## Next Steps untuk Production

1. **Authentication:**
   - Implement NextAuth.js atau JWT
   - Protected routes dengan middleware
   - Session management

2. **Authorization:**
   - Role-based access control (RBAC)
   - Permission checks

3. **Enhancements:**
   - Export data to Excel/PDF
   - Bulk operations
   - Advanced filtering
   - Pagination untuk dataset besar
   - Image upload untuk surat
   - Email notifications

4. **Security:**
   - Rate limiting
   - CSRF protection
   - Input sanitization
   - Environment-based configs

## Database Schema

Lihat `prisma/schema.prisma` untuk detail lengkap schema database.

**Models:**
- Users (admin, petugas)
- Guru
- Siswa
- Pengaduan
- TemplateSurat
- TindakLanjut

**Relationships:**
- Pengaduan → Guru (many-to-one)
- Pengaduan → Siswa (many-to-one)
- TindakLanjut → Pengaduan (one-to-one)
- TindakLanjut → Users (many-to-one)
- TindakLanjut → TemplateSurat (many-to-one)

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi tim development.

---

**Built with ❤️ using Next.js & Prisma**
