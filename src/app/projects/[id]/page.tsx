"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { GameConfig, Project } from "@/types";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft, Zap, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Busca o projeto específico
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data.data);
        setConfig(response.data.data.gameConfig);
      } catch (error) {
        toast.error("Projeto não encontrado.");
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, router]);

  // 2. Função para salvar as alterações
  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);

    try {
      await api.put(`/projects/${id}`, { gameConfig: config });
      toast.success("Configurações forjadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar as configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !project || !config) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-neutral-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p>Abrindo o editor...</p>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER DO EDITOR */}
      <header className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-2 bg-neutral-900 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-neutral-500 text-sm mt-1 flex items-center gap-2">
              Editor Visual (JSON)
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Salvar Alterações
        </button>
      </header>

      {/* ÁREA DE EDIÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD PLAYER */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-blue-400 pb-2 border-b border-neutral-800">
            <Zap className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">Jogador</h2>
          </div>

          <div className="space-y-4">
            {/* Slider de Velocidade */}
            <div>
              <label className="flex justify-between text-sm font-medium text-neutral-400 mb-2">
                <span>Velocidade de Movimento</span>
                <span className="text-white bg-neutral-950 px-2 rounded">
                  {config.player.speed}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={config.player.speed}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    player: { ...config.player, speed: Number(e.target.value) },
                  })
                }
                className="w-full accent-blue-500"
              />
            </div>

            {/* Toggle AutoAttack */}
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-lg">
              <span className="text-sm font-medium text-neutral-400">
                Atirar Automaticamente?
              </span>
              <input
                type="checkbox"
                checked={config.player.autoAttack}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    player: { ...config.player, autoAttack: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* CARD ENEMY */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-red-400 pb-2 border-b border-neutral-800">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">Inimigos</h2>
          </div>

          <div className="space-y-4">
            {/* Slider de SpawnRate */}
            <div>
              <label className="flex justify-between text-sm font-medium text-neutral-400 mb-2">
                <span>Taxa de Spawn (inimigos/segundo)</span>
                <span className="text-white bg-neutral-950 px-2 rounded">
                  {config.enemies.spawnRate}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={config.enemies.spawnRate}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    enemies: {
                      ...config.enemies,
                      spawnRate: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-red-500"
              />
            </div>

            {/* Select Tipo de Spawn */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Comportamento (Tipo)
              </label>
              <select
                value={config.enemies.type}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    enemies: { ...config.enemies, type: e.target.value as any },
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="wave">Ondas (Waves)</option>
                <option value="continuous">Contínuo (Horda)</option>
                <option value="boss">Foco em Boss</option>
              </select>
            </div>
          </div>
        </section>

        {/* CARD PROGRESSÃO (Ocupa as duas colunas na tela grande) */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-6 md:col-span-2">
          <div className="flex items-center gap-2 text-green-400 pb-2 border-b border-neutral-800">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">
              Progressão do Jogo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-lg">
              <span className="text-sm font-medium text-neutral-400">
                Permitir Subir de Nível (Level Up)?
              </span>
              <input
                type="checkbox"
                checked={config.progression.levelUp}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    progression: {
                      ...config.progression,
                      levelUp: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 accent-green-500 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-neutral-400">
                Skills Iniciais Configuradas:
              </span>
              <div className="flex flex-wrap gap-2">
                {config.progression.skills.length === 0 && (
                  <span className="text-neutral-500 text-sm">
                    Nenhuma skill
                  </span>
                )}
                {config.progression.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-950 border border-neutral-800 text-green-400 text-sm px-3 py-1 rounded-md uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                * As skills iniciais foram definidas pela IA e são fixas nesta
                versão.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
