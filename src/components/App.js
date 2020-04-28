import "../styles/styles.scss";
import "./styles.scss";

import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { isMobile } from "react-device-detect";
import { ToastProvider } from "react-toast-notifications";

import { AuthProvider } from "../providers/Auth";
import { SearchProvider } from "../providers/Search";
import { PageProvider } from "../providers/Page";
import { UniqueIdProvider } from "../providers/UniqueId";
import { RoomProvider } from "../providers/Room";
import { FloorProvider } from "../providers/Floor";

import { stopListeningToProfile, detachListener } from "../actions";

import history from "../history";

import MainHeader from "./staticComponents/header/main";
import FloorHeader from "./staticComponents/header/floor";
import Footer from "./staticComponents/footer";

import SignUp from "./popups/signUp";
import UpdateProfile from "./popups/updateProfile";
import NewRoom from "./popups/newRoom";
import NewFloor from "./popups/newFloor";
import NewFloorPlan from "./popups/newFloorPlan";

import Home from "./pages/home";
import Search from "./pages/search";
import SingleRoom from "./pages/singleRoom";
import Stranger from "./pages/stranger";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/sheets/PrivacyPolicy";
import TermsAndConditions from "./pages/sheets/TermsAndConditions";
import Faq from "./pages/faq";
import AddQuestion from "./pages/addQuestion";
import Careers from "./pages/careers";
import Apply from "./pages/apply";
import Floor from "./pages/floor";

import Updates from "./otherComponents/updates";
import AudioChannels from "./popups/audioChannels";
import NewFloorRoom from "./popups/newFloorRoom";

const App = () => {
  return (
    <AuthProvider>
      <PageProvider>
        <RoomProvider>
          <FloorProvider>
            <SearchProvider>
              <ToastProvider>
                <UniqueIdProvider>
                  <Router history={history}>
                    <div className="app">
                      <SignUp />
                      <UpdateProfile />
                      <NewRoom />
                      <NewFloor />
                      <NewFloorRoom />
                      <NewFloorPlan/>
                      <AudioChannels />
                      {/* <EditRoom /> */}
                      {window.location.href.split("/")[3] !== "floor" ? (
                        <MainHeader />
                      ) : (
                        <FloorHeader />
                      )}

                      {!isMobile ? <Updates /> : null}

                      <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/on/:id" exact component={Search} />
                        <Route path="/room/:id" exact component={SingleRoom} />
                        <Route path="/contact" exact component={Contact} />
                        <Route
                          path="/frequently-asked-questions"
                          exact
                          component={Faq}
                        />
                        <Route
                          path="/add-question"
                          exact
                          component={AddQuestion}
                        />
                        <Route path="/careers" exact component={Careers} />
                        <Route path="/careers/:id" exact component={Apply} />
                        <Route path="/floor/:id" exact component={Floor} />
                        <Route
                          path="/privacy-policy"
                          exact
                          component={PrivacyPolicy}
                        />

                        <Route
                          path="/terms-and-conditions"
                          exact
                          component={TermsAndConditions}
                        />
                        <Route path="/:id" exact component={Stranger} />
                      </Switch>

                      <div className="app__footer">
                        <Footer />
                      </div>
                    </div>
                  </Router>
                </UniqueIdProvider>
              </ToastProvider>
            </SearchProvider>
          </FloorProvider>
        </RoomProvider>
      </PageProvider>
    </AuthProvider>
  );
};

export default connect(null, { stopListeningToProfile, detachListener })(App);
