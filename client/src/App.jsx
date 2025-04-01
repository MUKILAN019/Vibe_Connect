import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/signup.jsx";
import SignIn from "./pages/auth/signin.jsx";
import Home from "./pages/home.jsx";
import {ProtectedRoute,AuthRoute} from "./utils/ProtectedRoute"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AuthRoute><SignIn /></AuthRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
