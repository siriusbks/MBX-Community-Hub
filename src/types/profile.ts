export interface PlayerData {
  id: string;
  username: string;
  level: number;
  playtime: number;
  first_connection: string;
  last_connection: string;
  online: boolean;
  guild?: {
    id: string;
    name: string;
  } | null;
  data?: {
    ATTRIBUTED_STATS?: {
      base: Record<string, number>;
      scrolls: Record<string, number>;
    };
    SKILLS?: {
      data: Record<string, number>;
    };
    COMPANIONS?: {
      active_mount: string;
      active_pet: string;
      mounts: Record<string, { id: string; enchanted: boolean }>;
      pets: Record<string, { id: string; energy: number; experience: number; trait: string; generation: number }>;
    };
    OBJECTIVES?: {
      completed_quests: { DAILY?: number; WEEKLY?: number };
      museum: string[];
      successes: Record<string, { levels: number[]; value: number }>;
    };
    SHIPS?: {
      active: string;
      ships: { id: string; experience: number }[];
    };
  }
}
