import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Trash2, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { CourseCard } from '@/components/CourseCard';
import { TagBadge } from '@/components/TagBadge';
import { StarRating } from '@/components/StarRating';
import { formatDate, getTagType } from '@/utils/helpers';

export const Mine = () => {
  const navigate = useNavigate();
  const courses = useAppStore((s) => s.courses);
  const userData = useAppStore((s) => s.userData);
  const getMyReviews = useAppStore((s) => s.getMyReviews);
  const clearAllData = useAppStore((s) => s.clearAllData);
  const showToast = useAppStore((s) => s.showToast);

  const [showConfirm, setShowConfirm] = useState(false);

  const favoriteCourses = userData.favorites
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean) as any[];

  const myReviews = getMyReviews();

  const handleClearData = () => {
    clearAllData();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-5 pt-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <UserIcon size={32} className="text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">同学你好 👋</h1>
            <p className="text-sm text-white/80 mt-0.5">选课避坑，理性选课</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/15 backdrop-blur rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-bold text-white">{favoriteCourses.length}</div>
            <div className="text-xs text-white/80 mt-0.5">我的收藏</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-bold text-white">{myReviews.length}</div>
            <div className="text-xs text-white/80 mt-0.5">我的评价</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-bold text-white">{userData.compareList.length}</div>
            <div className="text-xs text-white/80 mt-0.5">对比中</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <h2 className="font-semibold text-gray-900">我的收藏</h2>
            </div>
            <span className="text-xs text-gray-400">{favoriteCourses.length}门</span>
          </div>

          {favoriteCourses.length > 0 ? (
            <div className="space-y-3">
              {favoriteCourses.map((course) => (
                <div key={course.id} onClick={() => navigate(`/course/${course.id}`)}>
                  <CourseCard course={course} showActions={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2">💝</div>
              <p className="text-gray-400 text-sm">还没有收藏的课程</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-500" />
              <h2 className="font-semibold text-gray-900">我的评价</h2>
            </div>
            <span className="text-xs text-gray-400">{myReviews.length}条</span>
          </div>

          {myReviews.length > 0 ? (
            <div className="space-y-3">
              {myReviews.map(({ course, review }) => (
                <div
                  key={review.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-gray-50 rounded-xl p-3.5 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 text-sm">{course.name}</div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <StarRating value={review.rating} size={12} readOnly />
                    <span className="text-xs text-gray-400 ml-1">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {review.content}
                  </p>
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} text={tag} type={getTagType(tag) as any} small />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2">✍️</div>
              <p className="text-gray-400 text-sm">还没有发表评价</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="w-full mt-4 bg-white rounded-2xl py-4 flex items-center justify-center gap-2 text-red-500 font-medium shadow-sm active:bg-red-50 transition-colors"
        >
          <Trash2 size={18} />
          <span>清除所有本地数据</span>
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.15s_ease-out]">
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">确认清除数据？</h3>
              <p className="text-sm text-gray-500 mt-2">
                此操作将清除所有收藏、评价记录和对比列表，且无法恢复。
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 text-gray-600 font-medium border-r border-gray-100 active:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-3.5 text-red-500 font-medium active:bg-red-50 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
