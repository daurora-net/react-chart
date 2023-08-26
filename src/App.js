import "./App.css";
import React, { useState } from "react";
import ChartCircle from "./ChartCircle";
import Schedule from "./Schedule";

function App() {
    const defaultSchedule = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        task: "",
    }));

    const initialSchedule = defaultSchedule.map((item) => {
        switch (item.time) {
            case "0:00":
                return { ...item, task: "睡眠" };
            case "9:00":
                return { ...item, task: "朝食" };
            case "10:00":
                return { ...item, task: "仕事" };
            case "14:00":
                return { ...item, task: "昼食" };
            case "15:00":
                return { ...item, task: "仕事" };
            case "18:00":
                return { ...item, task: "休憩" };
            case "20:00":
                return { ...item, task: "夕食" };
            case "21:00":
                return { ...item, task: "休憩" };
            default:
                return { ...item, task: "" }; // ここで空の文字列をデフォルトとして設定
        }
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
