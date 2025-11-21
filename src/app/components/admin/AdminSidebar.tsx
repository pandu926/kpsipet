"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, FileText, Users, GraduationCap, UserCheck, FileType, ChevronDown, ChevronRight } from "lucide-react";

type MenuItem = {
  name: string
  href?: string
  Icon?: any
  children?: MenuItem[]
};

const defaultMenu: MenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", Icon: Home },
  { name: "Pengaduan", href: "/admin/pengaduan", Icon: FileText },
  {
    name: "Data Master",
    Icon: Users,
    children: [
      { name: "Pengguna", href: "/admin/users", Icon: Users },
      { name: "Guru", href: "/admin/guru", Icon: GraduationCap },
      { name: "Siswa", href: "/admin/siswa", Icon: UserCheck },
      { name: "Template Surat", href: "/admin/template", Icon: FileType },
    ]
  },
];

export default function AdminSidebar({ menu = defaultMenu }: { menu?: MenuItem[] }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["Data Master"]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.Icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.name);
    const active = pathname === item.href;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon size={18} />}
              {item.name}
            </div>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isOpen && (
            <div className="ml-4">
              {item.children?.map(child => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors"
        style={{
          background: active ? "var(--color-sidebar-primary)" : "transparent",
          color: active ? "var(--color-sidebar-primary-foreground)" : "var(--color-sidebar-foreground)",
        }}
      >
        {Icon && <Icon size={18} />}
        {item.name}
      </Link>
    );
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between shadow-lg overflow-y-auto"
      style={{ background: "var(--color-sidebar)", color: "var(--color-sidebar-foreground)" }}
    >
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "var(--color-sidebar-border)" }}>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Sistem Pengaduan</h1>
          </div>
        </div>

        <nav className="mt-4">
          {menu.map(item => renderMenuItem(item))}
        </nav>
      </div>

      <div className="px-6 py-4 text-xs" style={{ borderTop: `1px solid var(--color-sidebar-border)`, color: "var(--color-sidebar-foreground)" }}>
        Logged in as <br />
        <span className="font-semibold">Admin Sekolah</span>
      </div>
    </aside>
  );
}
