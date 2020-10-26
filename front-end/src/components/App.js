import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import UserProfile from "./UserProfile";
import Register from "./Register";
import ContextProvider from "../ContextProvider";
import Footer from "./Footer";

function App() {
  const [status, setStatus] = useState(
    Boolean(localStorage.getItem("webappv2Token"))
  );

  return (
    <ContextProvider.Provider value={setStatus}>
      <BrowserRouter>
        <Header status={status} />
        <Switch>
          {status ? (
            <Route exact path="/profile/:id">
              {" "}
              <UserProfile />
            </Route>
          ) : (
            <Route exact path="/">
              <Home />
            </Route>
          )}

          <Route exact path="/register" component={Register} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </ContextProvider.Provider>
  );
}

export default App;
