import "../styles/styles.scss";
import "./styles.scss";

import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";

import { isMobile } from "react-device-detect";
import { ToastProvider } from "react-toast-notifications";

import { ConnectedAuthProvider } from "../providers/Auth";
import { SearchProvider } from "../providers/Search";
import { PageProvider } from "../providers/Page";
import { UniqueIdProvider } from "../providers/UniqueId";
import { RoomProvider } from "../providers/Room";
import { FloorProvider } from "../providers/Floor";
import { GlobalProvider } from "../providers/Global";

import history from "../history";

import MainHeader from "./staticComponents/header/Main";
import FloorHeader from "./staticComponents/header/Floor";
import FloorRoomHeader from "./staticComponents/header/FloorRoom";
import Footer from "./staticComponents/footer/main";

import SignUp from "./popups/signUp";
// import UpdateProfile from "./popups/updateProfile";
import NewRoom from "./popups/newRoom";
import NewFloor from "./popups/newFloor";
import NewFloorPlan from "./popups/newFloorPlan";

import Explore from "./pages/home/explore";
import Floors from "./pages/home/floors";
import Home from "./pages/home";
import Search from "./pages/search";
import SingleRoom from "./pages/singleRoom/publicRoom";
import Stranger from "./pages/stranger";
import Contact from "./pages/contact";
import PrivacyPolicy from "./pages/sheets/PrivacyPolicy";
import TermsAndConditions from "./pages/sheets/TermsAndConditions";
import AnswerQuestions from "./pages/answerQuestions";
import Careers from "./pages/careers";
import Apply from "./pages/apply";
import Floor from "./pages/floor";
import FloorManagement from "./pages/floorManagement";
import EditFloor from "./pages/editFloor";
import Blog from "./pages/blog/feed";
import NewPost from "./pages/blog/newPost";
import Post from "./pages/blog/post";

// import Updates from "./otherComponents/updates";
import AudioChannels from "./popups/audioChannels";
// import NewFloorRoom from "./popups/newFloorRoom";
import BottomHelpers from "./otherComponents/bottomHelpers";
import EditPost from "./pages/blog/editPost";
import OnBoarding from "./otherComponents/onBoarding";
import FloorDetails from "./otherComponents/floorDetails";
import MinimalHeader from "./staticComponents/header/minimal";
import SideMenu from "./staticComponents/sideMenu";
import Pricing from "./pages/pricing";
import PremiumPlan from "./popups/premiumPlan";
import ContentSuggestions from "./popups/contentSuggestions";
import addSuggestion from "./pages/addSuggestion";
import Requests from "./otherComponents/requests";
import Landing from "./pages/landing";

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
    <ConnectedAuthProvider>
      <GlobalProvider>
        <PageProvider>
          <RoomProvider>
            <FloorProvider>
              <SearchProvider>
                <ToastProvider>
                  <UniqueIdProvider>
                    <Router history={history}>
                      <div className="app">
                        {/* {POPUPS} */}
                        {/* {!isFloor ? <OnBoarding /> : null} */}
                        <FloorDetails />
                        <SignUp />
                        {/* <UpdateProfile /> */}
                        <NewRoom />
                        <NewFloor />
                        <NewFloorPlan />
                        <AudioChannels />
                        <PremiumPlan />
                        <ContentSuggestions />
                        <Requests />
                        {/* {!isMobile ? <BottomHelpers /> : null} */}

                        <MinimalHeader />

                        <div className="app__body">
                          <SideMenu />
                          <div className="app__content">
                            <Switch>
                              <Route path="/" exact component={Landing} />
                              <Route path="/on/:id" exact component={Search} />
                              <Route
                                path="/room/:id"
                                exact
                                component={SingleRoom}
                              />
                              <Route
                                path="/explore"
                                exact
                                component={Explore}
                              />

                              <Route
                                path="/explore-floors"
                                exact
                                component={Floors}
                              />

                              <Route
                                path="/contact"
                                exact
                                component={Contact}
                              />

                              <Route path="/blog" exact component={Blog} />
                              <Route
                                path="/blog/new"
                                exact
                                component={NewPost}
                              />
                              <Route path="/blog/:id" exact component={Post} />
                              <Route
                                path="/blog-edit/:id"
                                exact
                                component={EditPost}
                              />
                              <Route
                                path="/careers"
                                exact
                                component={Careers}
                              />

                              <Route
                                path="/pricing"
                                exact
                                component={Pricing}
                              />
                              <Route
                                path="/careers/:id"
                                exact
                                component={Apply}
                              />
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
                              <Route
                                path="/floor/:id"
                                exact
                                component={Floor}
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

                              <Route
                                path="/answer-questions"
                                exact
                                component={AnswerQuestions}
                              />

                              <Route
                                path="/add-suggestion"
                                exact
                                component={addSuggestion}
                              />

                              <Route path="/:id" exact component={Stranger} />
                            </Switch>
                          </div>
                        </div>

                        {/* {isFloor ? (
                        <FloorHeader />
                      ) : isFloorRoom ? (
                        <FloorRoomHeader />
                      ) : (
                        <MainHeader />
                      )} */}
                        {/* <div className="app__footer">
                        <Footer isFloor={isFloor} />
                      </div> */}
                      </div>
                    </Router>
                  </UniqueIdProvider>
                </ToastProvider>
              </SearchProvider>
            </FloorProvider>
          </RoomProvider>
        </PageProvider>
      </GlobalProvider>
    </ConnectedAuthProvider>
  );
};

export default App;
