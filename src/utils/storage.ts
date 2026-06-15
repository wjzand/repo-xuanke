import { Course, UserData, PlayerArchive, GameState } from '@/types';
import { initMockData } from '@/data/mockData';

const COURSE_KEY = 'course_data';
const USER_KEY = 'user_data';
const ARCHIVE_KEY = 'game_archives';
const GAME_KEY = 'game_state';

export const loadCourses = (): Course[] => {
  try {
    const data = localStorage.getItem(COURSE_KEY);
    if (!data) {
      const mock = initMockData();
      localStorage.setItem(COURSE_KEY, JSON.stringify(mock));
      return mock;
    }
    return JSON.parse(data);
  } catch {
    const mock = initMockData();
    localStorage.setItem(COURSE_KEY, JSON.stringify(mock));
    return mock;
  }
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSE_KEY, JSON.stringify(courses));
};

export const loadUserData = (): UserData => {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      const defaultData: UserData = { favorites: [], compareList: [], myReviewIds: [] };
      localStorage.setItem(USER_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(data);
  } catch {
    const defaultData: UserData = { favorites: [], compareList: [], myReviewIds: [] };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
};

export const saveUserData = (data: UserData): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

export const loadArchives = (): PlayerArchive[] => {
  try {
    const data = localStorage.getItem(ARCHIVE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveArchives = (archives: PlayerArchive[]): void => {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archives));
};

export const loadGameState = (): GameState | null => {
  try {
    const data = localStorage.getItem(GAME_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveGameState = (state: GameState): void => {
  localStorage.setItem(GAME_KEY, JSON.stringify(state));
};

export const removeGameState = (): void => {
  localStorage.removeItem(GAME_KEY);
};

export const clearAllData = (): void => {
  localStorage.removeItem(COURSE_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ARCHIVE_KEY);
  localStorage.removeItem(GAME_KEY);
};
