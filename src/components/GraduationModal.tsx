import { useRef, useEffect, useState } from 'react';
import { Award, GraduationCap, Star, Download, Share2, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { SelectedCourse } from '@/types';
import { getRatingColor } from '@/utils/helpers';

interface Props {
  onClose: () => void;
}

export const GraduationModal = ({ onClose }: Props) => {
  const modalData = useGameStore((s) => s.modalData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caps, setCaps] = useState<{ x: number; y: number; r: number; speed: number }[]>([]);

  const data = modalData;
  const totalScore = data?.totalScore || 0;
  const rank = data?.rank || '普通学生';
  const rankColor = data?.rankColor || 'text-gray-500';
  const courses: SelectedCourse[] = data?.courses || [];

  useEffect(() => {
    const newCaps = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      r: 8 + Math.random() * 12,
      speed: 0.5 + Math.random() * 1.5,
    }));
    setCaps(newCaps);

    const interval = setInterval(() => {
      setCaps((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y > 120 ? -20 : c.y + c.speed,
          x: c.x + Math.sin(c.y * 0.05) * 0.5,
        }))
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    canvas.width = 360 * dpr;
    canvas.height = 640 * dpr;
    canvas.style.width = '360px';
    canvas.style.height = '640px';
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, 0, 640);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#6366F1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 360, 640);

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 360;
      const y = Math.random() * 640;
      const r = 10 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(20, 40, 320, 560);

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 虚拟成绩单', 180, 80);

    ctx.fillStyle = '#6B7280';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillText(`2026届 ${modalData?.courses[0]?.course.college || '选课学院'}`, 180, 100);

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('姓名：' + (useGameStore.getState().currentGame?.playerName || '同学'), 180, 135);

    const rankText = `毕业评价：${rank}`;
    const rankColorHex = rank === '学神' ? '#F59E0B' : rank === '学霸' ? '#10B981' : rank === '普通学生' ? '#3B82F6' : '#6B7280';
    ctx.fillStyle = rankColorHex;
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText(rankText, 180, 160);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 48px -apple-system, sans-serif';
    ctx.fillText(String(totalScore), 180, 215);

    ctx.fillStyle = '#6B7280';
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillText('总课程体验分', 180, 235);

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📚 选课记录', 35, 270);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 280);
    ctx.lineTo(325, 280);
    ctx.stroke();

    const displayCourses = courses.slice(0, 8);
    let yPos = 300;
    displayCourses.forEach((sc, i) => {
      const ratingColor = sc.course.rating >= 4 ? '#10B981' : sc.course.rating >= 3 ? '#F59E0B' : '#EF4444';
      ctx.fillStyle = ratingColor;
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillText(sc.course.rating.toFixed(1), 35, yPos + 5);

      ctx.fillStyle = '#1F2937';
      ctx.font = '13px -apple-system, sans-serif';
      const name = sc.course.name.length > 10 ? sc.course.name.slice(0, 10) + '...' : sc.course.name;
      ctx.fillText(name, 75, yPos + 5);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px -apple-system, sans-serif';
      const teacher = sc.course.teacher.length > 6 ? sc.course.teacher.slice(0, 6) + '...' : sc.course.teacher;
      ctx.fillText(teacher, 220, yPos + 5);
      yPos += 25;
    });

    const avoidedTraps = courses.filter((c) => c.course.rating >= 4).length;
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `你成功选修了 ${avoidedTraps} 门好评课程，选课眼光一流！`,
      180,
      530
    );

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillText('— 选课避坑指南 · 虚拟成绩单 —', 180, 560);
    ctx.fillText(new Date().toLocaleDateString('zh-CN'), 180, 575);
  }, [modalData]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `成绩单_${rank}_${totalScore}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    (window as any).__APP_STORE__?.showToast('成绩单已保存！');
  };

  const handleShare = () => {
    if (navigator.share) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], '成绩单.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: '我的选课成绩单',
            text: `我在【选课大富翁】中获得了${totalScore}分，毕业评价：${rank}！快来挑战我吧！`,
            files: [file],
          });
        } catch {
          (window as any).__APP_STORE__?.showToast('分享已取消');
        }
      });
    } else {
      (window as any).__APP_STORE__?.showToast('请长按图片保存分享');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {caps.map((c, i) => (
        <GraduationCap
          key={i}
          size={c.r}
          className="absolute text-white/80 pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: `rotate(${c.y * 2}deg)`,
          }}
        />
      ))}

      <div className="relative bg-white rounded-2xl p-5 w-full max-w-md max-h-[95vh] overflow-y-auto animate-[fadeInUp_0.3s_ease-out]">
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-200">
            <Award size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">🎉 恭喜毕业！</h3>
          <p className={`text-lg font-semibold mt-1 ${rankColor}`}>
            毕业评价：{rank}
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4 text-center border border-amber-100">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy size={18} className="text-amber-500" />
            <span className="font-semibold text-amber-700">总体验分</span>
          </div>
          <div className="text-5xl font-bold text-amber-600">{totalScore}</div>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  totalScore / 150 >= i
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl overflow-hidden mb-4">
          <canvas ref={canvasRef} className="w-full rounded-xl" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-full font-medium active:bg-blue-600 transition-colors"
          >
            <Download size={18} />
            <span>保存</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-full font-medium active:bg-emerald-600 transition-colors"
          >
            <Share2 size={18} />
            <span>分享</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 border border-gray-200 text-gray-600 rounded-full font-medium active:bg-gray-50 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};
