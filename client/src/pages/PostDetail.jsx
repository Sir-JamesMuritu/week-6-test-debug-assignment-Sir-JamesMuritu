import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { postsAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, User, Edit, Trash2 } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current user info
  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getPostById(id);
      if (data.success) {
        setPost(data.post);
      } else {
        toast({
          title: "Error",
          description: data.message || "Post not found",
          variant: "destructive",
        });
        navigate('/posts');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      });
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const data = await postsAPI.deletePost(id);
      if (data.success) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        navigate('/posts');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button asChild>
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = getCurrentUserId() === post.author?._id;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Post Content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <span className="text-xs">
                      (Updated: {formatDate(post.updatedAt)})
                    </span>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isAuthor && (
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit-post/${post._id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link to="/posts">Browse More Posts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;