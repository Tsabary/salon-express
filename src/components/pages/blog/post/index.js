import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import { AuthContext } from "../../../../providers/Auth";

import { fetchCurrentPost, postLike } from "../../../../actions/blog";
import PostHeader from "./header";
import UserSocial from "../../../otherComponents/userSocial";
import IFrame from "../../singleRoom/media/content/iframe";
import Comments from "./comments";

const Post = ({ match, blogPosts, fetchCurrentPost, postLike }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const thisPost = blogPosts.filter((p) => p.id === match.params.id)[0];
    if (thisPost) {
      setPost(thisPost);
    } else {
      const id = match.params.id.split("-");
      fetchCurrentPost(id[id.length - 1], (p) => setPost(p));
    }
  }, [blogPosts]);

  const renderTags = () => {
    return post.tags.map((el) => {
      return (
        <div
          className="room__tag"
          key={el}
          onClick={() => {
            console.log("post tags");
            // firebase.analytics().logEvent("search_from_tag_click");
          }}
        >
          {el}
        </div>
      );
    });
  };

  const getSvg = (hover, post) => {
    switch (true) {
      case hover &&
        post.likes &&
        currentUserProfile &&
        post.likes.includes(currentUserProfile.uid):
        return "../svgs/rocket_4.svg";

      case hover &&
        post.likes &&
        (!currentUserProfile ||
          (currentUserProfile && !post.likes.includes(currentUserProfile.uid))):
        return "../svgs/rocket_2.svg";

      case !hover &&
        post.likes &&
        currentUserProfile &&
        post.likes.includes(currentUserProfile.uid):
        return "../svgs/rocket_3.svg";

      case !hover &&
        post.likes &&
        (!currentUserProfile ||
          (currentUserProfile && !post.likes.includes(currentUserProfile.uid))):
        return "../svgs/rocket_1.svg";
    }
  };

  return post ? (
    <div className="post">
      <div className="post__body section__container">
        <PostHeader post={post} />
        <div className="tiny-margin-top">
          <UserSocial uid={post.user_ID} horizontal socialRtl />
        </div>
        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.video ? (
          <div className="small-margin-top">
            <IFrame
              url={`https://www.youtube.com/embed/${post.video}`}
              source="youtube"
              isVideoVisible
            />
          </div>
        ) : null}

        <div className="small-margin-top fr-max">
          <div>{post.tags ? renderTags() : null}</div>
          <div
            className={
              currentUserProfile && post.likes.includes(currentUserProfile.uid)
                ? "post__like-container post__like-container--liked"
                : "post__like-container post__like-container--unliked"
            }
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => {
              currentUserProfile
                ? postLike(
                    post,
                    currentUserProfile.uid,
                    post.likes.includes(currentUserProfile.uid),
                    (p) => setPost(p)
                  )
                : (window.location.hash = "sign-up");
            }}
          >
            <ReactSVG
              src={getSvg(hover, post)}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("post__like");
              }}
            />
          </div>
        </div>

        <div
          className="small-margin-top"
          style={{ width: "100%", borderBottom: "1px #dadada solid" }}
        />
        <div className="small-margin-top">
          <UserSocial uid={post.user_ID} horizontal socialRtl />
        </div>
        <div className="small-margin-top">
          <Comments postID={post.id} />
        </div>
        <div className="small-margin-top"></div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    blogPosts: state.blogPosts,
  };
};

export default connect(mapStateToProps, {
  fetchCurrentPost,
  postLike,
})(Post);
