import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Clock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  message: string;
  category: string;
  upvotes: number;
  is_hidden: boolean;
  created_at: string;
}

interface PostCardProps {
  post: Post;
  showModerationControls?: boolean;
  onPostUpdated?: () => void;
}

export const PostCard = ({ post, showModerationControls = false, onPostUpdated }: PostCardProps) => {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  const handleUpvote = async () => {
    setIsUpvoting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Upvoted!",
        description: "You've shown support for this voice.",
      });

      onPostUpdated?.();
    } catch (error) {
      console.error('Error upvoting post:', error);
      toast({
        title: "Upvote Failed",
        description: "There was an error upvoting this post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const toggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_hidden: !post.is_hidden })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: post.is_hidden ? "Post Unhidden" : "Post Hidden",
        description: post.is_hidden ? "Post is now visible to everyone." : "Post has been hidden from public view.",
      });

      onPostUpdated?.();
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      toast({
        title: "Action Failed", 
        description: "There was an error updating the post visibility.",
        variant: "destructive"
      });
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Education: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Corruption: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", 
      Environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Equality: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Mental Health": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Innovation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className={`${post.is_hidden ? 'opacity-60 border-dashed' : ''}`}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            {post.message}
          </p>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={isUpvoting}
              className="flex items-center space-x-1 hover:bg-primary/10 hover:text-primary"
            >
              <ThumbsUp className={`h-4 w-4 ${isUpvoting ? 'animate-pulse' : ''}`} />
              <span>{post.upvotes}</span>
            </Button>

            {showModerationControls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVisibility}
                disabled={isTogglingVisibility}
                className="flex items-center space-x-1"
              >
                {post.is_hidden ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Show</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Hide</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};