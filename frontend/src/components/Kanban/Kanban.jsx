import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentsAsync } from "../../slices/documentSlice";
import DocCard from "../Card/DocCard";
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
        <div className="row ml-3 mb-3">
          {documents &&
            documents.map((doc, index) => <DocCard key={index} doc={doc}  />)}
        </div>{" "}
      </>
    )
  );
};
