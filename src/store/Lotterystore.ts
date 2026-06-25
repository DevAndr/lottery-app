import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Интерфейс для приза
export interface Prize {
    id: number;
    name: string;
    value: string; // эмодзи
    color: string;
    image?: string; // путь к картинке из /images/gifts/
}

// Интерфейс для ячейки с лотом
export interface CellLot {
    rowIndex: number;
    colIndex: number;
    prize: Prize | null;
}

// Дефолтные призы
export const defaultPrizes: Prize[] = [];

interface LotteryStore {
    // Список всех доступных призов
    prizes: Prize[];

    // Назначенные призы для каждой ячейки (ключ: "row-col")
    cellLots: Record<string, Prize>;

    // Открытые ячейки (ключ: "row-col")
    openedCells: Record<string, Prize>;

    // Действия
    setPrizes: (prizes: Prize[]) => void;
    addPrize: (prize: Prize) => void;
    updatePrize: (id: number, prize: Partial<Prize>) => void;
    deletePrize: (id: number) => void;

    setCellLot: (rowIndex: number, colIndex: number, prize: Prize | null) => void;
    getCellLot: (rowIndex: number, colIndex: number) => Prize | null;
    clearAllLots: () => void;
    randomizeAllLots: () => void;

    openCell: (rowIndex: number, colIndex: number, prize: Prize) => void;
    clearOpenedCells: () => void;

    // Сброс всего стора
    resetStore: () => void;
}

// Создание store с persist middleware для localStorage
export const useLotteryStore = create<LotteryStore>()(
    persist(
        (set, get) => ({
            prizes: defaultPrizes,
            cellLots: {},
            openedCells: {},

            setPrizes: (prizes) => set({ prizes }),

            addPrize: (prize) =>
                set((state) => ({
                    prizes: [...state.prizes, prize],
                })),

            updatePrize: (id, updatedPrize) =>
                set((state) => ({
                    prizes: state.prizes.map((prize) =>
                        prize.id === id ? { ...prize, ...updatedPrize } : prize
                    ),
                })),

            deletePrize: (id) =>
                set((state) => ({
                    prizes: state.prizes.filter((prize) => prize.id !== id),
                })),

            setCellLot: (rowIndex, colIndex, prize) => {
                const key = `${rowIndex}-${colIndex}`;
                set((state) => {
                    const newLots = { ...state.cellLots };
                    if (prize === null) {
                        delete newLots[key];
                    } else {
                        newLots[key] = prize;
                    }
                    return { cellLots: newLots };
                });
            },

            getCellLot: (rowIndex, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                return get().cellLots[key] || null;
            },

            clearAllLots: () => set({ cellLots: {} }),

            randomizeAllLots: () => {
                const { prizes } = get();
                if (prizes.length === 0) return;

                const newLots: Record<string, Prize> = {};

                // 6 рядов, 6 колонок
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
                        newLots[`${row}-${col}`] = randomPrize;
                    }
                }

                set({ cellLots: newLots });
            },

            openCell: (rowIndex, colIndex, prize) => {
                const key = `${rowIndex}-${colIndex}`;
                set((state) => ({
                    openedCells: {
                        ...state.openedCells,
                        [key]: prize,
                    },
                }));
            },

            clearOpenedCells: () => set({ openedCells: {} }),

            resetStore: () =>
                set({
                    prizes: defaultPrizes,
                    cellLots: {},
                    openedCells: {},
                }),
        }),
        {
            name: 'lottery-storage', // имя в localStorage
            partialize: (state) => ({
                prizes: state.prizes,
                cellLots: state.cellLots,
                // openedCells не сохраняем - они сбрасываются при перезагрузке
            }),
        }
    )
);