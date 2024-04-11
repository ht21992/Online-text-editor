import React, {useEffect} from "react";
import dateFormat from "dateformat";
import { fetchSingleVersionAsync } from "../../slices/versionSlice";
import { useDispatch } from "react-redux";
import styles from "./Version.module.css";
const Version = ({ version }) => {

  const dispatch = useDispatch();

  const onVersionClicked = () => {
    dispatch(fetchSingleVersionAsync({id:version.id}))
  }

  return (
    <div className={styles.versionContainer} onClick= {() => onVersionClicked()}>
      <small className={styles.versionText} >Backup Version {version.id}</small>
      <br />
      <small  className={styles.versionDate}>
        <i className="fa fa-calendar mx-1"></i>
        {dateFormat(version.created_at, " dddd, mmmm dS, yyyy ")}
        <i className="fa fa-clock mx-1"></i>
        {dateFormat(version.created_at, " h:MM:ss TT")}
      </small>
    </div>
  );
};

export default Version;
