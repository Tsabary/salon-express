import "./styles.scss";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { fetchCurrentPost } from "../../../../actions/blog";
import PostHeader from "./header";
import Author from "./author";

const Post = ({ match, blogPosts, fetchCurrentPost }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const thisPost = blogPosts.filter((p) => p.id === match.params.id)[0];
    if (thisPost) {
      setPost(thisPost);
    } else {
      const id = match.params.id.split("-")
      fetchCurrentPost(id[id.length - 1], (p) => setPost(p));
    }
  }, [blogPosts]);

  return post ? (
    <div className="post">
      <div className="section__container">
        <div className="post__body">
          <PostHeader post={post} />
          <Author post={post} />
          <div className="post__content" dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
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
})(Post);
