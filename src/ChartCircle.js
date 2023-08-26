import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const ChartCircle = ({ dailySchedule }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const taskColors = {
        睡眠: "#ff7293",
        仕事: "#4ECDC4",
        休憩: "#eebd4b",
        朝食: "#8338EC",
        昼食: "#8338EC",
        夕食: "#8338EC",
    };

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
                ) + 10;

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
        const ctx = canvasRef.current.getContext("2d");

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
            backgroundColors.push(taskColors[item.task] || "#CCC");

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
                labels: labels, // ここはタスクの時刻
                datasets: [
                    {
                        label: "Tasks", // データセットのラベル
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1,
                    },
                ],
            },
            plugins: [ChartDataLabels, externalNumberPlugin],
            options: {
                cutout: "0%", // この行を追加
                layout: {
                    padding: {
                        top: 50,
                        bottom: 50,
                        left: 50,
                        right: 50,
                    },
                },
                plugins: {
                    legend: {
                        display: false, // レジェンドを非表示にする
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
            },
        });
    }, [dailySchedule]);

    return <canvas ref={canvasRef} id="schedule-canvas"></canvas>;
};

export default ChartCircle;
