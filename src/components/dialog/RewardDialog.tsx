import {AnimatePresence, motion} from "framer-motion";
import {modalVariants, overlayVariants} from "../../assets/motion/constants.ts";
import Lottie from "lottie-react";
import confettiAnimation from "../../assets/lottie/confetti.json";
import type {FC} from "react";

interface Props {
    show: boolean;
    showConfetti: boolean;
    modalPrize?: {
        value: string;
        name: string;
        id: number;
        color: string;
    } | null
    onClose: () => void;
}

export const RewardDialog: FC<Props> = ({show, showConfetti, modalPrize, onClose}) => {


    return <AnimatePresence>
        {show && modalPrize && (
            <motion.div
                className="modal-overlay"
                onClick={onClose}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {showConfetti && <div className="confetti-container">
                    <Lottie
                        animationData={confettiAnimation}
                        loop={false}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}
                    />
                </div>}
                <motion.div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <button className="modal-close" onClick={onClose}>×</button>
                    <div className="modal-prize">
                        <motion.div
                            className="modal-prize-emoji"
                            initial={{scale: 0, rotate: -180}}
                            animate={{scale: 1, rotate: 0}}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1
                            }}
                        >
                            {modalPrize.value}
                        </motion.div>
                        <motion.h2
                            className="modal-prize-title"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3}}
                        >
                            {modalPrize.name}
                        </motion.h2>
                        <motion.p
                            className="modal-prize-message"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.4}}
                        >
                            🎉 Поздравляем! Вы выиграли!
                        </motion.p>
                        <motion.button
                            className="modal-button"
                            onClick={onClose}
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: 0.5}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Продолжить
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
}