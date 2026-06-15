import { Course, UserData } from '@/types';
import { initMockData } from '@/data/mockData';

const COURSE_KEY = 'course_data';
const USER_KEY = 'user_data';

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

export const clearAllData = (): void => {
  localStorage.removeItem(COURSE_KEY);
  localStorage.removeItem(USER_KEY);
};
