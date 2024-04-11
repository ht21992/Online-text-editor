import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentsAsync } from "../../slices/documentSlice";
import Document from "../Document/Document";
export const Kanban = () => {
  const dispatch = useDispatch();
  const documents = useSelector((state) => state.document.documents);

  useEffect(() => {
    dispatch(fetchDocumentsAsync());
  }, []);

  return (
    documents.length > 0 && (
      <>
        {" "}
        <div className="row ml-3 mb-3" style={{maxHeight:"400px", overflowY:"scroll", paddingRight:"10px"}}>
          {documents &&
            documents.map((doc, index) => <Document key={index} doc={doc}  />)}
        </div>{" "}
      </>
    )
  );
};
