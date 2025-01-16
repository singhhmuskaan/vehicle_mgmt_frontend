import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const DutyManagement = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekData, setWeekData] = useState([]);

    // Generate week range from Sunday to Saturday based on selected date
    const getWeekRange = (date) => {
        const startOfWeek = moment(date).startOf("week").toDate(); // Sunday
        const days = Array.from({ length: 7 }, (_, i) =>
            moment(startOfWeek).add(i, "days").format("YYYY-MM-DD")
        );
        return days;
    };

    // Fetch duties from the API
    const fetchDuties = async (weekRange) => {
        try {
            const response = await axios.post("http://localhost:5000/api/duties/week", { weekRange });
            setWeekData(response.data); // Assuming API returns data in the required format
        } catch (error) {
            console.error("Error fetching duties:", error.message);
        }
    };

    // Fetch data whenever the selected date changes
    useEffect(() => {
        const weekRange = getWeekRange(selectedDate);
        fetchDuties(weekRange);
    }, [selectedDate]);

    return (
        <div className="duty-management">
            <h2>Vehicle Duty Crew Management</h2>
            <div className="date-picker">
                <label>Select Date: </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div className="week-view">
                {weekData.map((dayData, index) => (
                    <div key={index} className="day-column">
                        <h3>{moment(dayData.date).format("dddd")}</h3>
                        {dayData.duties.map((duty) => (
                            <div
                                key={duty.id}
                                className="duty-card"
                                title={`Duty Date: ${dayData.date}`}
                            >
                                <p><strong>Vehicle:</strong> {duty.vehicle}</p>
                                <p><strong>Driver:</strong> {duty.driver}</p>
                                <p><strong>Conductor:</strong> {duty.conductor}</p>
                                <p><strong>Start Time:</strong> {duty.startTime}</p>
                                <p><strong>Duration:</strong> {duty.duration}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DutyManagement;
