import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { postsAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get current user info
  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAllPosts();
      if (data.success) {
        setPosts(data.posts || []);
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
        setPosts(posts.filter(post => post._id !== postId));
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to BlogApp
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing stories, share your thoughts, and connect with a community of passionate writers.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/posts">Browse Posts</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/register">Join Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Posts</h2>
            <p className="text-muted-foreground">Check out the most recent stories from our community</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts found. Be the first to share your story!</p>
              <Button asChild>
                <Link to="/create-post">Create First Post</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={getCurrentUserId()}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {posts.length > 6 && (
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link to="/posts">View All Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose BlogApp?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Writing</h3>
              <p className="text-muted-foreground">Simple and intuitive editor for creating beautiful posts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-muted-foreground">Connect with writers and readers from around the world</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Grow</h3>
              <p className="text-muted-foreground">Share your ideas and grow your audience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;