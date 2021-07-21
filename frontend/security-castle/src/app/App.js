import React from "react"
import Router from "./router";
import {AuthContextProvider} from "../context/AuthContext";

function App() {
  return (
      <AuthContextProvider>
          <Router/>
      </AuthContextProvider>
  );
}

export default App;
