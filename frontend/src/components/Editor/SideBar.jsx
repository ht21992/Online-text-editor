import React, { useEffect, useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import dateFormat from "dateformat";
import Card from "../Card/Card";
import styles from "./styles/SideBar.module.css";
import InputMaker from "../InputMaker/InputMaker";
import Image from "../Image/Image";
import Button from "../Button/Button";
import { DashboardContext } from "../../context/dashboardContext";
import {
  fetchVersionsAsync,
  clearVersionsAsync,
} from "../../slices/versionSlice";
import Version from "../Version/Version";
export const SideBar = ({
  title,
  onUpdateTitle,
  isVersion,
  handleShowCurrentVersion,
}) => {
  const username = useSelector((state) => state.auth.user.username);
  const versions = useSelector((state) => state.version.versions);
  const version = useSelector((state) => state.version.version);

  const dispatch = useDispatch();

  const { setIsEditorMode, setCurrentDocument, currentDocument } =
    useContext(DashboardContext);

  const [showTitleInputEle, setShowTitleInputEle] = useState(false);

  useEffect(() => {
    if (Object.keys(currentDocument).length > 0) {
      dispatch(fetchVersionsAsync(currentDocument.id));
    }
  }, []);

  useEffect(() => {

  }, [versions]);

  const handleBackBtn = () => {
    dispatch(clearVersionsAsync());
    setCurrentDocument({});
    setIsEditorMode(false);
  };

  return (
    <>
      <Card classes="card mb-5">
        <ul className="list-group ">
          <li className={styles["list-group-item"]}>Writer: {username}</li>
          <li className={styles["list-group-item"]}>
            Title :
            <InputMaker
              value={title}
              handleChange={(newTitle) => {newTitle.trim().length > 0 && onUpdateTitle(newTitle.trim())} }
              handleDoubleClick={() => setShowTitleInputEle(true)}
              handleBlur={() => setShowTitleInputEle(false)}
              showInputEle={showTitleInputEle}
              styles={{ fontSize: "24px", fontWeight: "bolder" }}
              currentElm="TitleInput"
            />
          </li>
          {isVersion && (
            <li className={styles["list-group-item"]}>
              <b>Version :</b> <small>{version.id}</small>
            </li>
          )}

          {/* isVersion */}

          <li
            className={styles["list-group-item"]}
            style={{
              maxHeight: "400px",
              overflowY: "scroll",
              paddingRight: "10px",
            }}
          >
            <u>Versions</u>
            {versions &&
              versions.map((version, index) => (
                <Version key={index} version={version} />
              ))}
          </li>

          <li className={styles["list-group-item"]}>
            <Button
              title="Back to dashboard"
              type="button"
              variant="dark"
              text = "Go Back"
              onClick={() => handleBackBtn()}
            >
            </Button>
            {isVersion && (
              <Button
              title="Show Current Version"
              type="button"
              classes="mx-2"
              variant="dark"
              text = "Show Current Version"
              onClick={() => handleShowCurrentVersion()}
              >
              </Button>
            )}
          </li>
        </ul>
      </Card>
    </>
  );
};
