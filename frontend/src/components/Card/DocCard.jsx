import React, {useContext} from "react";
import styles from "./styles/DocCard.module.css";
import { OnlineEditor } from "../Editor/OnlineEditor";
import { DashboardContext } from "../../context/dashboardContext";
const DocCard = ({ doc }) => {
  const {setIsEditorMode,setCurrentDocument} = useContext(DashboardContext);
  return (
    <div className={styles.doc} style={{ margin: "10px" }}>
      <div className="px-3 pt-3 mb-3">
        <p style={{cursor:"pointer"}} onClick={() => {setCurrentDocument(doc);setIsEditorMode(true)}}>{doc.title}</p>
      </div>
    </div>
  );
};

export default DocCard;
