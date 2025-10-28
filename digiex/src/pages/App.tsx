import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;