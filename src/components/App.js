import "../styles/styles.scss";

import "./styles.scss";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";
import Helmet from "react-helmet";

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
import Stranger from "./pages/stranger";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/privacyPolicy";

const App = () => {
  return (
    // <MetaProvider>
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
                  <Route path="/practice/:id" exact component={SingleStream} />
                  <Route path="/contact" exact component={Contact} />
                  <Route
                    path="/privacy-policy"
                    exact
                    component={PrivacyPolicy}
                  />
                  <Route path="/:id" exact component={Stranger} />
                </Switch>
              </div>
            </Router>
          </ToastProvider>
        </SearchProvider>
      </PageProvider>
    </AuthProvider>
    // </MetaProvider>
  );
};

export default App;
