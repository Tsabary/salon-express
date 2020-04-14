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
import Footer from "./footer";

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
import Faq from "./pages/faq";
import AddQuestion from "./pages/addQuestion";
import Careers from "./pages/careers";
import Apply from "./pages/apply";

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
                  <Route path="/practice/:id" exact component={SingleStream} />
                  <Route path="/contact" exact component={Contact} />
                  <Route
                    path="/frequently-asked-questions"
                    exact
                    component={Faq}
                  />
                  <Route path="/add-question" exact component={AddQuestion} />
                  <Route path="/careers" exact component={Careers} />
                  <Route path="/careers/:id" exact component={Apply} />
                  <Route
                    path="/privacy-policy"
                    exact
                    component={PrivacyPolicy}
                  />
                  <Route path="/:id" exact component={Stranger} />
                </Switch>

                <div className="app__footer">
                  <Footer />
                </div>
              </div>
            </Router>
          </ToastProvider>
        </SearchProvider>
      </PageProvider>
    </AuthProvider>
  );
};

export default App;
