import { create } from 'zustand';
import {
  GameState,
  PlayerArchive,
  Course,
  SelectedCourse,
  GameEvent,
  CellType,
  RankEntry,
  GameStatus,
  GraduationRank,
  GameStore,
} from '@/types';
import {
  loadArchives,
  saveArchives,
  loadGameState,
  saveGameState,
  removeGameState,
} from '@/utils/storage';
import {
  VIRTUAL_RANK_DATA,
  getRandomEvent,
  getGraduationRank,
  getCourseCredits,
  BOARD_SIZE,
  generateBoardCells,
} from '@/data/gameData';
import { generateId } from '@/utils/helpers';

const TOTAL_SEMESTERS = 4;
const MOVES_PER_SEMESTER = 8;
const CREDITS_PER_SEMESTER = 12;

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  archives: [],
  currentModal: null,
  modalData: null,
  cells: [],
  boardCanvasSize: { width: 360, height: 360 },

  init: () => {
    const archives = loadArchives();
    const savedGame = loadGameState();
    set({ archives, currentGame: savedGame });
  },

  setBoardSize: (w, h) => {
    const size = Math.min(w, h);
    const cells = generateBoardCells(size, size);
    set({ boardCanvasSize: { width: size, height: size }, cells });
  },

  createArchive: (name, avatar) => {
    const { archives } = get();
    const newArchive: PlayerArchive = {
      id: generateId(),
      name,
      avatar,
      totalScore: 0,
      rank: '普通学生',
      completed: false,
      collectedCourses: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const newArchives = [...archives, newArchive];
    saveArchives(newArchives);
    set({ archives: newArchives });
    return newArchive.id;
  },

  deleteArchive: (id) => {
    const { archives } = get();
    const newArchives = archives.filter((a) => a.id !== id);
    saveArchives(newArchives);
    set({ archives: newArchives });
  },

  startGame: (archiveId) => {
    const { archives, boardCanvasSize } = get();
    const archive = archives.find((a) => a.id === archiveId);
    if (!archive) return;

    const cells = generateBoardCells(boardCanvasSize.width, boardCanvasSize.height);

    const newGame: GameState = {
      archiveId: archive.id,
      playerName: archive.name,
      playerAvatar: archive.avatar,
      currentSemester: 1,
      totalSemesters: TOTAL_SEMESTERS,
      currentPosition: 0,
      movesLeft: MOVES_PER_SEMESTER,
      movesPerSemester: MOVES_PER_SEMESTER,
      creditsPerSemester: CREDITS_PER_SEMESTER,
      currentCredits: 0,
      selectedCourses: [],
      semesterScore: 0,
      totalScore: 0,
      diceValue: 1,
      isRolling: false,
      isMoving: false,
      gameStatus: 'playing',
      pendingEvent: null,
      pendingCourses: [],
      rushTimeLeft: 0,
      collectedCourses: [...archive.collectedCourses],
      showCardBack: {},
    };

    saveGameState(newGame);
    set({ currentGame: newGame, cells, currentModal: null, modalData: null });
  },

  continueGame: () => {
    const savedGame = loadGameState();
    if (savedGame) {
      const { boardCanvasSize } = get();
      const cells = generateBoardCells(boardCanvasSize.width, boardCanvasSize.height);
      set({ currentGame: savedGame, cells });
    }
  },

  rollDice: () => {
    const { currentGame } = get();
    if (!currentGame || currentGame.isRolling || currentGame.isMoving || currentGame.movesLeft <= 0) return;

    set((state) => ({
      currentGame: state.currentGame ? { ...state.currentGame, isRolling: true } : null,
    }));

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      set((state) => ({
        currentGame: state.currentGame ? { ...state.currentGame, diceValue: randomValue } : null,
      }));
      rollCount++;
      if (rollCount >= 15) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        set((state) => {
          if (!state.currentGame) return state;
          const newPosition = (state.currentGame.currentPosition + finalValue) % BOARD_SIZE;
          return {
            currentGame: {
              ...state.currentGame,
              diceValue: finalValue,
              isRolling: false,
              isMoving: true,
              currentPosition: newPosition,
              movesLeft: state.currentGame.movesLeft - 1,
            },
          };
        });
        setTimeout(() => get().finishMove(), 600);
      }
    }, 80);
  },

  finishMove: () => {
    const { currentGame, cells } = get();
    if (!currentGame) return;

    const currentCell = cells[currentGame.currentPosition];
    if (!currentCell) {
      set((state) => ({
        currentGame: state.currentGame ? { ...state.currentGame, isMoving: false } : null,
      }));
      return;
    }

    const cellType: CellType = currentCell.type;

    set((state) => ({
      currentGame: state.currentGame ? { ...state.currentGame, isMoving: false } : null,
    }));

    get().triggerCellEvent(cellType);
  },

  triggerCellEvent: (cellType: CellType) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const { courses } = (window as any).__COURSES__ || { courses: [] };

    switch (cellType) {
      case 'start': {
        get().showToast('回到起点，休息一下~');
        break;
      }
      case 'course': {
        const randomCourse = courses[Math.floor(Math.random() * courses.length)];
        set({ currentModal: 'course', modalData: { course: randomCourse } });
        break;
      }
      case 'rush': {
        const shuffled = [...courses].sort(() => Math.random() - 0.5);
        const topCourses = shuffled.filter((c) => c.rating >= 4.0).slice(0, 3);
        const rushCourses = topCourses.length >= 3 ? topCourses : shuffled.slice(0, 3);
        set({
          currentModal: 'rush',
          modalData: { courses: rushCourses },
          currentGame: currentGame ? { ...currentGame, rushTimeLeft: 5 } : null,
        });
        get().startRushCountdown();
        break;
      }
      case 'trap': {
        const trapCourses = courses.filter((c) => c.rating < 3.0 || c.difficulty >= 4.0);
        const trapCourse = trapCourses.length > 0
          ? trapCourses[Math.floor(Math.random() * trapCourses.length)]
          : courses[Math.floor(Math.random() * courses.length)];
        get().addCourseToSchedule(trapCourse, true);
        get().showToast(`踩到坑课陷阱！${trapCourse.name} 被迫加入课表`);
        break;
      }
      case 'event': {
        const event = getRandomEvent();
        set({ currentModal: 'event', modalData: { event } });
        break;
      }
      case 'trade': {
        const randomCourse = courses[Math.floor(Math.random() * courses.length)];
        set({
          currentModal: 'trade',
          modalData: {
            newCourse: randomCourse,
            selectedCourses: currentGame.selectedCourses,
          },
        });
        break;
      }
      case 'chance': {
        const bonus = Math.floor(Math.random() * 10) + 1;
        set((state) => {
          if (!state.currentGame) return state;
          return {
            currentGame: {
              ...state.currentGame,
              semesterScore: state.currentGame.semesterScore + bonus,
            },
          };
        });
        get().showToast(`运气爆棚！获得 ${bonus} 额外体验分！`);
        break;
      }
    }

    const game = get().currentGame;
    if (game) {
      saveGameState(game);
    }
  },

  startRushCountdown: () => {
    const countdownInterval = setInterval(() => {
      const { currentGame } = get();
      if (!currentGame || currentGame.rushTimeLeft <= 1) {
        clearInterval(countdownInterval);
        if (get().currentModal === 'rush') {
          get().rushSelectCourse(null);
        }
        return;
      }
      set((state) => ({
        currentGame: state.currentGame
          ? { ...state.currentGame, rushTimeLeft: state.currentGame.rushTimeLeft - 1 }
          : null,
      }));
    }, 1000);
  },

  addCourseToSchedule: (course: Course, isTrap = false) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const credits = getCourseCredits(course);

    const selectedCourse: SelectedCourse = {
      course,
      eventMultipliers: [],
      difficultyMod: 0,
      giveScoreMod: 0,
    };

    let newCredits = currentGame.currentCredits + credits;
    let newSelectedCourses = [...currentGame.selectedCourses, selectedCourse];

    const newCollected = currentGame.collectedCourses.includes(course.id)
      ? currentGame.collectedCourses
      : [...currentGame.collectedCourses, course.id];

    const courseScore = course.rating * credits;
    const newSemesterScore = currentGame.semesterScore + courseScore;

    const newGame = {
      ...currentGame,
      currentCredits: newCredits,
      selectedCourses: newSelectedCourses,
      collectedCourses: newCollected,
      semesterScore: newSemesterScore,
    };

    saveGameState(newGame);
    set({ currentGame: newGame });

    if (!isTrap && newCredits >= currentGame.creditsPerSemester) {
      setTimeout(() => {
        if (get().currentGame && get().currentGame.currentCredits >= CREDITS_PER_SEMESTER) {
          get().showToast('学分已修满！');
        }
      }, 500);
    }
  },

  selectCourse: (course) => {
    if (course) {
      get().addCourseToSchedule(course);
      get().showToast(`已选择 ${course.name}`);
    }
    set({ currentModal: null, modalData: null });
    get().checkSemesterEnd();
  },

  rushSelectCourse: (courseId) => {
    const { currentGame, modalData } = get();
    if (!currentGame) {
      set({ currentModal: null, modalData: null });
      return;
    }

    if (courseId && modalData?.courses) {
      const course = modalData.courses.find((c: Course) => c.id === courseId);
      if (course) {
        get().addCourseToSchedule(course);
        get().showToast(`抢到了 ${course.name}！`);
      }
    } else {
      get().showToast('手太慢了，课被抢光了...');
    }

    set({
      currentModal: null,
      modalData: null,
      currentGame: { ...currentGame, rushTimeLeft: 0 },
    });
    get().checkSemesterEnd();
  },

  handleEventChoice: (accept) => {
    const { currentGame, modalData } = get();
    if (!currentGame || !modalData?.event) {
      set({ currentModal: null, modalData: null });
      return;
    }

    const event: GameEvent = modalData.event;

    if (accept) {
      let newSelectedCourses = [...currentGame.selectedCourses];
      let newSemesterScore = currentGame.semesterScore;

      if (newSelectedCourses.length > 0) {
        const randomIdx = Math.floor(Math.random() * newSelectedCourses.length);
        const targetCourse = { ...newSelectedCourses[randomIdx] };

        if (event.multiplier) {
          targetCourse.eventMultipliers = [...targetCourse.eventMultipliers, event.multiplier];
        }
        if (event.difficultyChange) {
          targetCourse.difficultyMod += event.difficultyChange;
        }
        if (event.giveScoreChange) {
          targetCourse.giveScoreMod += event.giveScoreChange;
        }

        newSelectedCourses[randomIdx] = targetCourse;
      }

      if (event.bonusScore) {
        newSemesterScore += event.bonusScore;
      }

      const newGame = {
        ...currentGame,
        selectedCourses: newSelectedCourses,
        semesterScore: newSemesterScore,
      };
      saveGameState(newGame);
      set({ currentGame: newGame });
      get().showToast(event.effect);
    } else {
      get().showToast('选择放弃，无事发生');
    }

    set({ currentModal: null, modalData: null });
    get().checkSemesterEnd();
  },

  tradeCourse: (dropCourseId, newCourse) => {
    const { currentGame } = get();
    if (!currentGame) {
      set({ currentModal: null, modalData: null });
      return;
    }

    if (dropCourseId && newCourse) {
      let newSelectedCourses = currentGame.selectedCourses.filter(
        (sc) => sc.course.id !== dropCourseId
      );

      const dropCourse = currentGame.selectedCourses.find((sc) => sc.course.id === dropCourseId);
      const dropCredits = dropCourse ? getCourseCredits(dropCourse.course) : 0;
      const dropScore = dropCourse ? dropCourse.course.rating * dropCredits : 0;

      const newCredits = getCourseCredits(newCourse);
      const newScore = newCourse.rating * newCredits;

      const selectedCourse: SelectedCourse = {
        course: newCourse,
        eventMultipliers: [],
        difficultyMod: 0,
        giveScoreMod: 0,
      };

      newSelectedCourses.push(selectedCourse);

      const newCollected = currentGame.collectedCourses.includes(newCourse.id)
        ? currentGame.collectedCourses
        : [...currentGame.collectedCourses, newCourse.id];

      const newGame = {
        ...currentGame,
        currentCredits: currentGame.currentCredits - dropCredits + newCredits,
        selectedCourses: newSelectedCourses,
        collectedCourses: newCollected,
        semesterScore: currentGame.semesterScore - dropScore + newScore,
      };
      saveGameState(newGame);
      set({ currentGame: newGame });
      get().showToast('交易成功！');
    } else {
      get().showToast('放弃交易');
    }

    set({ currentModal: null, modalData: null });
    get().checkSemesterEnd();
  },

  checkSemesterEnd: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    if (currentGame.movesLeft <= 0) {
      setTimeout(() => {
        const game = get().currentGame;
        if (game && game.movesLeft <= 0) {
          set({ currentModal: 'semester' });
        }
      }, 300);
    }
  },

  nextSemester: () => {
    const { currentGame, archives } = get();
    if (!currentGame) return;

    let semesterScore = currentGame.semesterScore;
    currentGame.selectedCourses.forEach((sc) => {
      let multiplier = 1;
      sc.eventMultipliers.forEach((m) => {
        multiplier *= m;
      });
      const credits = getCourseCredits(sc.course);
      const baseScore = sc.course.rating * credits;
      semesterScore += baseScore * (multiplier - 1);
    });

    const newTotalScore = currentGame.totalScore + Math.round(semesterScore);
    const isLastSemester = currentGame.currentSemester >= currentGame.totalSemesters;

    if (isLastSemester) {
      const rankInfo = getGraduationRank(newTotalScore);
      const newArchive = archives.map((a) => {
        if (a.id === currentGame.archiveId) {
          return {
            ...a,
            totalScore: newTotalScore,
            rank: rankInfo.rank as GraduationRank,
            completed: true,
            collectedCourses: currentGame.collectedCourses,
          };
        }
        return a;
      });
      saveArchives(newArchive);

      set({
        archives: newArchive,
        currentModal: 'graduation',
        modalData: {
          totalScore: newTotalScore,
          rank: rankInfo.rank,
          rankColor: rankInfo.color,
          courses: currentGame.selectedCourses,
          semesterScore: Math.round(semesterScore),
        },
        currentGame: {
          ...currentGame,
          totalScore: newTotalScore,
          semesterScore: Math.round(semesterScore),
          gameStatus: 'graduated',
        },
      });
      removeGameState();
    } else {
      const newGame: GameState = {
        ...currentGame,
        currentSemester: currentGame.currentSemester + 1,
        currentPosition: 0,
        movesLeft: MOVES_PER_SEMESTER,
        currentCredits: 0,
        selectedCourses: [],
        semesterScore: 0,
        totalScore: newTotalScore,
        diceValue: 1,
        gameStatus: 'playing',
      };
      saveGameState(newGame);
      set({ currentGame: newGame, currentModal: null, modalData: null });
      get().showToast(`第 ${newGame.currentSemester} 学期开始！`);
    }
  },

  closeModal: () => set({ currentModal: null, modalData: null }),

  getRankList: () => {
    const { archives } = get();
    const localRanks: RankEntry[] = archives
      .filter((a) => a.completed)
      .map((a) => ({
        name: a.name,
        score: a.totalScore,
        rank: a.rank,
        isLocal: true,
      }))
      .sort((a, b) => b.score - a.score);

    const virtualRanks: RankEntry[] = VIRTUAL_RANK_DATA.map((r) => ({
      ...r,
      isLocal: false,
    }));

    return [...localRanks, ...virtualRanks].sort((a, b) => b.score - a.score);
  },

  getCollectedCourses: () => {
    const { archives, currentGame } = get();
    let collectedIds: string[] = [];

    if (currentGame) {
      collectedIds = currentGame.collectedCourses;
    } else if (archives.length > 0) {
      archives.forEach((a) => {
        a.collectedCourses.forEach((id) => {
          if (!collectedIds.includes(id)) collectedIds.push(id);
        });
      });
    }

    const { courses } = (window as any).__COURSES__ || { courses: [] };
    return courses.filter((c: Course) => collectedIds.includes(c.id));
  },

  toggleCardBack: (courseId) => {
    const { currentGame } = get();
    if (!currentGame) return;
    const newShowBack = { ...currentGame.showCardBack };
    newShowBack[courseId] = !newShowBack[courseId];
    set({
      currentGame: { ...currentGame, showCardBack: newShowBack },
    });
  },

  saveTranscript: () => {
    return 'transcript_saved';
  },

  exitGame: () => {
    set({ currentGame: null, currentModal: null, modalData: null });
  },

  showToast: (msg: string) => {
    const { showToast } = (window as any).__APP_STORE__ || { showToast: () => {} };
    if (typeof showToast === 'function') {
      showToast(msg);
    }
  },
}));
