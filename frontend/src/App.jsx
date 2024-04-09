import React, { useState, useEffect, Fragment } from "react";
import "./styles/index.css";
import Shape from "./components/Shape";
import { Toaster } from "react-hot-toast";
import { SignUpLoginFormContainer } from "./components/SignUpLoginFormContainer";
import { useSelector, useDispatch } from "react-redux";
import { Dashboard } from "./pages/Dashboard";
import { refreshAccessToken } from "./slices/authSlice";
export const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const [backgroundColor, setBackgroundColor] = useState("#5B5EA6");
  const dispatch = useDispatch();

  const numberOfShapes = 20;

  const shapes = Array.from({ length: numberOfShapes }, (_, index) => (
    <Shape key={index} />
  ));

  useEffect(() => {
    const refreshAccessTokenIfNeeded = async () => {
      if (!isAuthenticated && storedRefreshToken) {
        try {
          await dispatch(refreshAccessToken(storedRefreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    };
    refreshAccessTokenIfNeeded();
  }, [dispatch, isAuthenticated, storedRefreshToken]);

  const AuthFragment = (
    <Fragment>
      <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        <Dashboard setBackgroundColor={setBackgroundColor} />
      </div>
    </Fragment>
  );


  const AnonymousFragment = (
    <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        <SignUpLoginFormContainer setBackgroundColor={setBackgroundColor} />
      </div>
  );


  return (
    <>
    {isAuthenticated ? AuthFragment : AnonymousFragment}
    <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
    </>

  )

  if (isAuthenticated) {
    return (
      <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        <Dashboard setBackgroundColor={setBackgroundColor} />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        <SignUpLoginFormContainer setBackgroundColor={setBackgroundColor} />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default App;
