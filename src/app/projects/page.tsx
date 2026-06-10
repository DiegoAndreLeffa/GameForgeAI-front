"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Project } from "@/types";
import toast from "react-hot-toast";
import {
  Loader2,
  Trash2,
  Calendar,
  Zap,
  Users,
  AlertTriangle,
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar os projetos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Abre o modal e salva qual ID queremos deletar
  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Função que realmente faz a exclusão após confirmar no modal
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete));
      toast.success("Projeto deletado com sucesso!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Erro ao deletar projeto.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-neutral-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p>Carregando seus projetos...</p>
      </div>
    );
  }

  return (
    <>
      <main className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Projetos</h1>
            <p className="text-neutral-400 mt-1">
              Gerencie os jogos que você forjou com a IA.
            </p>
          </div>
          <div className="text-neutral-500 text-sm">
            Total: {projects.length} projeto(s)
          </div>
        </header>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
            <p className="text-neutral-400">Nenhum projeto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-purple-500/50 transition-all flex flex-col justify-between h-full group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3
                      className="text-xl font-bold text-white truncate pr-4"
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteClick(project._id)}
                      className="text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Deletar Projeto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-neutral-400 line-clamp-3 italic">
                    "{project.originalPrompt}"
                  </p>

                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-neutral-300 bg-neutral-950 px-2 py-1 rounded">
                      <Zap className="w-3 h-3 text-blue-400" />
                      Spd: {project.gameConfig.player.speed}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-300 bg-neutral-950 px-2 py-1 rounded">
                      <Users className="w-3 h-3 text-red-400" />
                      Spwn: {project.gameConfig.enemies.spawnRate}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  Criado em:{" "}
                  {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-500 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Excluir Projeto?</h2>
            </div>

            <p className="text-neutral-400 mb-8">
              Tem certeza que deseja forjar o fim deste projeto? Esta ação é
              irreversível e todos os dados gerados pela IA serão perdidos.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Excluindo...
                  </>
                ) : (
                  "Sim, excluir projeto"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
