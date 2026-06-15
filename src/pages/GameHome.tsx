import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dices, Trophy, BookOpen, Plus, Trash2, Play, User as UserIcon } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { loadGameState } from '@/utils/storage';
import { AVATARS } from '@/data/gameData';

export const GameHome = () => {
  const navigate = useNavigate();
  const archives = useGameStore((s) => s.archives);
  const init = useGameStore((s) => s.init);
  const startGame = useGameStore((s) => s.startGame);
  const createArchive = useGameStore((s) => s.createArchive);
  const deleteArchive = useGameStore((s) => s.deleteArchive);
  const continueGame = useGameStore((s) => s.continueGame);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    init();
    const saved = loadGameState();
    setHasSavedGame(!!saved);
  }, [init]);

  const handleCreate = () => {
    if (!newName.trim()) {
      (window as any).__APP_STORE__?.showToast('请输入你的昵称');
      return;
    }
    const id = createArchive(newName.trim(), selectedAvatar);
    startGame(id);
    navigate('/game/board');
  };

  const handleContinue = () => {
    continueGame();
    navigate('/game/board');
  };

  const handleStartArchive = (id: string) => {
    startGame(id);
    navigate('/game/board');
  };

  const handleDeleteArchive = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个存档吗？')) {
      deleteArchive(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 pb-24">
      <div className="px-4 pt-8 pb-6 text-center text-white">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Dices size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">🎲 选课大富翁</h1>
        <p className="text-white/80 text-sm">掷骰子，选好课，避开坑，成为选课学神！</p>
      </div>

      <div className="px-4 space-y-3">
        {hasSavedGame && (
          <button
            onClick={handleContinue}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-lg"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Play size={28} className="text-white ml-1" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-gray-900">继续游戏</div>
              <div className="text-sm text-gray-500">上次的游戏还没结束哦</div>
            </div>
            <div className="text-blue-500">→</div>
          </button>
        )}

        <button
          onClick={() => setShowCreate(true)}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-lg shadow-orange-200"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus size={28} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-lg">开始新游戏</div>
            <div className="text-sm opacity-90">创建你的角色，开启选课之旅</div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/game/rank')}
            className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
          >
            <Trophy size={32} className="text-amber-500" />
            <span className="font-semibold text-gray-800">排行榜</span>
          </button>
          <button
            onClick={() => navigate('/game/collection')}
            className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
          >
            <BookOpen size={32} className="text-emerald-500" />
            <span className="font-semibold text-gray-800">课程图鉴</span>
          </button>
        </div>

        {archives.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <UserIcon size={18} />
              我的存档
            </h3>
            <div className="space-y-2">
              {archives.map((archive) => (
                <div
                  key={archive.id}
                  onClick={() => !archive.completed && handleStartArchive(archive.id)}
                  className={`bg-white rounded-xl p-3 flex items-center gap-3 ${
                    !archive.completed ? 'active:scale-[0.98] cursor-pointer' : 'opacity-70'
                  } transition-transform shadow-md`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl">
                    {archive.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{archive.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{archive.createdAt}</span>
                      {archive.completed ? (
                        <span className="text-emerald-500 font-medium">已毕业 · {archive.rank}</span>
                      ) : (
                        <span className="text-blue-500 font-medium">进行中</span>
                      )}
                    </div>
                    {archive.completed && (
                      <div className="text-xs text-amber-600 font-medium mt-0.5">
                        总体验分: {archive.totalScore}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDeleteArchive(e, archive.id)}
                    className="p-2 text-gray-400 hover:text-red-500 active:scale-90 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm animate-[fadeInUp_0.25s_ease-out]">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">创建角色</h3>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">选择头像</label>
              <div className="flex gap-2 justify-center flex-wrap">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-95 ${
                      selectedAvatar === avatar
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 mb-2 block">你的昵称</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="请输入昵称"
                maxLength={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-medium active:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium active:opacity-90 transition-opacity shadow-lg shadow-blue-200"
              >
                开始游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
