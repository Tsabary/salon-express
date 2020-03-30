import "../styles/styles.scss";
import "./styles.scss";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Header from "./header";

import { AuthProvider } from "../providers/Auth";
import { SearchProvider } from "../providers/Search";

import { ToastProvider } from "react-toast-notifications";
import history from "../history";

import SignUp from "./popups/signUp";

import UpdateProfile from "./popups/updateProfile";
import NewStream from "./popups/newStream";
import EditedStream from "./popups/editStream";

import Feed from "./pages/feed";
import MyStreams from "./pages/myStreams";
import Calendar from './pages/calendar'
import Contact from "./pages/contact";

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <ToastProvider>
          <Router history={history}>
            <div className="app">
              <SignUp />
              <UpdateProfile />
              <NewStream />
              <EditedStream />
              <Header />
              <Switch>
                <Route path="/" exact component={Feed} />
                <Route path="/my-streams" exact component={MyStreams} />
                <Route path="/calendar" exact component={Calendar} />
                <Route path="/contact" exact component={Contact} />
              </Switch>
            </div>
          </Router>
        </ToastProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
