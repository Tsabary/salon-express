import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";

import {
  fetchSingleRoom,
  fetchRoomComments,
  newComment,
  associateWithRoom,
  keepRoomListed,
} from "../../../actions";
import { validateWordsLength } from "../../../utils/strings";

import InputField from "../../formComponents/inputField";
import ToggleField from "../../formComponents/toggleField";
import BoxedButton from "../../formComponents/boxedButton";

import Room from "../../room";
import Comment from "./comment";

const SingleRoom = ({
  match,
  explore,
  fetchSingleRoom,
  fetchRoomComments,
  newComment,
  associateWithRoom,
  keepRoomListed,
}) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [comments, setComments] = useState([]);
  const [values, setValues] = useState(null);

  useEffect(() => {
    if (!currentUserProfile || !currentUserProfile.uid || !room) return;

    setValues({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      room_ID: room.id,
    });
  }, [currentUserProfile, room]);

  useEffect(() => {
    // const thisRoom = explore.filter((r) => r.id === match.params.id);
    // thisRoom.length ? setRoom(thisRoom[0]) : fetchSingleRoom(match.params.id);
    fetchSingleRoom(match.params.id, setRoom);
    fetchRoomComments(match.params.id, setComments);
  }, [match.params.id, explore]);

  const renderContent = (room, currentUserProfile) => {
    switch (true) {
      case !room:
        return null;

      case room === "empty":
        return (
          <div className="empty-feed">
            {/* Looks like this room isn't available anymore! */}
          </div>
        );

      default:
        return (
          <Room
            room={room}
            currentUserProfile={
              currentUserProfile || { uid: "", following: [], followers: [] }
            }
            key={room.id}
          />
        );
    }
  };

  const renderComments = (comments) => {
    return comments.map((com) => {
      return <Comment comment={com} key={com.id} />;
    });
  };

  return (
    <div className="single-room">
      <div>
        <div className="single-room__box">
          {renderContent(room, currentUserProfile)}
        </div>

        {(room && room.associate) ||
        (currentUserProfile &&
          room &&
          room.user_ID === currentUserProfile.uid) ? (
          <div className="single-room__founder-container">
            <ToggleField
              id="singleRoomListed"
              text="Keep room public"
              toggleOn={() => keepRoomListed(room, true)}
              toggleOff={() => keepRoomListed(room, false)}
              isChecked={room.listed}
            />

            <ToggleField
              id="singleRoomAssociate"
              text="Associate me with this Room"
              toggleOn={() => associateWithRoom(room, true)}
              toggleOff={() => associateWithRoom(room, false)}
              isChecked={room.associate}
            />

            {room && room.associate ? (
              <>
                <div className="single-room__founder-admin">founded by:</div>

                <div
                  className="max-max tiny-margin-top"
                  onClick={() => myHistory.push(`/${room.user_username}`)}
                >
                  <img className="comment__avatar" src={room.user_avatar} />
                  <div className="comment__user-name">{room.user_name}</div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="single-room__comments">
        <form
          className="fr-max small-margin-tpo"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            if (!currentUserProfile || !values.body || !values.body.length)
              return;
            newComment(values, () => {
              setComments([
                { ...values, created_on: new Date(), id: Date.now() },
                ...comments,
              ]);
              setValues({ ...values, body: "" });
            });
          }}
        >
          <InputField
            type="text"
            placeHolder="Leave a comment"
            value={values && values.body}
            onChange={(body) => {
              if (body.length < 500) setValues({ ...values, body });
            }}
          />
          {currentUserProfile ? (
            <>
              <button
                type="submit"
                className="boxed-button single-room__comment--boxed"
              >
                Comment
              </button>

              <button
                type="submit"
                className="text-button-mobile  single-room__comment--text"
              >
                Comment
              </button>
            </>
          ) : (
            <a href="#sign-up" className="auth-options__box">
              <BoxedButton text="Comment" />
            </a>
          )}
        </form>
        {comments ? renderComments(comments) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    explore: state.explore,
  };
};

export default connect(mapStateToProps, {
  fetchSingleRoom,
  fetchRoomComments,
  newComment,
  associateWithRoom,
  keepRoomListed,
})(SingleRoom);
