import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import {BASE_URL} from "../apiConfig";

const DutyManagement = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekData, setWeekData] = useState([]);
    const [weekRange, setWeekRange] = useState([]);
    const [hoveredDate, setHoveredDate] = useState(null); // State for the hovered date

    // Generate week range from Sunday to Saturday based on the selected date
    const calculateWeekRange = (date) => {
        const startOfWeek = moment(date).startOf("week").toDate(); // Sunday
        const days = Array.from({ length: 7 }, (_, i) =>
            moment(startOfWeek).add(i, "days").format("YYYY-MM-DD")
        );
        setWeekRange(days); // Set the range for display
        return days;
    };

    // Fetch duties for the week from the API
    const fetchDuties = async (weekRange) => {
        try {
            const response = await axios.post(`${BASE_URL}/duties/week`, { weekRange });
            if (response.data) {
                setWeekData(response.data); // Update state with API data
            } else {
                setWeekData([]); // Fallback to empty array if response is unexpected
            }
        } catch (error) {
            console.error("Error fetching duties:", error.message);
            setWeekData([]); // Handle API errors by resetting state
        }
    };

    // Fetch duties whenever the selected date changes
    useEffect(() => {
        const weekRange = calculateWeekRange(selectedDate);
        fetchDuties(weekRange);
    }, [selectedDate]);

    return (
        <div className="duty-management">
            <h2>Vehicle Duty Crew Management</h2>

            {/* Date picker for selecting the week */}
            <div className="date-picker">
                <label>Select Date: </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    highlightDates={weekRange.map((date) => new Date(date))} // Highlight week range
                />
                <p>
                    Selected Week: {moment(weekRange[0]).format("DD MMM YYYY")} -{" "}
                    {moment(weekRange[6]).format("DD MMM YYYY")}
                </p>
            </div>

            {/* Weekly view */}
            <div className="week-view">
                {weekData && weekData.length > 0 ? (
                    weekData.map((dayData, index) => (
                        <div
                            key={index}
                            className={`day-column ${
                                moment(dayData.date).isSame(moment(selectedDate), "day")
                                    ? "selected-day" // Highlight selected day
                                    : ""
                            }`}
                        >
                            <h3>{moment(dayData.date).format("dddd")}</h3>
                            {dayData.duties.map((duty) => (
                                <div
                                    key={duty.id}
                                    className="duty-card"
                                    onMouseEnter={() => setHoveredDate(duty.date)} // Set hovered date
                                    onMouseLeave={() => setHoveredDate(null)} // Clear hovered date
                                >
                                    <p><strong>Vehicle:</strong> {duty.vehicle}</p>
                                    <p><strong>Driver:</strong> {duty.driver}</p>
                                    <p><strong>Conductor:</strong> {duty.conductor}</p>
                                    <p><strong>Start Time:</strong> {duty.startTime}</p>
                                    <p><strong>Duration:</strong> {duty.duration}</p>

                                    {/* Inline label for the duty date */}
                                    {hoveredDate === duty.date && (
                                        <p className="hover-label">Date: {moment(duty.date).format("DD MMM YYYY")}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>Loading duties for the week...</p>
                )}
            </div>
        </div>
    );
};

export default DutyManagement;
