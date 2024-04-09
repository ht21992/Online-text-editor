import React, { useState, useEffect, Fragment, useContext } from "react";
import { Editor } from "react-draft-wysiwyg";
import dateFormat from "dateformat";
import Button from "../Button/Button";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getClasses } from "../../utils/getClasses";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card/Card";
import { CardBody } from "../Card/partials/CardPartials";
import Image from "../Image/Image";
import OnlineEditorStyles from "./styles/OnlineEditor.module.css";
import classNames from "classnames";
import CustomToolBarPlaceholder from "./CustomToolBarPlaceholder";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  ContentState,
} from "draft-js";
import toast from "react-hot-toast";

import axios from "axios";
import { DashboardContext } from "../../context/dashboardContext";
import { updateDocumentAsync, createNewDocumentAsync } from "../../slices/documentSlice";
export const OnlineEditor = ({}) => {
  const dispatch = useDispatch()
  const {currentDocument} = useContext(DashboardContext);

  const user = useSelector((state) => state.auth.user);
  const [currentText, setCurrentText] = useState("");
  const [content, setContent] = useState({});
  const [changed, setChanged] = useState({ text: "", flag: false });

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(""))
  );


  useEffect(() => {
    if (currentDocument.content) {
      const parsedContent = JSON.parse(currentDocument.content);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parsedContent))
      );
      // setEditorState(
      //   EditorState.createWithContent(ContentState.createFromText(currentDocument.content))
      // );

    }

  },[currentDocument.content])

  const handleOnBlurEditorCandidate = (e) => {
    console.log("on Blur handle ....");
  };

  const handleOnDraft = () => {

    const jsonContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    if (currentDocument.content) {
      let documentID = currentDocument.id;
      let title = currentDocument.title;
      dispatch(updateDocumentAsync(documentID,
        title,
        jsonContent,
        user))
    }
    else{
      dispatch(createNewDocumentAsync("fake title",jsonContent,user))
    }

  };

  return (
    <Fragment>
      <div className="container mt-4 mb-5" style={{ width: "100%" }}>
        <div className="row align-items start">
          <div className="col-lg-8 ">
            <article>
              <Editor
                editorStyle={{ minHeight: "800px" }}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontFamily",
                    "fontSize",
                    "list",
                    "textAlign",
                    "colorPicker",
                    "history",
                  ],
                  inline: {
                    options: [
                      "bold",
                      "italic",
                      "underline",
                      "superscript",
                      "subscript",
                    ],
                  },
                  blockType: {
                    inDropdown: true,
                    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                  },

                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                }}
                toolbarCustomButtons={[
                  <CustomToolBarPlaceholder
                    icons={[
                      {
                        onClick: handleOnDraft,
                        classes: "btn fa fa-save",
                        title: "save draft",
                      },
                    ]}
                  />,
                ]}
                editorState={editorState}
                onFocus={(e) => {
                  if (!changed.flag) {
                    setCurrentText(
                      editorState.getCurrentContent().getPlainText()
                    );
                  }
                }}
                onEditorStateChange={(e) => {
                  setEditorState(e);
                  setContent(convertToRaw(editorState.getCurrentContent()));

                  if (
                    !changed.flag &&
                    currentText !== "" &&
                    currentText !==
                      editorState.getCurrentContent().getPlainText()
                  ) {
                    setChanged({ text: currentText, flag: true });
                  }
                  if (
                    editorState.getCurrentContent().getPlainText() ===
                    changed.text
                  ) {
                    setChanged({ text: "", flag: false });
                  }

                  //   setCurrentText(
                  //     editorState.getCurrentContent().getPlainText()
                  //   );

                  //   if (
                  //     !changed.flag &&
                  //     currentText !== "" &&
                  //   currentText !==
                  //     editorState.getCurrentContent().getPlainText();
                  //   ) {
                  //     setChanged({ text: currentText, flag: true });
                  //   }
                  //   if (
                  //     editorState.getCurrentContent().getPlainText() ===
                  //     changed.text
                  //   ) {
                  //     setChanged({ text: "", flag: false });
                  //   }

                  setCurrentText(
                    editorState.getCurrentContent().getPlainText()
                  );
                }}
                onBlur={(e) => {
                  handleOnBlurEditorCandidate(e);
                }}
                toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto !border-0 !border-b-2 !border-[#ccc] shadow-md"
                editorClassName="mt-6 bg-white p-5 shadow-lg min-h-[1300px] max-w-5xl mx-auto mb-12 border-2 rounded-sm border-gray-300"
              />
            </article>
          </div>
          <div className="col-lg-4">
            <SideBar/>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
