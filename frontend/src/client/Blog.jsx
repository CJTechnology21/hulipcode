import React from "react";
import BlogHeader from "./components/BlogComponents/BlogHeader";
import NewPosts from "./components/BlogComponents/NewPosts";
import HomeCarousel from "./components/BlogComponents/HomeCarousel";
import BlogFooter from "./components/BlogComponents/BlogFooter";
import RelatedPosts from "./components/BlogComponents/RelatedPosts";
import MorePosts from "./components/BlogComponents/MorePosts";
import EditorPicks from "./components/BlogComponents/EditorPicks";
import LatestPostsone from "./components/BlogComponents/LatestPostsone";
import LatestPostsTwo from "./components/BlogComponents/LatestPostsTwo";
import ConversationaBannner from './components/BlogComponents/ConversationBanner'
function Blog() {
  return (
    <div className="font-figtree">
      <BlogHeader />
      <div className="mt-2">
        <NewPosts />
      </div>
      <HomeCarousel />
      <MorePosts/>
      <EditorPicks/>
      <LatestPostsone/>
      <LatestPostsTwo/>
      <ConversationaBannner/>
      <RelatedPosts />
      <BlogFooter />
    </div>
  );
}

export default Blog;
