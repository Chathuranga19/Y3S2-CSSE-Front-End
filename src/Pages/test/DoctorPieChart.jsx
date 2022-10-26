import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip, Legend
} from "recharts";

import { PieChart, Pie, Cell } from "recharts";
import ServiceManagement from '../../Axios/DoctorsManagement'
import moment from 'moment'

export default function DoctorPieChart() {
    const [piechartData, setpiechartData] = useState([]);

    useEffect(() => {
        ServiceManagement.getCuredPatients().then(res => {

            let filterByDoctor = res.data.slice();
            let data = JSON.parse(sessionStorage.getItem("userLoginStorage"))
            filterByDoctor = filterByDoctor.filter(item => item.doctor_id == data.email);

            let overMonth = 0;
            let withinMonth = 0;
            let total = 0;
            for (let i = 0; i < filterByDoctor.length; i++) {
                let startDate = new Date(convertDates(filterByDoctor[i].first_appointment_date));
                let endDate = new Date(convertDates(filterByDoctor[i].cured_date));
                let calRange = (endDate.getTime() - startDate.getTime()) / 86400000
                if (calRange > 30) {
                    overMonth = overMonth + 1;
                    total = total + 1;
                }
                else if (calRange < 30) {
                    withinMonth = withinMonth + 1;
                    total = total + 1;
                }
            }

            function returnData(type) {
                if (type == 'within') {
                    return parseFloat((withinMonth / total * 100).toFixed(2));
                }
                else return parseFloat((overMonth / total * 100).toFixed(2));
            }

            const retrievedData = [
                { name: "With in a Month", value: returnData('within') },
                { name: "More than Month", value: returnData() },
            ];
            console.log('dataPrecentage',retrievedData)

            setpiechartData(retrievedData);
        })
    }, [])





    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
                </div>
            )

        }
        return null
    }

        //date conversion
        function convertDates(date) {
            if (!date) {
                return '';
            }
            else {
                return moment(date).format('YYYY/MM/DD');
            }
        }
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
            return (
                <text
                    x={x}
                    y={y}
                    fill="black"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            )
        }
        const RADIAN = Math.PI / 180;

    return (
        <>
            {
                 <PieChart width={400} height={322}>
                    <Pie
                        data={piechartData}
                        color="#000000"
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                    >
                        {piechartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            }

        </>
    )
}
