import "../styles/styles.scss";

import "./styles.scss";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";


import { AuthProvider } from "../providers/Auth";
import { SearchProvider } from "../providers/Search";
import { PageProvider } from "../providers/Page";

import history from "../history";

import Header from "./header";

import SignUp from "./popups/signUp";
import UpdateProfile from "./popups/updateProfile";
import NewStream from "./popups/newStream";
import EditedStream from "./popups/editStream";

import Home from "./pages/home";
import Search from "./pages/search";
import SingleStream from "./pages/singleStream";
import Stranger from './pages/stranger';
import Contact from "./pages/contact";

const App = () => {
  return (
    <AuthProvider>
      <PageProvider>
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
                  <Route path="/" exact component={Home} />
                  <Route path="/on/:id" exact component={Search} />
                  <Route path="/stream/:id" exact component={SingleStream} />
                  <Route path="/profile/:id" exact component={Stranger} />
                  <Route path="/contact" exact component={Contact} />
                </Switch>
              </div>
            </Router>
          </ToastProvider>
        </SearchProvider>
      </PageProvider>
    </AuthProvider>
  );
};

export default App;
