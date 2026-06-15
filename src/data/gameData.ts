import { GameEvent, Cell, CellType } from '@/types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'e1',
    title: '老师心情好',
    description: '老师今天心情特别好，宣布期末考试开卷考！',
    type: 'buff',
    effect: '该课程体验分 × 1.5',
    multiplier: 1.5,
  },
  {
    id: 'e2',
    title: '捡到学霸笔记',
    description: '你在图书馆捡到了上一届学霸的完整笔记！',
    type: 'buff',
    effect: '随机一门课程难度 - 1',
    difficultyChange: -1,
  },
  {
    id: 'e3',
    title: '组队学习',
    description: '同班同学邀请你组队学习，大家互帮互助！',
    type: 'buff',
    effect: '随机一门课程给分 + 1',
    giveScoreChange: 1,
  },
  {
    id: 'e4',
    title: '教室就在楼下',
    description: '这学期选的课都在宿舍楼下，不用早起赶课！',
    type: 'buff',
    effect: '学期体验分额外 + 10',
    bonusScore: 10,
  },
  {
    id: 'e5',
    title: '偶遇学长划重点',
    description: '在食堂偶遇学长，偷偷告诉你考试重点！',
    type: 'buff',
    effect: '该课程体验分 × 1.3',
    multiplier: 1.3,
  },
  {
    id: 'e6',
    title: '临时加作业',
    description: '老师突然宣布增加三篇大作业，而且下周就要交！',
    type: 'debuff',
    effect: '随机一门课程体验分 × 0.7',
    multiplier: 0.7,
  },
  {
    id: 'e7',
    title: '点名严格',
    description: '这门课的老师每节课必点名，缺席一次扣10分！',
    type: 'debuff',
    effect: '随机一门课程难度 + 1',
    difficultyChange: 1,
  },
  {
    id: 'e8',
    title: '闭卷考全书',
    description: '期末考试范围是整本书，而且闭卷！',
    type: 'debuff',
    effect: '随机一门课程给分 - 1',
    giveScoreChange: -1,
  },
  {
    id: 'e9',
    title: '课设撞期',
    description: '两门课的课程设计截止日期撞在一起了！',
    type: 'debuff',
    effect: '随机一门课程体验分 × 0.8',
    multiplier: 0.8,
  },
  {
    id: 'e10',
    title: '老师出差',
    description: '老师出差一周，课代表带课，内容比较简单。',
    type: 'neutral',
    effect: '无影响',
  },
  {
    id: 'e11',
    title: '教室空调坏了',
    description: '三伏天教室空调坏了，上课如同蒸桑拿...',
    type: 'neutral',
    effect: '纯吐槽，无影响',
  },
  {
    id: 'e12',
    title: '校庆放假',
    description: '赶上校庆，停课一天，开心！',
    type: 'neutral',
    effect: '无影响',
  },
];

export const VIRTUAL_RANK_DATA = [
  { name: '清华·选课王', score: 985, rank: '学神' },
  { name: '北大·GPA满点', score: 958, rank: '学神' },
  { name: '复旦·避坑达人', score: 923, rank: '学霸' },
  { name: '交大·抢课快枪手', score: 888, rank: '学霸' },
  { name: '浙大·选课锦鲤', score: 866, rank: '学霸' },
  { name: '南大·选修课达人', score: 835, rank: '学霸' },
  { name: '中科大·学分收割机', score: 802, rank: '普通学生' },
  { name: '哈工大·不挂科万岁', score: 768, rank: '普通学生' },
  { name: '同济·选课小白', score: 720, rank: '普通学生' },
  { name: '武大·踩坑专业户', score: 650, rank: '学渣' },
];

export const BOARD_SIZE = 32;

