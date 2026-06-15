import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { RankEntry } from '@/types';

export const GameRank = () => {
  const navigate = useNavigate();
  const getRankList = useGameStore((s) => s.getRankList);
  const initGameStore = useGameStore((s) => s.init);
  const [ranks, setRanks] = useState<RankEntry[]>([]);
  const [tab, setTab] = useState<'local' | 'virtual'>('local');

  useEffect(() => {
    initGameStore();
    setRanks(getRankList());
  }, []);

  const localRanks = ranks.filter((r) => r.isLocal);
  const virtualRanks = ranks.filter((r) => !r.isLocal);
  const displayRanks = tab === 'local' ? localRanks : virtualRanks;

  const getIcon = (idx: number) => {
    if (idx === 0) return <Crown size={20} className="text-amber-500" />;
    if (idx === 1) return <Medal size={20} className="text-gray-400" />;
    if (idx === 2) return <Medal size={20} className="text-amber-700" />;
    return <span className="w-5 text-center text-gray-500 font-bold">{idx + 1}</span>;
  };

  const getBgColor = (idx: number) => {
    if (idx === 0) return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
    if (idx === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    if (idx === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
    return 'bg-white border-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-orange-600 pb-24">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 mr-8">排行榜</h1>
        </div>
      </div>

      <div className="px-4 pt-6 text-center text-white">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Trophy size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold">选课体验分排行榜</h2>
        <p className="text-white/80 text-sm mt-1">看看谁是真正的选课学神</p>
      </div>

      <div className="px-4 mt-4">
        <div className="flex bg-white/20 backdrop-blur rounded-full p-1">
          <button
            onClick={() => setTab('local')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'local' ? 'bg-white text-orange-600 shadow' : 'text-white'
            }`}
          >
            本地排行
          </button>
          <button
            onClick={() => setTab('virtual')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'virtual' ? 'bg-white text-orange-600 shadow' : 'text-white'
            }`}
          >
            全国榜
          </button>
        </div>
      </div>

      <div className="px-4 mt-4">
        {displayRanks.length > 0 ? (
          <div className="space-y-2">
            {displayRanks.slice(0, 15).map((rank, idx) => (
              <div
                key={`${rank.name}-${idx}`}
                className={`rounded-xl p-3 flex items-center gap-3 border ${getBgColor(idx)}`}
              >
                <div className="w-8 flex items-center justify-center">{getIcon(idx)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{rank.name}</div>
                  <div className={`text-xs font-medium ${
                    rank.rank === '学神' ? 'text-amber-600' :
                    rank.rank === '学霸' ? 'text-emerald-600' :
                    rank.rank === '普通学生' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {rank.rank}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{rank.score}</div>
                  <div className="text-xs text-gray-400">体验分</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur rounded-xl p-8 text-center text-white">
            <Trophy size={48} className="mx-auto mb-3 opacity-60" />
            <p>还没有排行记录</p>
            <p className="text-sm text-white/70 mt-1">快去完成游戏，登顶排行榜！</p>
          </div>
        )}
      </div>

      {tab === 'virtual' && (
        <p className="text-center text-white/60 text-xs mt-4 px-8">
          * 全国榜为虚拟Mock数据，仅供娱乐参考
        </p>
      )}
    </div>
  );
};
