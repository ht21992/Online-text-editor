// versionSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
const versionInitialState = {
  versions: [],
  version: {},
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

export const fetchVersionsAsync = createAsyncThunk(
  "version/fetchVersions",
  async (doc_id, filter = "") => {
    const config = getConfig();
    const response = await axios.get(
      // `/api/documents/get_versions?doc_id=${doc_id}&filter=${filter}`,
      `/api/documents/versions/?doc_id=${doc_id}`,
      config
    );
    return response.data;
  }
);

export const fetchSingleVersionAsync = createAsyncThunk(
  "version/fetchSingleVersion",
  async (versionObj) => {
    const config = getConfig();
    const response = await axios.get(
      // `/api/documents/get_versions?version_id=${versionObj["id"]}`,
      `/api/documents/versions/${versionObj["id"]}`,
      config
    );

    return response.data;
  }
);

export const delVersionAsync = (id) => async (dispatch) => {
  const config = getConfig();
  try {
    const response = await axios.delete(
      `/api/documents/versions/${id}`,
      config
    );
    dispatch(deleteVersion({ id: id }));
  } catch (err) {
    toast.error(`Error While Deleting a version - ${err.message}`);
  }
};

export const clearVersionsAsync = () => async (dispatch) => {
  try {
    dispatch(clearVersions());
  } catch (err) {
    toast.error(`Error While Clearing Versions - ${err.message}`);
  }
};

const VersionSlice = createSlice({
  name: "version",
  initialState: versionInitialState,

  reducers: {
    deleteVersion: (state, action) => {
      const versionsListArr = state.versions;
      versionsListArr.splice(
        versionsListArr.findIndex(({ id }) => id == action.payload.id),
        1
      );
    },
    clearVersions: (state) => {
      state.versions = [];
      state.version = {};
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchVersionsAsync.pending, (state, action) => {
      state.loading = true;
      state.version = "";
    });
    builder.addCase(fetchVersionsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.versions = action.payload;
    });
    builder.addCase(fetchVersionsAsync.rejected, (state, action) => {
      state.loading = false;
      state.versions = [];
    });

    builder.addCase(fetchSingleVersionAsync.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleVersionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.version = action.payload;
    });
    builder.addCase(fetchSingleVersionAsync.rejected, (state, action) => {
      state.loading = false;
      state.version = {};
    });
  },
});

export const { deleteVersion, clearVersions } = VersionSlice.actions;
export default VersionSlice.reducer;
