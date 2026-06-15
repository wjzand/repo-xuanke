import { Course, FilterType } from '@/types';

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.0) return 'text-emerald-500';
  if (rating >= 3.0) return 'text-amber-500';
  return 'text-red-500';
};

export const getRatingBgColor = (rating: number): string => {
  if (rating >= 4.0) return 'bg-emerald-500';
  if (rating >= 3.0) return 'bg-amber-500';
  return 'bg-red-500';
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

export const filterCourses = (courses: Course[], filter: FilterType, keyword: string): Course[] => {
  let result = [...courses];

  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        c.teacher.toLowerCase().includes(kw) ||
        c.college.toLowerCase().includes(kw)
    );
  }

  switch (filter) {
    case 'top':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'easy':
      result = result
        .filter((c) => c.difficulty <= 2.5)
        .sort((a, b) => a.difficulty - b.difficulty);
      break;
    case 'generous':
      result = result
        .filter((c) => c.giveScore >= 4.0)
        .sort((a, b) => b.giveScore - a.giveScore);
      break;
    case 'warning':
      result = result.filter((c) => c.rating < 3.0 || c.difficulty >= 4.0);
      break;
    default:
      break;
  }

  return result;
};

export const recalcCourseStats = (course: Course): Course => {
  if (course.reviews.length === 0) {
    return { ...course, rating: 0, difficulty: 0, giveScore: 0, reviewCount: 0, tags: [], tagTypes: [] };
  }

  const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
  const totalDifficulty = course.reviews.reduce((sum, r) => sum + r.difficulty, 0);
  const totalGiveScore = course.reviews.reduce((sum, r) => sum + r.giveScore, 0);
  const len = course.reviews.length;

  const tagCount: Record<string, { count: number; type: string }> = {};
  course.reviews.forEach((r) => {
    r.tags.forEach((t) => {
      if (!tagCount[t]) {
        tagCount[t] = { count: 0, type: getTagType(t) };
      }
      tagCount[t].count++;
    });
  });

  const sortedTags = Object.entries(tagCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return {
    ...course,
    rating: Number((totalRating / len).toFixed(1)),
    difficulty: Number((totalDifficulty / len).toFixed(1)),
    giveScore: Number((totalGiveScore / len).toFixed(1)),
    reviewCount: len,
    tags: sortedTags.map((t) => t[0]),
    tagTypes: sortedTags.map((t) => t[1].type as any),
  };
};

export const getTagType = (tag: string): string => {
  const positiveTags = ['给分大方', '轻松过', '干货满满', '不考勤'];
  const negativeTags = ['挂科率高', '作业超多', '点名严格', '课程水'];
  if (positiveTags.includes(tag)) return 'success';
  if (negativeTags.includes(tag)) return 'danger';
  return 'gray';
};

export const getTagColorClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'danger':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'warning':
      return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'primary':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

export const PRESET_TAGS = [
  '给分大方',
  '轻松过',
  '干货满满',
  '不考勤',
  '挂科率高',
  '作业超多',
  '点名严格',
  '需要基础',
  '课程水',
  '偏理论',
];
