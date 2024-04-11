import React, { useState, useEffect, Fragment, useContext } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import CustomToolBarPlaceholder from "./CustomToolBarPlaceholder";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  ContentState,
} from "draft-js";
import { DashboardContext } from "../../context/dashboardContext";
import {
  updateDocumentAsync,
  createNewDocumentAsync,
} from "../../slices/documentSlice";
import { fetchVersionsAsync } from "../../slices/versionSlice";
import { toast } from "react-hot-toast";
export const OnlineEditor = ({}) => {
  const dispatch = useDispatch();
  const { currentDocument, setCurrentDocument } = useContext(DashboardContext);

  const user = useSelector((state) => state.auth.user);
  const document = useSelector((state) => state.document.document);
  const version = useSelector((state) => state.version.version);
  const [currentText, setCurrentText] = useState("");
  const [content, setContent] = useState({});
  const [title, setTitle] = useState("No Title");
  const [isVersion, setIsVersion] = useState(false);
  const [changed, setChanged] = useState({ text: "", flag: false });

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(""))
  );

  useEffect(() => {
    if (Object.keys(version).length > 0) {
      // console.log(mergeVersions(version.content,currentDocument.content))
      const parsedVersionContent = JSON.parse(version.content);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parsedVersionContent))
      );
      setIsVersion(true);
    }
  }, [version]);

  useEffect(() => {
    handleShowCurrentVersion();
  }, [currentDocument.content]);

  const handleShowCurrentVersion = () => {
    let content = null;
    if (currentDocument.content) {
      content = currentDocument.content;
    }
    if (document.content) {
      content = document.content;
    }

    if (content) {
      const parsedContent = JSON.parse(content);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parsedContent))
      );
      setTitle(currentDocument.title);
      setIsVersion(false);
      //  If we have a normal text
      // setEditorState(
      //   EditorState.createWithContent(ContentState.createFromText(currentDocument.content))
      // );
    }
  };

  const handleOnBlurEditorCandidate = (e) => {
    if (currentDocument.content) {
      callDocSlice(title, true, true);
    }
  };

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault(); // Save
      callDocSlice(title);
    }
  }

  const callDocSlice = (title, versionCreation = "", silent = false) => {
    const jsonContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    if (currentDocument.id || document.id) {
      // if (!editorState.getCurrentContent().hasText()) return;
      let documentID = currentDocument.id || document.id;
      dispatch(
        updateDocumentAsync(
          documentID,
          title,
          jsonContent,
          user,
          versionCreation,
          silent
        )
      );
      dispatch(fetchVersionsAsync(documentID)); // fetch versions
    } else {
      dispatch(createNewDocumentAsync(title, jsonContent, user));
    }
  };

  const onUpdateTitle = (newTitle) => {
    if (newTitle === title) return;

    setTitle(newTitle);
    callDocSlice(newTitle, true);
  };

  const handleOnSave = () => {
    callDocSlice(title);
  };

  return (
    <Fragment>
      <div
        className="container mt-4 mb-5"
        style={{ width: "100%" }}
        onKeyDown={(e) => handleKeyDown(e)}
      >
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
                        onClick: handleOnSave,
                        classes: "btn fa fa-save",
                        title: "save (Ctr + s)",
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
            <SideBar
              title={title}
              onUpdateTitle={onUpdateTitle}
              isVersion={isVersion}
              handleShowCurrentVersion={handleShowCurrentVersion}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
