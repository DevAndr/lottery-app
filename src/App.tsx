import './App.css'
import {useEffect, useState} from "react";
import {motion} from 'framer-motion';
import {
    cellVariants,
    containerVariants,
    rowVariants,
} from "./assets/motion/constants.ts";
import {RewardDialog} from "./components/dialog/RewardDialog.tsx";
import {NavLink} from "react-router-dom";
import {useLotteryStore} from "./store/Lotterystore.ts";

// Значения донатов (суммы на ячейках)
const donateValues = [100, 200, 500, 1000, 2000];

function App() {
    // Состояние для хранения открытых ячеек
    const [showConfetti, setShowConfetti] = useState(false);
    const [modalPrize, setModalPrize] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        prizes,
        openedCells,
        getCellLot,
        openCell,
        clearOpenedCells
    } = useLotteryStore();

    // Закрыть модальное окно
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalPrize(null), 300); // Задержка для анимации
    };

    // Закрытие модального окна по клавише ESC
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleEscKey);
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isModalOpen]);

    // Функция для получения случайного приза или назначенного приза
    const getPrizeForCell = (rowIndex, colIndex) => {
        // Сначала проверяем, есть ли назначенный приз в store
        const assignedPrize = getCellLot(rowIndex, colIndex);

        if (assignedPrize) {
            return assignedPrize;
        }

        // Если нет назначенного приза, выбираем случайный
        if (prizes.length === 0) {
            return {
                id: 0,
                name: 'Нет призов',
                value: '❌',
                color: '#999'
            };
        }

        const randomIndex = Math.floor(Math.random() * prizes.length);
        return prizes[randomIndex];
    };

    // Обработчик клика на ячейку
    const handleCellClick = (rowIndex, colIndex) => {
        const cellKey = `${rowIndex}-${colIndex}`;

        // Если ячейка уже открыта, ничего не делаем
        if (openedCells[cellKey]) return;

        // Получаем случайный приз
        const prize = getPrizeForCell(rowIndex, colIndex);
        openCell(rowIndex, colIndex, prize);

        // Показываем модальное окно с призом
        setModalPrize(prize);

        setTimeout(() => {
            setIsModalOpen(true);
        }, 1000)

        // Показываем конфетти для хороших призов
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

    // Функция сброса игры
    const resetGame = () => {
        clearOpenedCells();
        setShowConfetti(false);
        setModalPrize(null);
        setIsModalOpen(false);
    };

    return (
        <div className="app">
            {/* Модальное окно с призом */}
            <RewardDialog showConfetti={showConfetti} modalPrize={modalPrize} show={isModalOpen} onClose={closeModal}/>

            <motion.div
                className="header"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }}
            >
                <motion.h1
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🎰 Лотерея Донатов 🎰
                </motion.h1>
                <p>Кликай на ячейку и узнай свой приз!</p>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 16}}>
                    <motion.button
                        className="reset-btn"
                        onClick={resetGame}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        🔄 Начать заново
                    </motion.button>
                    <NavLink to={'/admin'}>
                        <motion.button
                            className="admin-btn"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            ⚙️ Админка
                        </motion.button>
                    </NavLink>
                </div>
            </motion.div>

            <motion.div
                className="lottery-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {donateValues.map((value, rowIndex) => (
                    <motion.div
                        key={rowIndex}
                        className="lottery-row"
                        variants={rowVariants}
                    >
                        {/* Ячейка с названием доната */}
                        <motion.div
                            className="donate-label"
                            variants={cellVariants}
                        >
                            Донат<br/>{value}
                        </motion.div>

                        {/* 6 ячеек для каждого ряда */}
                        {[...Array(6)].map((_, colIndex) => {
                            const cellKey = `${rowIndex}-${colIndex}`;
                            const openedPrize = openedCells[cellKey];

                            return (
                                <motion.div
                                    key={colIndex}
                                    className={`lottery-cell ${openedPrize ? 'opened' : ''}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    style={{
                                        backgroundColor: openedPrize ? openedPrize.color : undefined
                                    }}
                                    variants={cellVariants}
                                    whileHover={!openedPrize ? "hover" : undefined}
                                    whileTap={!openedPrize ? "tap" : undefined}
                                    animate={openedPrize ? "animate" : "visible"}
                                    layout
                                >
                                    {openedPrize ? (
                                        <motion.div
                                            className="prize-content"
                                            initial={{opacity: 0, scale: 0}}
                                            animate={{opacity: 1, scale: 1}}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }}
                                        >
                                            <motion.div
                                                className="prize-emoji"
                                                initial={{scale: 0, rotate: -180}}
                                                animate={{scale: 1, rotate: 0}}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 150,
                                                    damping: 12
                                                }}
                                            >
                                                {openedPrize.value}
                                            </motion.div>
                                            <motion.div
                                                className="prize-name"
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{delay: 0.2}}
                                            >
                                                {openedPrize.name}
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <div className="cell-value">{value}</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="footer"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.5}}
            >
                <motion.p
                    key={Object.keys(openedCells).length}
                    initial={{scale: 1.5, color: '#ffd700'}}
                    animate={{scale: 1, color: '#ffffff'}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                    }}
                >
                    Открыто ячеек: {Object.keys(openedCells).length} / 30
                </motion.p>
            </motion.div>
        </div>
    )
}

export default App
