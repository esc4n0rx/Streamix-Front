// src/types/content.ts
export interface Content {
  id: string;
  originalId?: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  description: string;
  videoUrl: string;
  duration?: number;
  genres?: string[];
}
