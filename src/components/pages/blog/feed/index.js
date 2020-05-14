import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetchFirstBlogPosts } from "../../../../actions/blog";

import SinglePost from "./singlePost";

const Blog = ({ blogPosts, fetchFirstBlogPosts }) => {
  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    if (!blogPosts.length) fetchFirstBlogPosts(setLastVisible, setReachedLast);
  }, [blogPosts]);

  const renderPosts = (posts) => {
    return posts.map((post) => {
      return <SinglePost post={post} key={post.id} />;
    });
  };

  return (
    <div className="blog">
      {blogPosts.length ? (
        <div className="blog__posts section__container">
          <div className="section__title">All articles</div>
          {renderPosts(blogPosts)}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    blogPosts: state.blogPosts,
  };
};

export default connect(mapStateToProps, { fetchFirstBlogPosts })(Blog);
