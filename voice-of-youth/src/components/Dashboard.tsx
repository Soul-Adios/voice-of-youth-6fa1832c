import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PostCard } from "./PostCard";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, Clock, MessageSquare, Filter } from "lucide-react";

interface Post {
  id: number;
  message: string;
  category: string;
  upvotes: number;
  timestamp: string;
}

export const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"recent" | "upvotes">("recent");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = ["all", "Education", "Corruption", "Environment", "Equality", "Mental Health", "Innovation"];

  // Fetch posts from Django
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts/");
      if (!response.ok) throw new Error("Failed to fetch posts");

      let data: Post[] = await response.json();

      // Filter by category
      if (filterCategory !== "all") {
        data = data.filter((post) => post.category === filterCategory);
      }

      // Sort
      if (sortBy === "recent") {
        data.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else {
        data.sort((a, b) => b.upvotes - a.upvotes);
      }

      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Failed to Load Posts",
        description: "There was an error loading the posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle upvote
  const handleUpvote = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/upvote/${id}/`, {
        method: "POST",
      });
      if (response.ok) {
        fetchPosts(); // reload after upvote
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, filterCategory]);

  const totalUpvotes = posts.reduce((sum, post) => sum + post.upvotes, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading voices from the community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Dashboard</h1>
          <p className="text-muted-foreground">
            Discover what matters to young people in your community and beyond.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center">
              <MessageSquare className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Total Voices</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <TrendingUp className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalUpvotes}</p>
                <p className="text-sm text-muted-foreground">Total Upvotes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <Filter className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Controls
            </CardTitle>
            <CardDescription>
              Customize how you view community voices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <Label>Sort by:</Label>
                <Select value={sortBy} onValueChange={(value: "recent" | "upvotes") => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Most Recent
                      </div>
                    </SelectItem>
                    <SelectItem value="upvotes">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Most Upvoted
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label>Category:</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Voices Yet</h3>
                <p className="text-muted-foreground">
                  {filterCategory !== "all"
                    ? `No posts found in the ${filterCategory} category.`
                    : "Be the first to share your voice with the community."}
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onUpvote={() => handleUpvote(post.id)} />
            ))
          )}
        </div>

        {/* Category Stats */}
        {posts.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                See which topics are most discussed in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.slice(1).map((category) => {
                  const count = posts.filter((post) => post.category === category).length;
                  return count > 0 ? (
                    <Badge key={category} variant="secondary" className="text-sm">
                      {category}: {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
