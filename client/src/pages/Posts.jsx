import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/PostCard';
import { postsAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Get current user info
  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAllPosts();
      if (data.success) {
        setPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch posts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const data = await postsAPI.deletePost(postId);
      if (data.success) {
        const updatedPosts = posts.filter(post => post._id !== postId);
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.author?.name.toLowerCase().includes(term) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
      );
      setFilteredPosts(filtered);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Posts</h1>
            <p className="text-muted-foreground">
              Discover amazing stories from our community
            </p>
          </div>
          
          {isAuthenticated() && (
            <Button asChild className="mt-4 sm:mt-0">
              <Link to="/create-post">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  No posts found matching "{searchTerm}"
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredPosts(posts);
                  }}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">
                  No posts found. Be the first to share your story!
                </p>
                {isAuthenticated() && (
                  <Button asChild>
                    <Link to="/create-post">Create First Post</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={getCurrentUserId()}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;