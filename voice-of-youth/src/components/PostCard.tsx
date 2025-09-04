import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  message: string;
  category: string;
  upvotes: number;
  timestamp: string; // matches Django model field
}

interface PostCardProps {
  post: Post;
  onUpvote?: () => void;
}

export const PostCard = ({ post, onUpvote }: PostCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      Education:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Corruption:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Environment:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Equality:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Mental Health":
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Innovation:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Category + Timestamp */}
          <div className="flex items-start justify-between">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>

            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(post.timestamp), {
                addSuffix: true,
              })}
            </div>
          </div>

          {/* Message */}
          <p className="text-foreground leading-relaxed">{post.message}</p>

          {/* Upvote Button */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUpvote}
              className="flex items-center space-x-1 hover:bg-primary/10 hover:text-primary"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.upvotes}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
