// documentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
const documentInitialState = {
  documents: [],
  document: {},
  loading: false,
};

function getConfig() {
  const storedAccessToken = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedAccessToken}`,
    },
  };
  return config;
}

export const fetchDocumentsAsync = createAsyncThunk(
  "document/fetchDocuments",
  async (filter = "") => {
    const config = getConfig();
    const response = await axios.get(`/api/documents/docs?${filter}`, config);
    return response.data;
  }
);

export const fetchSingleDocumentAsync = createAsyncThunk(
  "document/fetchSingleDocument",
  async (docObj) => {
    const config = getConfig();
    const response = await axios.get(
      `/api/documents/docs/${docObj["id"]}`,
      config
    );

    return response.data;
  }
);

export const createNewDocumentAsync =
  (title, content, owner) => async (dispatch) => {
    const config = getConfig();
    const body = JSON.stringify({
      title: title,
      content: content,
      owner: owner.user_id,
    });

    try {
      const res = await axios.post("/api/documents/docs/", body, config);
      dispatch(addDocument(res.data));
      toast.success("document has been created");
    } catch (err) {

      toast.error(`Error While Creating a document - ${err.message}`);
    }
  };

export const updateDocumentAsync = (id,title,content,owner,versionCreation="",silent=false) => async (dispatch) => {
  const config = getConfig();

  const body = JSON.stringify({
    content: content,
    title: title,
    owner: owner.user_id,
    versionCreation:versionCreation
  });


  try {
    const response = await axios.put(
      `/api/documents/docs/${id}/`,
      body,
      config
    );


    dispatch(updateDocument(response.data));
    if (!silent){
      if (versionCreation === ""){

        toast.success("document has been saved");
      }
      else{
        toast.success("title updated");
      }

    }


  } catch (err) {

    toast.error(`Error While Updating a document - ${err.message}`);
  }
};

export const delDocumentAsync = (id) => async (dispatch) => {
  const config = getConfig();
  try {
    const response = await axios.delete(`/api/documents/docs/${id}`, config);
    dispatch(deleteDocument({ id: id }));
  } catch (err) {
    toast.error(`Error While Deleting a document - ${err.message}`);
  }
};

const DocumentSlice = createSlice({
  name: "document",
  initialState: documentInitialState,

  reducers: {
    addDocument: (state, action) => {
      state.documents.unshift(action.payload);
      const documentsListArr = state.documents;
      state.documents = [...documentsListArr];
      state.document = action.payload
    },
    deleteDocument: (state, action) => {
      const documentsListArr = state.documents;
      documentsListArr.splice(
        documentsListArr.findIndex(({ id }) => id == action.payload.id),
        1
      );
    },
    updateDocument: (state, action) => {
      const documentsListArr = state.documents;
      documentsListArr.forEach((document, index) => {
        if (document.id === action.payload.id) {
          document.content = action.payload.content;
          document.title = action.payload.title;
          state.document = document;
        }
        state.documents = [...documentsListArr];
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDocumentsAsync.pending, (state, action) => {
      state.loading = true;
      state.document = "";
    });
    builder.addCase(fetchDocumentsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.documents = action.payload;
    });
    builder.addCase(fetchDocumentsAsync.rejected, (state, action) => {
      state.loading = false;
      state.documents = [];
    });

    builder.addCase(fetchSingleDocumentAsync.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleDocumentAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.document = action.payload;
    });
    builder.addCase(fetchSingleDocumentAsync.rejected, (state, action) => {
      state.loading = false;
      state.document = {};
    });
  },
});

export const { addDocument, deleteDocument, updateDocument } =
  DocumentSlice.actions;
export default DocumentSlice.reducer;
