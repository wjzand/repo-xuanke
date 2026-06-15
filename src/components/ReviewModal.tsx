import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StarRating } from './StarRating';
import { TagBadge } from './TagBadge';
import { PRESET_TAGS, getTagType } from '@/utils/helpers';
import { useAppStore } from '@/store/useStore';

interface ReviewModalProps {
  open: boolean;
  courseId: string;
  onClose: () => void;
}

export const ReviewModal = ({ open, courseId, onClose }: ReviewModalProps) => {
  const addReview = useAppStore((s) => s.addReview);
  const showToast = useAppStore((s) => s.showToast);

  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [giveScore, setGiveScore] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      setRating(0);
      setDifficulty(0);
      setGiveScore(0);
      setTags([]);
      setContent('');
    }
  }, [open]);

  if (!open) return null;

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      showToast('请选择综合评分');
      return;
    }
    if (difficulty === 0) {
      showToast('请选择难度评分');
      return;
    }
    if (giveScore === 0) {
      showToast('请选择给分评分');
      return;
    }
    if (content.trim().length < 10) {
      showToast('评价内容至少10个字');
      return;
    }

    addReview(courseId, {
      rating,
      difficulty,
      giveScore,
      tags,
      content: content.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden animate-[slideUp_0.25s_ease-out]">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">发表评价</h3>
          <button
            onClick={onClose}
            className="p-1.5 -m-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">综合推荐度</label>
              <StarRating value={rating} onChange={setRating} size={28} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">课程难度</label>
              <StarRating value={difficulty} onChange={setDifficulty} size={28} />
              <p className="text-xs text-gray-400 mt-1">1星=非常简单，5星=非常困难</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">给分慷慨度</label>
              <StarRating value={giveScore} onChange={setGiveScore} size={28} />
              <p className="text-xs text-gray-400 mt-1">1星=给分苛刻，5星=给分大方</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">标签（可多选）</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`transition-all active:scale-95 ${
                      tags.includes(tag) ? 'opacity-100 ring-2 ring-blue-400 ring-offset-1' : 'opacity-80'
                    }`}
                  >
                    <TagBadge text={tag} type={getTagType(tag) as any} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                文字评价 <span className="text-gray-400 font-normal">（至少10字）</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="说说这门课的真实体验，帮助其他同学避坑或种草..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-sm text-gray-700 placeholder-gray-400 transition-all"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{content.length}字</div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full font-medium text-base transition-colors active:scale-[0.98]"
          >
            提交评价
          </button>
        </div>
      </div>
    </div>
  );
};
