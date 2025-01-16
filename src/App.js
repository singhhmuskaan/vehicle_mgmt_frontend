import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DutyForm from "./components/DutyForm";
import DutyManagement from "./components/DutyManagement";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    {/* Navigation Links */}
                    <nav>
                        <ul>
                            <li>
                                <Link to="/form">Duty Form</Link>
                            </li>
                            <li>
                                <Link to="/duties">Duty Management</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Routes */}
                    <Routes>
                        <Route path="/form" element={<DutyForm />} />
                        <Route path="/duties" element={<DutyManagement />} />
                    </Routes>
                </header>
            </div>
        </Router>
    );
}

export default App;
