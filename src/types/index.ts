export type TagType = 'success' | 'danger' | 'gray' | 'warning' | 'primary';

export interface Review {
  id: string;
  courseId: string;
  author: string;
  rating: number;
  difficulty: number;
  giveScore: number;
  content: string;
  tags: string[];
  likes: number;
  liked: boolean;
  date: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  college: string;
  category: '必修' | '选修' | '通识';
  rating: number;
  difficulty: number;
  giveScore: number;
  tags: string[];
  tagTypes: TagType[];
  reviewCount: number;
  reviews: Review[];
  credits?: number;
  isRare?: boolean;
}

export interface UserData {
  favorites: string[];
  compareList: string[];
  myReviewIds: string[];
}

export type FilterType = 'all' | 'top' | 'easy' | 'generous' | 'warning';

export type CellType = 'start' | 'course' | 'rush' | 'trap' | 'event' | 'trade' | 'chance';
export type EventType = 'buff' | 'debuff' | 'neutral';
export type Rarity = 'normal' | 'good' | 'legendary' | 'trap';
export type GameStatus = 'idle' | 'playing' | 'semesterEnd' | 'graduated';
export type GraduationRank = '学渣' | '普通学生' | '学霸' | '学神';

export interface Cell {
  id: number;
  type: CellType;
  x: number;
  y: number;
  color: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  effect: string;
  multiplier?: number;
  difficultyChange?: number;
  giveScoreChange?: number;
  bonusScore?: number;
}

export interface SelectedCourse {
  course: Course;
  eventMultipliers: number[];
  difficultyMod: number;
  giveScoreMod: number;
}

export interface PlayerArchive {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  rank: GraduationRank;
  completed: boolean;
  collectedCourses: string[];
  createdAt: string;
}

export interface GameState {
  archiveId: string;
  playerName: string;
  playerAvatar: string;
  currentSemester: number;
  totalSemesters: number;
  currentPosition: number;
  movesLeft: number;
  movesPerSemester: number;
  creditsPerSemester: number;
  currentCredits: number;
  selectedCourses: SelectedCourse[];
  semesterScore: number;
  totalScore: number;
  diceValue: number;
  isRolling: boolean;
  isMoving: boolean;
  gameStatus: GameStatus;
  pendingEvent: GameEvent | null;
  pendingCourses: Course[];
  rushTimeLeft: number;
  collectedCourses: string[];
  showCardBack: Record<string, boolean>;
}

export interface RankEntry {
  name: string;
  score: number;
  rank: string;
  isLocal: boolean;
}

export interface GameStore {
  currentGame: GameState | null;
  archives: PlayerArchive[];
  currentModal: null | 'course' | 'rush' | 'event' | 'semester' | 'graduation' | 'trade';
  modalData: any;
  cells: any[];
  boardCanvasSize: { width: number; height: number };

  init: () => void;
  setBoardSize: (w: number, h: number) => void;
  createArchive: (name: string, avatar: string) => string;
  deleteArchive: (id: string) => void;
  startGame: (archiveId: string) => void;
  continueGame: () => void;
  rollDice: () => void;
  finishMove: () => void;
  triggerCellEvent: (cellType: CellType) => void;
  startRushCountdown: () => void;
  addCourseToSchedule: (course: Course, isTrap?: boolean) => void;
  checkSemesterEnd: () => void;
  selectCourse: (course: Course | null) => void;
  rushSelectCourse: (courseId: string | null) => void;
  handleEventChoice: (accept: boolean) => void;
  tradeCourse: (dropCourseId: string | null, newCourse: Course | null) => void;
  nextSemester: () => void;
  closeModal: () => void;
  getRankList: () => RankEntry[];
  getCollectedCourses: () => Course[];
  toggleCardBack: (courseId: string) => void;
  saveTranscript: () => string;
  exitGame: () => void;
  showToast: (msg: string) => void;
}
