import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, MessageSquare, Trophy, Calendar, Users } from "lucide-react";

interface Post {
  id: string;
  message: string;
  category: string;
  upvotes: number;
  is_hidden: boolean;
  created_at: string;
}

interface CategoryStats {
  category: string;
  count: number;
  totalUpvotes: number;
  avgUpvotes: number;
}

export const Analytics = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_hidden', false);

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Analyzing community data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((sum, post) => sum + post.upvotes, 0);
  const avgUpvotes = totalPosts > 0 ? (totalUpvotes / totalPosts).toFixed(1) : '0';

  // Top posts
  const topPosts = [...posts]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  // Category statistics
  const categoryStats: CategoryStats[] = [];
  const categories = ['Education', 'Corruption', 'Environment', 'Equality', 'Mental Health', 'Innovation'];
  
  categories.forEach(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    const count = categoryPosts.length;
    const totalUpvotes = categoryPosts.reduce((sum, post) => sum + post.upvotes, 0);
    const avgUpvotes = count > 0 ? totalUpvotes / count : 0;

    if (count > 0) {
      categoryStats.push({
        category,
        count,
        totalUpvotes,
        avgUpvotes
      });
    }
  });

  // Sort categories by count
  categoryStats.sort((a, b) => b.count - a.count);

  // Recent activity (last 7 days)
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentPosts = posts.filter(post => new Date(post.created_at) >= weekAgo);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Analytics</h1>
          <p className="text-muted-foreground">
            Insights into what matters most to young voices in our community.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalUpvotes}</p>
                  <p className="text-sm text-muted-foreground">Total Upvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgUpvotes}</p>
                  <p className="text-sm text-muted-foreground">Avg Upvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{recentPosts.length}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Popular Categories
              </CardTitle>
              <CardDescription>
                Most discussed topics in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((stat, index) => (
                  <div key={stat.category} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{stat.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.count} post{stat.count !== 1 ? 's' : ''} • {stat.totalUpvotes} upvotes
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {stat.avgUpvotes.toFixed(1)} avg
                    </Badge>
                  </div>
                ))}
                {categoryStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No category data available yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Most Upvoted Posts
              </CardTitle>
              <CardDescription>
                Community favorites that resonated most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{post.upvotes}</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {post.message.length > 100 
                        ? `${post.message.substring(0, 100)}...`
                        : post.message
                      }
                    </p>
                  </div>
                ))}
                {topPosts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No posts available yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Impact */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community Impact
            </CardTitle>
            <CardDescription>
              How your voices are making a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Voices Heard</h3>
                <p className="text-sm text-muted-foreground">
                  {totalPosts} anonymous submissions from young people sharing their perspectives on society.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community Support</h3>
                <p className="text-sm text-muted-foreground">
                  {totalUpvotes} upvotes showing solidarity and support for shared concerns and ideas.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Diverse Topics</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryStats.length} different categories representing the breadth of youth concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};