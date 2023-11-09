import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SideBar from "./components/Sidebar";
import sidebar_menu from "./constants/sidebar-menu";

import "./App.css";
import Teachers from "./pages/Teachers";
import Student from "./pages/Student";
import Subject from "./pages/Subject";
import Login from "./pages/Login";
import Class from "./pages/Class";
import Major from "./pages/Major";
import Issue from "./pages/Issue";

function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />

        <div className="dashboard-body">
          <Routes>
            <Route path="*" element={<div></div>} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/student" element={<Student />} />
            <Route exact path="/teacher" element={<Teachers />} />
            <Route exact path="/subject" element={<Subject />} />
            <Route exact path="/class/:subjectId" element={<Class />} />
            <Route exact path="/major" element={<Major />} />
            <Route exact path="/issue" element={<Issue />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