export const generateBoardCells = (canvasWidth: number, canvasHeight: number): Cell[] => {
  const cells: Cell[] = [];
  const padding = 30;
  const cellSize = Math.min((canvasWidth - padding * 2) / 8, (canvasHeight - padding * 2) / 8);
  const innerWidth = canvasWidth - padding * 2;
  const innerHeight = canvasHeight - padding * 2;

  const typeSequence: CellType[] = [];
  const typeCounts: Record<CellType, number> = {
    start: 1,
    course: 12,
    rush: 4,
    trap: 3,
    event: 6,
    trade: 3,
    chance: 3,
  };

  (Object.keys(typeCounts) as CellType[]).forEach((type) => {
    for (let i = 0; i < typeCounts[type]; i++) {
      typeSequence.push(type);
    }
  });

  for (let i = 1; i < typeSequence.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [typeSequence[i], typeSequence[j]] = [typeSequence[j], typeSequence[i]];
  }

  const startIdx = typeSequence.indexOf('start');
  if (startIdx !== 0) {
    [typeSequence[0], typeSequence[startIdx]] = [typeSequence[startIdx], typeSequence[0]];
  }

  const positions: { x: number; y: number }[] = [];
  const cols = 8;
  const rows = 8;
  const stepX = innerWidth / (cols - 1);
  const stepY = innerHeight / (rows - 1);

  for (let c = 0; c < cols; c++) positions.push({ x: padding + c * stepX, y: padding });
  for (let r = 1; r < rows; r++) positions.push({ x: padding + innerWidth, y: padding + r * stepY });
  for (let c = cols - 2; c >= 0; c--) positions.push({ x: padding + c * stepX, y: padding + innerHeight });
  for (let r = rows - 2; r > 0; r--) positions.push({ x: padding, y: padding + r * stepY });

  while (positions.length < BOARD_SIZE) {
    const c = Math.floor(Math.random() * (cols - 2)) + 1;
    const r = Math.floor(Math.random() * (rows - 2)) + 1;
    positions.push({ x: padding + c * stepX, y: padding + r * stepY });
  }

  const typeColors: Record<CellType, string> = {
    start: '#10B981',
    course: '#3B82F6',
    rush: '#F59E0B',
    trap: '#EF4444',
    event: '#8B5CF6',
    trade: '#EC4899',
    chance: '#06B6D4',
  };

  for (let i = 0; i < BOARD_SIZE; i++) {
    cells.push({
      id: i,
      type: typeSequence[i % typeSequence.length],
      x: positions[i].x,
      y: positions[i].y,
      color: typeColors[typeSequence[i % typeSequence.length]],
    });
  }

  return cells;
};

export const getCellTypeLabel = (type: CellType): string => {
  const labels: Record<CellType, string> = {
    start: '起点',
    course: '选课',
    rush: '抢课',
    trap: '陷阱',
    event: '事件',
    trade: '交易',
    chance: '机会',
  };
  return labels[type];
};

export const AVATARS = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💻', '👩‍💻', '🐱', '🐶', '🦊'];

export const getRandomEvent = (): GameEvent => {
  return GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
};

export const getGraduationRank = (score: number): { rank: string; color: string } => {
  if (score >= 900) return { rank: '学神', color: 'text-amber-500' };
  if (score >= 750) return { rank: '学霸', color: 'text-emerald-500' };
  if (score >= 500) return { rank: '普通学生', color: 'text-blue-500' };
  return { rank: '学渣', color: 'text-gray-500' };
};

export const getCourseCredits = (course: any): number => {
  if (course.credits) return course.credits;
  if (course.category === '必修') return 4;
  if (course.category === '选修') return 3;
  return 2;
};

export const getCourseRarity = (course: any): string => {
  if (course.isRare || course.rating >= 4.7) return 'legendary';
  if (course.rating >= 4.0) return 'good';
  if (course.rating < 3.0 || course.difficulty >= 4.0) return 'trap';
  return 'normal';
};

export const getRarityBorderClass = (rarity: string): string => {
  switch (rarity) {
    case 'legendary':
      return 'ring-4 ring-amber-400 shadow-lg shadow-amber-200';
    case 'good':
      return 'ring-2 ring-emerald-400';
    case 'trap':
      return 'ring-2 ring-red-400';
    default:
      return 'ring-1 ring-gray-200';
  }
};

export const getRarityLabel = (rarity: string): { label: string; color: string } => {
  switch (rarity) {
    case 'legendary':
      return { label: '神仙课', color: 'text-amber-500' };
    case 'good':
      return { label: '好评课', color: 'text-emerald-500' };
    case 'trap':
      return { label: '坑课', color: 'text-red-500' };
    default:
      return { label: '普通课', color: 'text-gray-500' };
  }
};
