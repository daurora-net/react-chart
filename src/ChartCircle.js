import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const ChartCircle = ({ dailySchedule }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][
        today.getDay()
    ];
    const textToDisplayArray = [
        `${month}/${date}（${dayOfWeekStr}）のスケジュール`,
        ``,
    ];

    const taskColors = {
        仕事: "#ff7293",
        睡眠: "#4ECDC4",
        朝食: "#eebd4b",
        昼食: "#eebd4b",
        夕食: "#eebd4b",
        休憩: "#8338EC",
    };

    function handleExportAsImage() {
        const canvas = document.getElementById("schedule-canvas");
        canvas.toBlob((blob) => {
            const newWindow = window.open();
            const objectURL = URL.createObjectURL(blob);
            newWindow.document.write(
                '<img src="' +
                    objectURL +
                    '" style="height: 70vh;display: block;margin: 8vh auto;width: 700px;max-width: 90%;height: auto;">'
            );
        }, "image/png");
    }

    const externalNumberPlugin = {
        id: "externalNumbers",
        afterDraw(chart) {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const radius =
                Math.max(
                    chartArea.right - centerX,
                    chartArea.bottom - centerY
                ) + 0;

            for (let i = 0; i < 24; i++) {
                const angle = (-0.5 + (2 / 24) * i) * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#7d7d7d";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText(String(i).padStart(2, "0"), x, y);
            }
        },
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // 既存のグラフが存在する場合は破棄
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = [];
        const taskLabels = [];
        const data = [];
        const backgroundColors = [];

        for (let i = 0; i < dailySchedule.length; i++) {
            const item = dailySchedule[i];

            if (!item.task) continue;

            labels.push(item.time);
            taskLabels.push(item.task);
            backgroundColors.push(taskColors[item.task] || "#b3a39a");

            let nextTime = 24;
            for (let j = i + 1; j < dailySchedule.length; j++) {
                if (dailySchedule[j].task) {
                    nextTime = parseInt(dailySchedule[j].time.split(":")[0]);
                    break;
                }
            }

            const currentTime = parseInt(item.time.split(":")[0]);
            const duration = (nextTime - currentTime + 24) % 24;

            data.push(duration);
        }

        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Tasks",
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1,
                    },
                ],
            },
            plugins: [ChartDataLabels, externalNumberPlugin],
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: textToDisplayArray,
                        font: {
                            size: 22,
                        },
                        position: "top",
                        padding: {
                            top: 20,
                            bottom: 10,
                        },
                    },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                    datalabels: {
                        formatter: function (value, context) {
                            return taskLabels[context.dataIndex];
                        },
                        color: "#fff",
                        font: {
                            size: 14,
                            weight: 900,
                        },
                        anchor: "end",
                        align: "start",
                        offset: 50,
                    },
                },
                cutout: "0%",
                layout: {
                    padding: {
                        top: 10,
                        bottom: 35,
                        left: 50,
                        right: 50,
                    },
                },
            },
        });
        // const fontSize = 20; // フォントサイズを適切に設定
        // ctx.font = `${fontSize}px Arial`;
        // ctx.textAlign = "top";
        // ctx.fillStyle = "#000";
        // ctx.fillText(textToDisplay, canvas.width / 2, fontSize + 10);
    }, [dailySchedule]);

    return (
        <div>
            <canvas ref={canvasRef} id="schedule-canvas"></canvas>
            <button onClick={handleExportAsImage} className="export-btn">
                画像としてエクスポート
            </button>
        </div>
    );
};

export default ChartCircle;
