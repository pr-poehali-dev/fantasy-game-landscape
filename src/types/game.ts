export type CategoryTopic = "characters" | "locations" | "special" | "royal" | "disaster" | "duel" | "obstacle";
export type GameView = "home" | "game" | "result" | "settings";
export type TeamId = "fire" | "ice" | "forest" | "storm";

export interface Quest {
  id: number;
  topic: CategoryTopic;
  title: string;
  description: string;
  points: number;
  timeLimit: number;
  emoji: string;
}

export interface Zone {
  id: string;
  name: string;
  emoji: string;
  color: string;
  quests: Quest[];
}

export interface Team {
  id: TeamId;
  name: string;
  emoji: string;
  score: number;
  color: string;
  borderStyle: React.CSSProperties;
  glowStyle: React.CSSProperties;
}
