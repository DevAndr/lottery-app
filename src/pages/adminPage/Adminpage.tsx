import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import {type Prize, useLotteryStore} from "../../store/Lotterystore.ts";
import EmojiPicker from "../../components/emoji/Emojipicker.tsx";
import * as React from "react";

const donateValues = [100, 200, 500, 1000, 2000];

function AdminPage() {
    const {
        prizes,
        cellLots,
        addPrize,
        updatePrize,
        deletePrize,
        setCellLot,
        getCellLot,
        clearAllLots,
        randomizeAllLots,
    } = useLotteryStore();

    const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
    const [newPrize, setNewPrize] = useState({
        name: '',
        value: '',
        color: '#ff6b6b',
    });
    const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

    // Добавить новый приз
    const handleAddPrize = () => {
        if (!newPrize.name || !newPrize.value) {
            alert('Заполните название и эмодзи приза!');
            return;
        }

        const maxId = prizes.length > 0 ? Math.max(...prizes.map((p) => p.id)) : 0;
        addPrize({
            id: maxId + 1,
            ...newPrize,
        });

        setNewPrize({ name: '', value: '', color: '#ff6b6b' });
    };

    // Обновить приз
    const handleUpdatePrize = () => {
        if (!editingPrize) return;
        updatePrize(editingPrize.id, editingPrize);
        setEditingPrize(null);
    };

    // Удалить приз
    const handleDeletePrize = (id: number) => {
        if (confirm('Удалить этот приз?')) {
            deletePrize(id);
        }
    };

    // Назначить приз ячейке
    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (selectedPrize) {
            setCellLot(rowIndex, colIndex, selectedPrize);
        } else {
            // Если приз не выбран, удаляем назначение
            setCellLot(rowIndex, colIndex, null);
        }
    };

    // Очистить все назначения
    const handleClearAll = () => {
        if (confirm('Очистить все назначения призов?')) {
            clearAllLots();
        }
    };

    // Случайное заполнение
    const handleRandomize = () => {
        if (confirm('Заполнить все ячейки случайными призами?')) {
            randomizeAllLots();
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>⚙️ Администрирование лотереи</h1>
                <Link to="/">
                    <motion.button
                        // @ts-ignore
                        className="back-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        🏠 Вернуться к лотерее
                    </motion.button>
                </Link>
            </div>

            <div className="admin-content">
                {/* Секция управления призами */}
                <div className="prizes-section">
                    <h2>🎁 Управление призами</h2>

                    {/* Добавление нового приза */}
                    <div className="add-prize-form">
                        <h3>Добавить новый приз</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Название приза"
                                value={newPrize.name}
                                onChange={(e) =>
                                    setNewPrize({ ...newPrize, name: e.target.value })
                                }
                            />

                            <EmojiPicker
                                value={newPrize.value}
                                onChange={(emoji) =>
                                    setNewPrize({ ...newPrize, value: emoji })
                                }
                            />

                            <input
                                type="color"
                                value={newPrize.color}
                                onChange={(e) =>
                                    setNewPrize({ ...newPrize, color: e.target.value })
                                }
                            />
                            <button onClick={handleAddPrize} className="add-button">
                                ➕ Добавить
                            </button>
                        </div>
                    </div>

                    {/* Список призов */}
                    <div className="prizes-list">
                        <h3>Список призов ({prizes.length})</h3>
                        {prizes.map((prize) => (
                            <motion.div
                                key={prize.id}
                                // @ts-ignore
                                className={`prize-item ${
                                    selectedPrize?.id === prize.id ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedPrize(prize)}
                                whileHover={{ scale: 1.02 }}
                                style={{ borderLeft: `4px solid ${prize.color}` }}
                            >
                                <div className="prize-info">
                                    <span className="prize-emoji">{prize.value}</span>
                                    <span className="prize-name">{prize.name}</span>
                                    <span
                                        className="prize-color"
                                        style={{ backgroundColor: prize.color }}
                                    />
                                </div>
                                <div className="prize-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingPrize({ ...prize });
                                        }}
                                        className="edit-button"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePrize(prize.id);
                                        }}
                                        className="delete-button"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {selectedPrize && (
                        <div className="selected-prize-info">
                            <p>
                                ✅ Выбран приз: <strong>{selectedPrize.name}</strong>{' '}
                                {selectedPrize.value}
                            </p>
                            <button onClick={() => setSelectedPrize(null)}>
                                ❌ Отменить выбор
                            </button>
                        </div>
                    )}
                </div>

                {/* Секция назначения призов ячейкам */}
                <div className="cells-section">
                    <h2>🎯 Назначение призов ячейкам</h2>
                    <p className="instruction">
                        {selectedPrize
                            ? `Кликните на ячейку, чтобы назначить приз "${selectedPrize.name}"`
                            : 'Выберите приз слева, затем кликайте на ячейки для назначения'}
                    </p>

                    <div className="cells-actions">
                        <button onClick={handleRandomize} className="randomize-button">
                            🎲 Заполнить случайно
                        </button>
                        <button onClick={handleClearAll} className="clear-button">
                            🗑️ Очистить все
                        </button>
                    </div>

                    <div className="lottery-grid-admin">
                        {donateValues.map((value, rowIndex) => (
                            <div key={rowIndex} className="lottery-row-admin">
                                <div className="donate-label-admin">
                                    Донат
                                    <br />
                                    {value}
                                </div>

                                {[...Array(6)].map((_, colIndex) => {
                                    const assignedPrize = getCellLot(rowIndex, colIndex);

                                    return (
                                        <motion.div
                                            key={colIndex}
                                            // @ts-ignore
                                            className={`lottery-cell-admin ${
                                                assignedPrize ? 'assigned' : ''
                                            }`}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                backgroundColor: assignedPrize
                                                    ? assignedPrize.color
                                                    : undefined,
                                            }}
                                        >
                                            {assignedPrize ? (
                                                <div className="assigned-prize">
                                                    <div className="assigned-emoji">
                                                        {assignedPrize.value}
                                                    </div>
                                                    <div className="assigned-name">
                                                        {assignedPrize.name}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="empty-cell">{value}</div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="stats">
                        <p>
                            Назначено призов:{' '}
                            {Object.keys(cellLots).length} / 30
                        </p>
                    </div>
                </div>
            </div>

            {/* Модалка редактирования приза */}
            {editingPrize && (
                <div className="modal-overlay-admin" onClick={() => setEditingPrize(null)}>
                    <motion.div
                        // @ts-ignore
                        className="modal-content-admin"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h3>Редактировать приз</h3>
                        <div className="edit-form">
                            <label>
                                Название:
                                <input
                                    type="text"
                                    value={editingPrize.name}
                                    onChange={(e) =>
                                        setEditingPrize({ ...editingPrize, name: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Эмодзи:
                                <input
                                    type="text"
                                    value={editingPrize.value}
                                    onChange={(e) =>
                                        setEditingPrize({ ...editingPrize, value: e.target.value })
                                    }
                                    maxLength={2}
                                />
                            </label>
                            <label>
                                Цвет:
                                <input
                                    type="color"
                                    value={editingPrize.color}
                                    onChange={(e) =>
                                        setEditingPrize({ ...editingPrize, color: e.target.value })
                                    }
                                />
                            </label>
                            <div className="modal-buttons">
                                <button onClick={handleUpdatePrize} className="save-button">
                                    💾 Сохранить
                                </button>
                                <button
                                    onClick={() => setEditingPrize(null)}
                                    className="cancel-button"
                                >
                                    ❌ Отмена
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;