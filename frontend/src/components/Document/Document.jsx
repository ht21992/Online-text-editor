import React, { useContext, useState } from "react";
import styles from "./Document.module.css";
import { DashboardContext } from "../../context/dashboardContext";
import dateFormat from "dateformat";
import { useDispatch } from "react-redux";
import { delDocumentAsync } from "../../slices/documentSlice";
import Button from "../Button/Button";
const Document = ({ doc }) => {
  const { setIsEditorMode, setCurrentDocument } = useContext(DashboardContext);
  const dispatch = useDispatch();
  const [readyToDelete, setReadyToDelete] = useState(false);
  const handleDocumentDeletion = () => {
    dispatch(delDocumentAsync(doc.id))
    setReadyToDelete(false)
  };

  return (
    <div className={styles.doc}>
      <div
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          if (["BUTTON", "I"].includes(e.target.tagName)) return;
          setCurrentDocument(doc);
          setIsEditorMode(true);
        }}
        className={styles.cardContent}
      >
        <h3 className={styles.title}>{doc.title}</h3>
        <p className={styles.date}>
          <small>
            <i className="fa fa-calendar mx-1"></i>
            {dateFormat(doc.updated_at, " dddd, mmmm dS, yyyy ")}
            <i className="fa fa-clock mx-1"></i>
            {dateFormat(doc.updated_at, " h:MM:ss TT")}
          </small>
        </p>
        {readyToDelete ? (
          <div className="d-flex align-items-center justify-content-center">
            <div className="row">
              <div>
                <Button
                  title="Go back"
                  type="button"
                  variant="success"
                  text=" "
                  style={{ fontSize: "12px", border: "none" }}
                  iconClass="fa fa-arrow-left"

                  onClick={() => setReadyToDelete(false)}
                />
              </div>{" "}
              <div>
                <Button
                  title="Confirm Deletion"
                  type="button"
                  variant="danger"
                  text=" "
                  style={{ fontSize: "12px", border: "none" }}
                  iconClass="fa fa-check"
                  onClick={() => handleDocumentDeletion()}
                />
              </div>
            </div>
          </div>
        ) : (
          <Button
            title="Delete document"
            type="button"
            variant="danger"
            text=" "
            style={{ fontSize: "12px", border: "none" }}
            iconClass="fa fa-trash"
            onClick={() => setReadyToDelete(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Document;
