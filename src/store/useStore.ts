import { create } from 'zustand';
import { Course, Review, UserData, FilterType } from '@/types';
import { loadCourses, saveCourses, loadUserData, saveUserData, clearAllData as clearStorage } from '@/utils/storage';
import { recalcCourseStats, generateId } from '@/utils/helpers';

interface AppState {
  courses: Course[];
  userData: UserData;
  toast: { message: string; visible: boolean } | null;
  activeFilter: FilterType;
  searchKeyword: string;

  initData: () => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearchKeyword: (keyword: string) => void;

  toggleFavorite: (courseId: string) => void;

  toggleCompare: (courseId: string) => void;
  removeFromCompare: (courseId: string) => void;

  toggleLike: (courseId: string, reviewId: string) => void;

  addReview: (courseId: string, review: Omit<Review, 'id' | 'courseId' | 'author' | 'date' | 'likes' | 'liked'>) => void;
  getMyReviews: () => { course: Course; review: Review }[];

  showToast: (message: string) => void;
  hideToast: () => void;

  clearAllData: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set, get) => ({
  courses: [],
  userData: { favorites: [], compareList: [], myReviewIds: [] },
  toast: null,
  activeFilter: 'all',
  searchKeyword: '',

  initData: () => {
    const courses = loadCourses();
    const userData = loadUserData();
    set({ courses, userData });
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  toggleFavorite: (courseId) => {
    const { userData } = get();
    let newFavorites: string[];
    let msg: string;
    if (userData.favorites.includes(courseId)) {
      newFavorites = userData.favorites.filter((id) => id !== courseId);
      msg = '已取消收藏';
    } else {
      newFavorites = [...userData.favorites, courseId];
      msg = '收藏成功';
    }
    const newUserData = { ...userData, favorites: newFavorites };
    saveUserData(newUserData);
    set({ userData: newUserData });
    get().showToast(msg);
  },

  toggleCompare: (courseId) => {
    const { userData } = get();
    if (userData.compareList.includes(courseId)) {
      const newUserData = { ...userData, compareList: userData.compareList.filter((id) => id !== courseId) };
      saveUserData(newUserData);
      set({ userData: newUserData });
      get().showToast('已移出对比');
    } else {
      if (userData.compareList.length >= 3) {
        get().showToast('最多对比3门课程');
        return;
      }
      const newUserData = { ...userData, compareList: [...userData.compareList, courseId] };
      saveUserData(newUserData);
      set({ userData: newUserData });
      get().showToast('已加入对比');
    }
  },

  removeFromCompare: (courseId) => {
    const { userData } = get();
    const newUserData = { ...userData, compareList: userData.compareList.filter((id) => id !== courseId) };
    saveUserData(newUserData);
    set({ userData: newUserData });
  },

  toggleLike: (courseId, reviewId) => {
    const { courses } = get();
    const newCourses = courses.map((c) => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        reviews: c.reviews.map((r) => {
          if (r.id !== reviewId) return r;
          return {
            ...r,
            liked: !r.liked,
            likes: r.liked ? r.likes - 1 : r.likes + 1,
          };
        }),
      };
    });
    saveCourses(newCourses);
    set({ courses: newCourses });
  },

  addReview: (courseId, review) => {
    const { courses, userData } = get();
    const newReview: Review = {
      ...review,
      id: generateId(),
      courseId,
      author: '匿名用户',
      likes: 0,
      liked: false,
      date: new Date().toISOString().slice(0, 10),
    };

    const newCourses = courses.map((c) => {
      if (c.id !== courseId) return c;
      const updatedCourse = { ...c, reviews: [newReview, ...c.reviews] };
      return recalcCourseStats(updatedCourse);
    });

    const newUserData = { ...userData, myReviewIds: [...userData.myReviewIds, newReview.id] };

    saveCourses(newCourses);
    saveUserData(newUserData);
    set({ courses: newCourses, userData: newUserData });
    get().showToast('评价发布成功');
  },

  getMyReviews: () => {
    const { courses, userData } = get();
    const results: { course: Course; review: Review }[] = [];
    courses.forEach((c) => {
      c.reviews.forEach((r) => {
        if (userData.myReviewIds.includes(r.id)) {
          results.push({ course: c, review: r });
        }
      });
    });
    return results.sort((a, b) => (a.review.date < b.review.date ? 1 : -1));
  },

  showToast: (message) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast: { message, visible: true } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, 2000);
  },

  hideToast: () => set({ toast: null }),

  clearAllData: () => {
    clearStorage();
    const courses = loadCourses();
    const userData = loadUserData();
    set({ courses, userData });
    get().showToast('数据已重置');
  },
}));
