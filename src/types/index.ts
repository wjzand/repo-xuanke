export type TagType = 'success' | 'danger' | 'gray' | 'warning' | 'primary';

export interface Review {
  id: string;
  courseId: string;
  author: string;
  rating: number;
  difficulty: number;
  giveScore: number;
  content: string;
  tags: string[];
  likes: number;
  liked: boolean;
  date: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  college: string;
  category: '必修' | '选修' | '通识';
  rating: number;
  difficulty: number;
  giveScore: number;
  tags: string[];
  tagTypes: TagType[];
  reviewCount: number;
  reviews: Review[];
}

export interface UserData {
  favorites: string[];
  compareList: string[];
  myReviewIds: string[];
}

export type FilterType = 'all' | 'top' | 'easy' | 'generous' | 'warning';
