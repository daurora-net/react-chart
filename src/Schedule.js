import React, { useState } from "react";

function Schedule({ dailySchedule, setDailySchedule }) {
    const [isModalOpen, setIsModalOpen] = useState(null); // null: モーダル非表示, 数字: 表示するタスクのインデックス
    const [newTasks, setNewTasks] = useState([]); // 新しいタスクのリスト

    const allTasks = [
        "",
        "睡眠",
        "仕事",
        "休憩",
        "朝食",
        "昼食",
        "夕食",
        ...newTasks,
        "新規タスク",
    ];

    const updateTask = (index, newValue) => {
        const newSchedule = [...dailySchedule];
        newSchedule[index].task = newValue;
        setDailySchedule(newSchedule);
    };

    const handleKeyDown = (e, index) => {
        if (e.isComposing) {
            return; // IME変換中は何もしない
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const newTaskName = e.target.value;
            if (newTaskName) {
                setNewTasks((prevTasks) => [...prevTasks, newTaskName]);
                updateTask(index, newTaskName);
                setIsModalOpen(null);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(null);
    };

    return (
        <div>
            <ul>
                {dailySchedule.map((item, index) => (
                    <li key={index}>
                        {item.time}
                        <select
                            value={item.task}
                            onChange={(e) => {
                                if (e.target.value === "新規タスク") {
                                    setIsModalOpen(index);
                                } else {
                                    setIsModalOpen(null);
                                    updateTask(index, e.target.value); // この行を条件の中に移動
                                }
                            }}
                        >
                            {allTasks.map((task) => (
                                <option key={task} value={task}>
                                    {task}
                                </option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
            {isModalOpen !== null && (
                <div className="modal" onClick={closeModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            autoFocus
                            placeholder="タスク名を入力"
                            onKeyDown={(e) => handleKeyDown(e, isModalOpen)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;
