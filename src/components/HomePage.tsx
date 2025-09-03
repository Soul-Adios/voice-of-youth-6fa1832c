import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Zap, MessageSquare, TrendingUp } from "lucide-react";

interface HomePageProps {
  onNavigate: (view: 'submit' | 'dashboard') => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const features = [
    {
      icon: MessageSquare,
      title: "Anonymous Submissions",
      description: "Share your thoughts, concerns, and ideas without revealing your identity. Your voice matters, and your privacy is protected."
    },
    {
      icon: Users,
      title: "Community Voice", 
      description: "Connect with peers who share similar concerns. See what issues matter most to your generation through collective participation."
    },
    {
      icon: TrendingUp,
      title: "Upvote System",
      description: "Support ideas and concerns that resonate with you. Help prioritize the most important issues facing young people today."
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Moderated platform ensuring respectful discourse. We maintain a safe space for meaningful conversations about societal issues."
    }
  ];

  const categories = [
    "Education", "Corruption", "Environment", "Equality", "Mental Health", "Innovation"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Your Voice. <span className="text-primary">Your Future.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A platform where young voices shape tomorrow. Share your concerns, ideas, and hopes 
            for society anonymously and help build a better future together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('submit')}
              size="lg"
              className="text-lg px-8 py-3"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Share Your Voice
            </Button>
            
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore Ideas
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Your Voice Matters
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-border">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Share Your Thoughts On
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <span className="text-foreground font-medium">{category}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-card border border-border rounded-lg p-8">
            <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-foreground">Ready to Make a Difference?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of young voices already making an impact. Your anonymous submission 
              could be the catalyst for positive change in your community and beyond.
            </p>
            
            <Button
              onClick={() => onNavigate('submit')}
              size="lg"
              className="text-lg px-8 py-3"
            >
              Start Contributing Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};