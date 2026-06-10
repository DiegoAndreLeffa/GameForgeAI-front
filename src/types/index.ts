export interface GameConfig {
  player: {
    speed: number;
    autoAttack: boolean;
  };
  enemies: {
    spawnRate: number;
    type: 'wave' | 'continuous' | 'boss';
  };
  progression: {
    levelUp: boolean;
    skills: string[];
  };
}

export interface Project {
  _id: string;
  name: string;
  originalPrompt: string;
  gameConfig: GameConfig;
  createdAt: string;
  updatedAt: string;
}