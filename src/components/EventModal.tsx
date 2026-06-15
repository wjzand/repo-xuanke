import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { GameEvent, EventType } from '@/types';

const getEventIcon = (type: EventType) => {
  switch (type) {
    case 'buff':
      return <TrendingUp size={32} className="text-emerald-500" />;
    case 'debuff':
      return <TrendingDown size={32} className="text-red-500" />;
    default:
      return <Minus size={32} className="text-gray-500" />;
  }
};

const getEventBg = (type: EventType) => {
  switch (type) {
    case 'buff':
      return 'from-emerald-500 to-teal-500';
    case 'debuff':
      return 'from-red-500 to-orange-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

export const EventModal = () => {
  const modalData = useGameStore((s) => s.modalData);
  const handleEventChoice = useGameStore((s) => s.handleEventChoice);
  const closeModal = useGameStore((s) => s.closeModal);

  if (!modalData?.event) return null;
  const event: GameEvent = modalData.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm overflow-hidden animate-[fadeInUp_0.25s_ease-out]">
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getEventBg(event.type)}`} />

        <div className="pt-2">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getEventBg(
                event.type
              )} flex items-center justify-center`}
            >
              {getEventIcon(event.type)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles
                  size={14}
                  className={
                    event.type === 'buff'
                      ? 'text-emerald-500'
                      : event.type === 'debuff'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    event.type === 'buff'
                      ? 'text-emerald-600'
                      : event.type === 'debuff'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {event.type === 'buff' ? '增益事件' : event.type === 'debuff' ? '减益事件' : '中性事件'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3">{event.description}</p>

          <div
            className={`p-3 rounded-xl mb-4 ${
              event.type === 'buff'
                ? 'bg-emerald-50 border border-emerald-100'
                : event.type === 'debuff'
                ? 'bg-red-50 border border-red-100'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                event.type === 'buff'
                  ? 'text-emerald-700'
                  : event.type === 'debuff'
                  ? 'text-red-700'
                  : 'text-gray-700'
              }`}
            >
              效果：{event.effect}
            </p>
          </div>

          {event.type !== 'neutral' ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleEventChoice(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-medium active:bg-gray-50 transition-colors"
              >
                拒绝
              </button>
              <button
                onClick={() => handleEventChoice(true)}
                className={`flex-1 py-3 text-white rounded-full font-medium transition-colors ${
                  event.type === 'buff'
                    ? 'bg-emerald-500 active:bg-emerald-600'
                    : 'bg-red-500 active:bg-red-600'
                }`}
              >
                接受
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleEventChoice(true)}
              className="w-full py-3 bg-blue-500 text-white rounded-full font-medium active:bg-blue-600 transition-colors"
            >
              知道了
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
