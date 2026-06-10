import Link from "next/link";
import { Gamepad2, LayoutDashboard, PlusCircle } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Gamepad2 className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            GameForge AI
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Criar Jogo
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Meus Projetos
          </Link>
        </div>
      </div>
    </nav>
  );
}
