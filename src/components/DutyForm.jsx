import { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import {BASE_URL} from "../apiConfig";

const DutyForm = () => {
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        vehicleId: "",
        duration: "",
        driverId: "",
        conductorId: "",
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);

    const [vehicles, setVehicles] = useState([]);
    const [crew, setCrew] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [conductors, setConductors] = useState([]);

    // Fetch vehicle and crew data
    useEffect(() => {
        const fetchVehicleAndCrew = async () => {
            try {
                const vehicleResponse = await axios.get(`${BASE_URL}/vehicles`);
                setVehicles(vehicleResponse.data);

                const crewResponse = await axios.get(`${BASE_URL}/crew`);
                setCrew(crewResponse.data);

                // Separate crew by roles
                const driverList = crewResponse.data.filter((member) => member.role === "Driver");
                const conductorList = crewResponse.data.filter((member) => member.role === "Conductor");

                setDrivers(driverList);
                setConductors(conductorList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchVehicleAndCrew();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.startTime) newErrors.startTime = "Start time is required";
        if (!formData.vehicleId) newErrors.vehicleId = "Vehicle ID is required";
        if (!formData.duration) newErrors.duration = "Duration is required";
        if (!formData.driverId) newErrors.driverId = "Driver ID is required";
        if (!formData.conductorId) newErrors.conductorId = "Conductor ID is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post(`${BASE_URL}/duties`, formData);
            setSuccess("Duty successfully added!");
            setErrors({});
            setFormData({
                date: "",
                startTime: "",
                vehicleId: "",
                duration: "",
                driverId: "",
                conductorId: "",
            });
        } catch (error) {
            setSuccess(null);
            if (error.response && error.response.data.message) {
                setErrors({ apiError: error.response.data.message });
            } else {
                setErrors({ apiError: "An error occurred. Please try again." });
            }
        }
    };

    return (
        <>
            <h2>Duty Form</h2>
            {success && <Alert variant="success">{success}</Alert>}
            {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group" controlId="formBasicDate">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group" controlId="formBasicStartTime">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        isInvalid={!!errors.startTime}
                    />
                    <Form.Control.Feedback type="invalid">{errors.startTime}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group" controlId="formBasicVehicle">
                    <Form.Label>Vehicle</Form.Label>
                    <Form.Control
                        as="select"
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleInputChange}
                        isInvalid={!!errors.vehicleId}
                    >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle._id} value={vehicle._id}>
                                {vehicle.name || vehicle._id}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.vehicleId}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group" controlId="formBasicDuration">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="Enter duration (in hours)"
                        isInvalid={!!errors.duration}
                    />
                    <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group" controlId="formBasicDriver">
                    <Form.Label>Driver</Form.Label>
                    <Form.Control
                        as="select"
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleInputChange}
                        isInvalid={!!errors.driverId}
                    >
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                                {driver.name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.driverId}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group" controlId="formBasicConductor">
                    <Form.Label>Conductor</Form.Label>
                    <Form.Control
                        as="select"
                        name="conductorId"
                        value={formData.conductorId}
                        onChange={handleInputChange}
                        isInvalid={!!errors.conductorId}
                    >
                        <option value="">Select a conductor</option>
                        {conductors.map((conductor) => (
                            <option key={conductor._id} value={conductor._id}>
                                {conductor.name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.conductorId}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default DutyForm;
