// Dashboard.jsx
import React, { Fragment, useState, createContext  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, refreshAccessToken } from "../slices/authSlice";
import dashboardStyle from "./dashboard.module.css";
import { SignUpLoginFormContainer } from "../components/SignUpLoginFormContainer";
import { OnlineEditor } from "../components/Editor/OnlineEditor";
import { Kanban } from "../components/Kanban/Kanban";
import { DashboardContext } from "../context/dashboardContext";

import toast from "react-hot-toast";
export const Dashboard = ({ setBackgroundColor }) => {
  const user = useSelector((state) => state.auth.user);
  const [currentDocument, setCurrentDocument] = useState({});
  const [isEditorMode, setIsEditorMode] = useState(false);



  const dispatch = useDispatch();
  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  if (!Object.keys(user).length) {
    return <SignUpLoginFormContainer setBackgroundColor={setBackgroundColor} />;
  }

  const refreshToken = () =>{
    const storedRefreshToken = localStorage.getItem("refreshToken");

    dispatch(refreshAccessToken(storedRefreshToken))
  }

  return (
    <>
    <DashboardContext.Provider value={{setIsEditorMode,setCurrentDocument,currentDocument}} >
      {isEditorMode ? (
        <OnlineEditor  />
      ) : (
        <div className="container">
          <div className={dashboardStyle["dashboard-container"]}>
            <h2 className={dashboardStyle["dashboard-header"]}>Dashboard</h2>
            <Kanban  />
            <h1 className={dashboardStyle["dashboard-welcome"]}>
              {" "}
              Hello and welcome, {user.username}!. We're thrilled to have you
              here
            </h1>
            <div className="col text-center">
              <button
                className="btn btn-outline-dark mx-2 my-2"
                onClick={(e) => handleLogOut(e)}
              >
                Logout
              </button>
              <button
                className="btn btn-outline-dark mx-2 my-2"
                onClick={() => {refreshToken();setIsEditorMode(true)}}
              >
                New Editor
              </button>
            </div>
          </div>
        </div>
      )}
      </DashboardContext.Provider>
    </>
  );
};
