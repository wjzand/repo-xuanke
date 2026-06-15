import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, LogOut, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useStore';
import { CourseModal } from '@/components/CourseModal';
import { RushModal } from '@/components/RushModal';
import { EventModal } from '@/components/EventModal';
import { TradeModal } from '@/components/TradeModal';
import { SemesterModal } from '@/components/SemesterModal';
import { GraduationModal } from '@/components/GraduationModal';
import { GameCourseCard } from '@/components/GameCourseCard';
import { getCellTypeLabel, getCourseCredits } from '@/data/gameData';
import { SelectedCourse } from '@/types';

export const GameBoard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const currentGame = useGameStore((s) => s.currentGame);
  const cells = useGameStore((s) => s.cells);
  const currentModal = useGameStore((s) => s.currentModal);
  const rollDice = useGameStore((s) => s.rollDice);
  const setBoardSize = useGameStore((s) => s.setBoardSize);
  const exitGame = useGameStore((s) => s.exitGame);
  const closeModal = useGameStore((s) => s.closeModal);
  const initGameStore = useGameStore((s) => s.init);
  const continueGame = useGameStore((s) => s.continueGame);

  const courses = useAppStore((s) => s.courses);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    (window as any).__COURSES__ = { courses };
    (window as any).__APP_STORE__ = { showToast: useAppStore.getState().showToast };

    initGameStore();
    if (!currentGame) {
      const saved = localStorage.getItem('game_state');
      if (saved) {
        continueGame();
      } else {
        navigate('/game');
        return;
      }
    }

    const updateSize = () => {
      if (boardRef.current) {
        const w = Math.min(boardRef.current.clientWidth - 32, 360);
        setBoardSize(w, w);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || cells.length === 0 || !currentGame) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const w = cells.length > 0 ? Math.max(...cells.map((c) => c.x)) + 40 : 360;
    const h = cells.length > 0 ? Math.max(...cells.map((c) => c.y)) + 40 : 360;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    cells.forEach((cell) => {
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = cell.color + '20';
      ctx.fill();
      ctx.strokeStyle = cell.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (cell.id === 0) {
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('起', cell.x, cell.y + 5);
      } else {
        ctx.fillStyle = cell.color;
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        const label = getCellTypeLabel(cell.type);
        ctx.fillText(label, cell.x, cell.y + 4);
      }
    });

    if (cells.length > 1) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i < cells.length - 1; i++) {
        const c1 = cells[i];
        const c2 = cells[i + 1];
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const currentCell = cells[currentGame.currentPosition];
    if (currentCell) {
      const gradient = ctx.createRadialGradient(
        currentCell.x,
        currentCell.y,
        0,
        currentCell.x,
        currentCell.y,
        28
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentCell.x, currentCell.y, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(currentCell.x, currentCell.y - 5, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentGame.playerAvatar, currentCell.x, currentCell.y - 1);
    }
  }, [cells, currentGame?.currentPosition, currentGame?.playerAvatar]);

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">没有进行中的游戏</p>
          <button
            onClick={() => navigate('/game')}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-full"
          >
            去开始游戏
          </button>
        </div>
      </div>
    );
  }

  const {
    playerName,
    playerAvatar,
    currentSemester,
    totalSemesters,
    movesLeft,
    currentCredits,
    creditsPerSemester,
    selectedCourses,
    totalScore,
    diceValue,
    isRolling,
    isMoving,
  } = currentGame;

  const canRoll = !isRolling && !isMoving && movesLeft > 0 && currentModal === null;

  const handleExit = () => {
    if (window.confirm('确定要退出游戏吗？进度会自动保存。')) {
      exitGame();
      navigate('/game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 pb-24">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleExit}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <LogOut size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{playerAvatar}</span>
            <span className="font-semibold text-gray-900">{playerName}</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex justify-around px-4 py-2 border-t border-gray-50">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {currentSemester}/{totalSemesters}
            </div>
            <div className="text-xs text-gray-500">学期</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">
              {currentCredits}/{creditsPerSemester}
            </div>
            <div className="text-xs text-gray-500">学分</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">{totalScore}</div>
            <div className="text-xs text-gray-500">总分</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{movesLeft}</div>
            <div className="text-xs text-gray-500">剩余步数</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div
          ref={boardRef}
          className="bg-white rounded-2xl p-4 shadow-lg flex justify-center"
        >
          <canvas ref={canvasRef} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200"
            style={{
              transform: `rotate(${isRolling ? Math.random() * 720 : 0}deg)`,
              transition: isRolling ? 'transform 0.1s linear' : 'transform 0.3s ease-out',
            }}
          >
            <span className="text-4xl font-bold text-white">{diceValue}</span>
          </div>

          <button
            onClick={rollDice}
            disabled={!canRoll}
            className="flex-1 ml-4 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Dices size={24} />
            <span>{isRolling ? '投掷中...' : isMoving ? '移动中...' : movesLeft > 0 ? '掷骰子' : '步数用尽'}</span>
          </button>
        </div>

        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="mt-4 w-full py-3 bg-white/20 backdrop-blur rounded-xl text-white font-medium flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>本学期课表 ({selectedCourses.length}门)</span>
          </div>
          {showSchedule ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {showSchedule && (
          <div className="mt-2 bg-white/10 backdrop-blur rounded-xl p-3 animate-[fadeIn_0.2s_ease-out]">
            {selectedCourses.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {selectedCourses.map((sc: SelectedCourse) => (
                  <GameCourseCard key={sc.course.id} course={sc.course} size="small" />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-white/70 text-sm">还没有选课，快去掷骰子吧！</div>
            )}
          </div>
        )}

        <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-3">
          <h4 className="text-white text-sm font-medium mb-2">格子说明</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>选课</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>抢课</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>陷阱</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>事件</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span>交易</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>机会</span>
            </div>
          </div>
        </div>
      </div>

      {currentModal === 'course' && <CourseModal />}
      {currentModal === 'rush' && <RushModal />}
      {currentModal === 'event' && <EventModal />}
      {currentModal === 'trade' && <TradeModal />}
      {currentModal === 'semester' && <SemesterModal />}
      {currentModal === 'graduation' && <GraduationModal onClose={() => { closeModal(); exitGame(); navigate('/game'); }} />}
    </div>
  );
};
