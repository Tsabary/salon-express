import "./styles.scss";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import history from "../../../../history";
import { SearchContext } from "../../../../providers/Search";
import { PageContext } from "../../../../providers/Page";
import { FloorContext } from "../../../../providers/Floor";

const SalonLogo = ({ floor }) => {
  const myHistory = useHistory(history);

  const { setPage } = useContext(PageContext);
  const { setSearchTerm } = useContext(SearchContext);
  const { setIsDetailsVisible } = useContext(FloorContext);

  const handleChange = () => {
    if (floor) {
      setIsDetailsVisible(true);
    } else {
      setSearchTerm(null);
      setPage(1);
      myHistory.push(`/`);
    }
  };

  return (
    <div className="logo">
      <div onClick={handleChange} className="logo__title--full">
        <div className="logo__title--main ">Salon.</div>
        <div className="logo__title--sub">Humans Talking</div>
      </div>
      <div className="logo__title logo__title--lean" onClick={handleChange}>
        <div className="logo__title--main ">S.</div>
      </div>
    </div>
  );
};

export default SalonLogo;
