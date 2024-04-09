import React, { useEffect, useRef, useState,useContext } from "react";
import { useSelector } from "react-redux";
import dateFormat from "dateformat";
import Card from "../Card/Card";
import styles from "./styles/SideBar.module.css";
import Image from "../Image/Image";
import Button from "../Button/Button";
import { DashboardContext } from "../../context/dashboardContext";
export const SideBar = () => {

  const username = useSelector((state) => state.auth.user.username);
  const {setIsEditorMode,setCurrentDocument, currentDocument} = useContext(DashboardContext);



  return (
    <>
    <Card classes="card mb-5" >
        <ul className="list-group ">
        <li className={styles["list-group-item"]}>
            Writer: {username}

        </li>
        <li className={styles["list-group-item"]}>
          Title : {currentDocument.title ? currentDocument.title : "No Title"}
        </li>

        <li className={styles["list-group-item"]}>
        <button
              className="btn btn-outline-dark mx-2"
              onClick={() => {setCurrentDocument({});setIsEditorMode(false)}}
            >
              Back
            </button>
        </li>
        </ul>
      </Card>
    </>
  )
}
