import "./App.css";
import React, { useState } from "react";
import ChartCircle from "./ChartCircle";
import Schedule from "./Schedule";

function App() {
    const defaultSchedule = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        task: "",
    }));

    const defaultTasks = {
        "0:00": "睡眠",
        "9:00": "朝食",
        "10:00": "仕事",
        "14:00": "昼食",
        "15:00": "仕事",
        "18:00": "休憩",
        "20:00": "夕食",
        "21:00": "休憩",
    };

    const initialSchedule = defaultSchedule.map((item) => {
        return { ...item, task: defaultTasks[item.time] || "" };
    });

    const [dailySchedule, setDailySchedule] = useState(initialSchedule);

    return (
        <div className="App">
            <div className="App-main">
                <div className="ChartCircle">
                    <ChartCircle dailySchedule={dailySchedule} />
                </div>
                <div className="Schedule">
                    <Schedule
                        dailySchedule={dailySchedule}
                        setDailySchedule={setDailySchedule}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
