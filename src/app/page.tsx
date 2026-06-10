"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { Project } from "@/types";
import toast from "react-hot-toast";
import { Wand2, Loader2, Gamepad2, Zap, Shield, Users } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<Project | null>(
    null,
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt) {
      toast.error("Preencha o nome e a descrição do jogo!");
      return;
    }

    setIsLoading(true);
    try {
      // Chama nosso backend Node.js
      const response = await api.post("/projects", { name, prompt });
      setGeneratedProject(response.data.data);
      toast.success("Jogo gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar o jogo. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* HEADER */}
        <header className="text-center space-y-4 mt-10">
          <div className="flex items-center justify-center gap-3">
            <Gamepad2 className="w-12 h-12 text-purple-500" />
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              GameForge AI
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Descreva seu jogo e deixe a IA criar a estrutura para você.
          </p>
        </header>

        {/* ÁREA DE INPUT (FORMULÁRIO) */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Nome do Projeto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Space Survivor..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Descrição (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o jogo... Ex: Um jogo de sobrevivência no espaço onde os inimigos vêm em ondas muito rápidas, o jogador atira sozinho..."
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Forjando seu jogo...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Gerar Jogo com IA
                </>
              )}
            </button>
          </form>
        </section>

        {/* ÁREA DE RESULTADO (CARDS) */}
        {generatedProject && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold border-b border-neutral-800 pb-2">
              Estrutura Gerada:{" "}
              <span className="text-purple-400">{generatedProject.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Jogador */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="w-5 h-5" />
                  <h3 className="text-lg font-medium text-neutral-200">
                    Jogador
                  </h3>
                </div>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    Velocidade:{" "}
                    <strong className="text-white">
                      {generatedProject.gameConfig.player.speed}
                    </strong>
                  </li>
                  <li>
                    Auto-Ataque:{" "}
                    <strong className="text-white">
                      {generatedProject.gameConfig.player.autoAttack
                        ? "Sim"
                        : "Não"}
                    </strong>
                  </li>
                </ul>
              </div>

              {/* Card Inimigos */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-medium text-neutral-200">
                    Inimigos
                  </h3>
                </div>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    Tipo de Spawn:{" "}
                    <strong className="text-white uppercase">
                      {generatedProject.gameConfig.enemies.type}
                    </strong>
                  </li>
                  <li>
                    Taxa (Spawn Rate):{" "}
                    <strong className="text-white">
                      {generatedProject.gameConfig.enemies.spawnRate}
                    </strong>
                  </li>
                </ul>
              </div>

              {/* Card Progressão */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-lg font-medium text-neutral-200">
                    Progressão
                  </h3>
                </div>
                <ul className="space-y-2 text-neutral-400">
                  <li>
                    Sobe de Nível:{" "}
                    <strong className="text-white">
                      {generatedProject.gameConfig.progression.levelUp
                        ? "Sim"
                        : "Não"}
                    </strong>
                  </li>
                  <li>
                    Skills Iniciais:
                    <div className="flex flex-wrap gap-2 mt-2">
                      {generatedProject.gameConfig.progression.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="bg-neutral-800 text-green-400 text-xs px-2 py-1 rounded-md uppercase"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
