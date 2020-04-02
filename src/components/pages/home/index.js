import "./styles.scss";
import React, { useContext } from "react";

import Explore from "../explore";
// import Search from "../search";
import Subscriptions from "../subscriptions";
import Calendar from "../calendar";
import Mine from "../mine";
import { PageContext } from "../../../providers/Page";
import { AuthContext } from "../../../providers/Auth";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);

  const renderContent = p => {
    switch (p) {
      case 1:
        return <Explore />;

      case 2:
        return <Subscriptions />;

      case 3:
        return <Calendar />;

      case 4:
        return <Mine />;

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

      {renderContent(page)}
    </div>
  );
};

export default Home;
