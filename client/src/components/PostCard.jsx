import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';

const PostCard = ({ post, currentUserId, onDelete }) => {
  const isAuthor = currentUserId === post.author?._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link 
            to={`/posts/${post._id}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3">
          {post.content}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/posts/${post._id}`}>
            Read More
          </Link>
        </Button>
        
        {isAuthor && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/edit-post/${post._id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(post._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;