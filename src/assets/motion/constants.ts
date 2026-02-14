// Варианты анимаций для Framer Motion
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            staggerChildren: 0.05
        }
    }
};

export const cellVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        rotateY: -90
    },
    visible: {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15
        }
    },
    hover: {
        scale: 1.1,
        rotate: [0, -5, 5, -5, 0],
        transition: {
            rotate: {
                duration: 0.5,
                ease: "easeInOut"
            },
            scale: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

export const openedCellVariants = {
    initial: {
        rotateY: 0,
        scale: 1
    },
    animate: {
        rotateY: [0, 180, 360],
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    }
};

export const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 50
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: 0.2
        }
    }
};

export const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
};