// Dashboard.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, refreshAccessToken } from "../slices/authSlice";
import dashboardStyle from "./dashboard.module.css";
import { SignUpLoginFormContainer } from "../components/SignUpLoginFormContainer";
import { OnlineEditor } from "../components/Editor/OnlineEditor";
import { Kanban } from "../components/Kanban/Kanban";
import { DashboardContext } from "../context/dashboardContext";
import Button from "../components/Button/Button";
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

  const refreshToken = () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    dispatch(refreshAccessToken(storedRefreshToken));
  };

  return (
    <>
      <DashboardContext.Provider
        value={{ setIsEditorMode, setCurrentDocument, currentDocument }}
      >
        {isEditorMode ? (
          <OnlineEditor />
        ) : (
          <div className="container">
            <div className={dashboardStyle["dashboard-container"]}>
              <h2 className={dashboardStyle["dashboard-header"]}>Dashboard</h2>
              <h1 className={dashboardStyle["dashboard-welcome"]}>
                {" "}
                Hello and welcome, {user.username}!. We're thrilled to have you
                here
              </h1>
              <Kanban />

              <div className="col text-center">

                <Button
                  title="Logout"
                  type="button"
                  classes="mx-2 my-2"
                  variant="danger"
                  text="Logout"
                  onClick={(e) => handleLogOut(e)}
                />

                <Button
                  title="New Editor"
                  type="button"
                  variant="primary"
                  text="New Editor"
                  classes="mx-2 my-2"
                  iconClass="fa fa-plus"
                  onClick={() => {
                    refreshToken();
                    setIsEditorMode(true);
                  }}
                />

              </div>
            </div>
          </div>
        )}
      </DashboardContext.Provider>
    </>
  );
};
