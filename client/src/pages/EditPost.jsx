import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { postsAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const EditPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const fetchPost = async () => {
    try {
      setInitialLoading(true);
      const data = await postsAPI.getPostById(id);
      if (data.success) {
        const post = data.post;
        
        // Check if user is the author
        if (getCurrentUserId() !== post.author?._id) {
          toast({
            title: "Error",
            description: "You can only edit your own posts",
            variant: "destructive",
          });
          navigate('/posts');
          return;
        }

        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags ? post.tags.join(', ') : ''
        });
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
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const data = await postsAPI.updatePost(id, submitData);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Post updated successfully!",
        });
        
        navigate(`/posts/${id}`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update post",
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

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Post</h1>
          <p className="text-muted-foreground">
            Make changes to your post
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Your Post</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your post content here..."
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
                  value={formData.tags}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple tags with commas
                </p>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Updating...' : 'Update Post'}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/posts/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;