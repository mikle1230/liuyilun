import ProfileCard from './ProfileCard'
import RecentPosts from './RecentPosts'
import WallpaperRadar from './WallpaperRadar'
import TagCloud from './TagCloud'
import './Sidebar.css'

export default function BlogSidebar({
  posts = [],
  wallpapers = [],
  tags = [],
  activeTag,
  onTagClick,
}) {
  return (
    <div className="blog-sidebar">
      <ProfileCard
        postCount={posts.length}
        wallpaperCount={wallpapers.length}
      />
      <RecentPosts posts={posts} />
      <WallpaperRadar wallpapers={wallpapers} />
      <TagCloud
        tags={tags}
        activeTag={activeTag}
        onTagClick={onTagClick}
      />
    </div>
  )
}
