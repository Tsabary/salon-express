import "./styles.scss";
import React, { useContext } from "react";
import SingleRequest from "./singleRequest";
import { GlobalContext } from "../../../providers/Global";

const Requests = () => {
  const { loungeRequests } = useContext(GlobalContext);

  const renderRequests = (reqs) => {
    return Object.values(reqs)
      .map((r, i) => {
        return { ...r, id: Object.keys(reqs)[i] };
      })
      .filter((req) => !req.approved)
      .map((req) => {
        return <SingleRequest request={req} key={req.id} />;
      });
  };

  return <div className="requests">{renderRequests(loungeRequests)}</div>;
};

export default Requests;
