import axios from "axios";
import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  user: {},
  accessToken: null,
};


export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/token/", { email, password });
      const decodedToken = jwtDecode(response.data.access);

      return {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        user: decodedToken,
      };
    } catch (error) {
      toast.error(error.response.data.detail)
      return rejectWithValue(error.message);
    }
  }
);


export const signUpAsync = ( username, email, password, password2 ) => async (dispatch) => {
  try {


    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ username, email, password, password2});

    const response = await axios.post("/api/users/register/", body,config);

    if (response.status === 201){
      dispatch(loginAsync({email, password}));
    }



  } catch (error) {

    const firstErrorKey = Object.keys(error.response.data)[0];
    const firstErrorValue = error.response.data[firstErrorKey][0];

    toast.error(firstErrorValue)

  }
};





export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/token/refresh/", {
        refresh: refreshToken,
      });

      const decodedToken = jwtDecode(response.data.access);
      return {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        user: decodedToken,
      };
    } catch (error) {
      dispatch(logoutUser());
      return rejectWithValue(error.message);
    }
  }
);


// Slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear tokens from local storage on logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        //  Nothing yet
      })

      .addCase(refreshAccessToken.pending, (state) => {
        //  Nothing yet
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
      });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;