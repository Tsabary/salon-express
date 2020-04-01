import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { SearchContext } from "../../../providers/Search";

import Feed from "../feed";
import Search from "../search";
import Subscriptions from "../subscriptions";
import Calendar from "../calendar";
import MyStreams from "../myStreams";
import { PageContext } from "../../../providers/Page";
import { AuthContext } from "../../../providers/Auth";

const Home = () => {
  const { searchTerm } = useContext(SearchContext);
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);

  useEffect(() => {
    console.log(searchTerm);
  }, [searchTerm]);

  const renderContent = (p, term) => {
    switch (p) {
      case 1:
        return term ? <Search /> : <Feed />;

      case 2:
        return <Subscriptions />;

      case 3:
        return <Calendar />;

      case 4:
        return <MyStreams />;
    }
  };

  return (
    <div className="home">
      <div className="home__menu">
        <ul>
          {page === 1 ? (
            <div className="default-active">Explore</div>
          ) : (
            <li onClick={() => setPage(1)}>
              <a href="#">Explore</a>
            </li>
          )}

          {page === 2 && currentUser ? (
            <div className="default-active">Subscriptions</div>
          ) : currentUser ? (
            <li onClick={() => setPage(2)}>
              <a href="#">Subscriptions</a>
            </li>
          ) : null}

          {page === 3 && currentUser ? (
            <div className="default-active">Calendar</div>
          ) : currentUser ? (
            <li onClick={() => setPage(3)}>
              <a href="#">Calendar</a>
            </li>
          ) : null}

          {page === 4 && currentUser ? (
            <div className="default-active">My Streams</div>
          ) : currentUser ? (
            <li onClick={() => setPage(4)}>
              <a href="#">My Streams</a>
            </li>
          ) : null}
        </ul>
      </div>

      {renderContent(page, searchTerm)}
    </div>
  );
};

export default Home;
