import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Emojipicker.css';

type EmojiCategorie = {
    name: string
    emojis: string[]
}

// Категории эмодзи
const emojiCategories: Record<string, EmojiCategorie> = {
    prizes: {
        name: '🏆 Призы',
        emojis: ['🎁', '💎', '🏆', '🎯', '⭐', '🎪', '🎨', '🎭', '🎬', '🎮', '🎲', '🎰', '🎸', '🎹', '🎺']
    },
    money: {
        name: '💰 Деньги',
        emojis: ['💰', '💵', '💴', '💶', '💷', '💳', '💸', '🤑', '🏦', '💲', '🪙']
    },
    electronics: {
        name: '📱 Электроника',
        emojis: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '📷', '📹', '📺', '⌚', '🎧', '🎙️']
    },
    celebration: {
        name: '🎉 Праздник',
        emojis: ['🎉', '🎊', '🎈', '🎀', '🎆', '🎇', '✨', '💫', '🌟', '⭐', '🔥', '💥']
    },
    food: {
        name: '🍕 Еда',
        emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍩', '🍪', '🍫', '🍬', '🍭']
    },
    transport: {
        name: '🚗 Транспорт',
        emojis: ['🚗', '🏎️', '🚕', '🚙', '🚌', '🚎', '🏍️', '🛵', '🚲', '✈️', '🚁', '🚂', '🚢']
    },
    sport: {
        name: '⚽ Спорт',
        emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒']
    },
    animals: {
        name: '🐶 Животные',
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷']
    },
    nature: {
        name: '🌸 Природа',
        emojis: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌵', '🌴', '🌳', '🌲', '🍀', '🍁', '🌿']
    },
    emotions: {
        name: '😊 Эмоции',
        emojis: ['😊', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '🥰', '😍', '🤩', '😎']
    },
    sad: {
        name: '😢 Грусть',
        emojis: ['😢', '😭', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😿']
    },
    symbols: {
        name: '🔣 Символы',
        emojis: ['❌', '✅', '❓', '❗', '💯', '🔥', '⚡', '💥', '💫', '💢', '🔄', '♻️', '⭕']
    }
};

interface EmojiPickerProps {
    value: string;
    onChange: (emoji: string) => void;
    label?: string;
}

function EmojiPicker({ value, onChange, label = 'Эмодзи' }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('prizes');
    const [searchQuery, setSearchQuery] = useState('');
    const pickerRef = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Фильтрация эмодзи по поиску
    const getFilteredEmojis = () => {
        if (!searchQuery) {
            return emojiCategories[activeCategory].emojis;
        }

        // Поиск по всем категориям
        const allEmojis: string[] = [];
        Object.values(emojiCategories).forEach(category => {
            allEmojis.push(...category.emojis);
        });

        return allEmojis.filter(emoji => emoji.includes(searchQuery));
    };

    const handleEmojiSelect = (emoji: string) => {
        onChange(emoji);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="emoji-picker-container" ref={pickerRef}>
            <label className="emoji-picker-label">{label}</label>

            <div className="emoji-picker-input" onClick={() => setIsOpen(!isOpen)}>
                <span className="emoji-preview">{value || '➕'}</span>
                <span className="emoji-text">{value ? 'Изменить' : 'Выбрать эмодзи'}</span>
                <span className="emoji-arrow">{isOpen ? '▲' : '▼'}</span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        // @ts-ignore
                        className="emoji-picker-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Поиск */}
                        <div className="emoji-search">
                            <input
                                type="text"
                                placeholder="🔍 Поиск эмодзи..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="emoji-search-input"
                                autoFocus
                            />
                        </div>

                        {!searchQuery && (
                            <>
                                {/* Категории */}
                                <div className="emoji-categories">
                                    {Object.entries(emojiCategories).map(([key, category]) => (
                                        <motion.button
                                            key={key}
                                            // @ts-ignore
                                            className={`emoji-category-btn ${activeCategory === key ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(key)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {category.name.split(' ')[0]}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Название категории */}
                                <div className="emoji-category-title">
                                    {emojiCategories[activeCategory].name}
                                </div>
                            </>
                        )}

                        {searchQuery && (
                            <div className="emoji-category-title">
                                🔍 Результаты поиска
                            </div>
                        )}

                        {/* Сетка эмодзи */}
                        <div className="emoji-grid">
                            {getFilteredEmojis().map((emoji, index) => (
                                <motion.button
                                    key={`${emoji}-${index}`}
                                    // @ts-ignore
                                    className="emoji-item"
                                    onClick={() => handleEmojiSelect(emoji)}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.01 }}
                                >
                                    {emoji}
                                </motion.button>
                            ))}

                            {getFilteredEmojis().length === 0 && (
                                <div className="emoji-not-found">
                                    <p>😕 Ничего не найдено</p>
                                    <button
                                        className="emoji-clear-search"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        Очистить поиск
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Часто используемые */}
                        {!searchQuery && (
                            <div className="emoji-recent">
                                <div className="emoji-recent-title">⚡ Популярные</div>
                                <div className="emoji-recent-grid">
                                    {['🎁', '💎', '🏆', '⭐', '💰', '🎉', '😢', '🔄'].map((emoji) => (
                                        <motion.button
                                            key={emoji}
                                            // @ts-ignore
                                            className="emoji-item"
                                            onClick={() => handleEmojiSelect(emoji)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EmojiPicker;