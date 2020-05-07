import "../styles/styles.scss";
import "./styles.scss";

import React, { useState, useEffect } from "react";
import { Router, Route, Switch, useHistory } from "react-router-dom";
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

import MainHeader from "./staticComponents/header/Main";
import FloorHeader from "./staticComponents/header/Floor";
import FloorRoomHeader from "./staticComponents/header/FloorRoom";
import Footer from "./staticComponents/footer/main";
import FooterFloor from "./staticComponents/footer/floor";

import SignUp from "./popups/signUp";
import UpdateProfile from "./popups/updateProfile";
import NewRoom from "./popups/newRoom";
import NewFloor from "./popups/newFloor";
import NewFloorPlan from "./popups/newFloorPlan";

import Home from "./pages/home";
import Search from "./pages/search";
import SingleRoom from "./pages/singleRoom/publicRoom";
import SingleRoomFloor from "./pages/singleRoom/floorRoom";
import Stranger from "./pages/stranger";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/sheets/PrivacyPolicy";
import TermsAndConditions from "./pages/sheets/TermsAndConditions";
import AnswerQuestions from "./pages/answerQuestions";
import AddQuestion from "./pages/addQuestion";
import Careers from "./pages/careers";
import Apply from "./pages/apply";
import Floor from "./pages/floor";
import FloorManagement from "./pages/floorManagement";
import EditFloor from "./pages/editFloor";

// import Updates from "./otherComponents/updates";
import AudioChannels from "./popups/audioChannels";
import NewFloorRoom from "./popups/newFloorRoom";
import BottomHelpers from "./otherComponents/bottomHelpers";

const App = () => {
  const [isFloor, setIsFloor] = useState(
    window.location.href.includes("floor") &&
      !window.location.href.includes("management") &&
      window.location.href.split("/").length === 5
  );

  const [isFloorRoom, setIsFloorRoom] = useState(
    window.location.href.includes("floor") &&
      !window.location.href.includes("management") &&
      window.location.href.split("/").length === 6
  );

  useEffect(() => {
    return history.listen((location) => {
      setIsFloor(
        location.pathname.includes("floor") &&
          !location.pathname.includes("management") &&
          location.pathname.split("/").length === 3
      );

      setIsFloorRoom(
        location.pathname.includes("floor") &&
          !location.pathname.includes("management") &&
          location.pathname.split("/").length === 4
      );
    });
  }, [history]);

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
                      <NewFloorPlan />
                      <AudioChannels />
                      {/* <EditRoom /> */}
                      {isFloor ? (
                        <FloorHeader />
                      ) : isFloorRoom ? (
                        <FloorRoomHeader />
                      ) : (
                        <MainHeader />
                      )}

                      {!isMobile && !isFloor ? <BottomHelpers /> : null}

                      <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/on/:id" exact component={Search} />
                        <Route path="/room/:id" exact component={SingleRoom} />
                        <Route path="/contact" exact component={Contact} />
                        <Route
                          path="/answer-questions"
                          exact
                          component={AnswerQuestions}
                        />
                        <Route
                          path="/add-question"
                          exact
                          component={AddQuestion}
                        />
                        <Route path="/careers" exact component={Careers} />
                        <Route path="/careers/:id" exact component={Apply} />
                        <Route
                          path="/floor-management"
                          exact
                          component={FloorManagement}
                        />
                        <Route
                          path="/floor-management/:id"
                          exact
                          component={EditFloor}
                        />
                        <Route path="/floor/:id" exact component={Floor} />
                        <Route
                          path="/floor/:id/:room"
                          exact
                          component={SingleRoomFloor}
                        />
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
                        <Footer isFloor={isFloor} />
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
