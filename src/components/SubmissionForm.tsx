import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, MessageSquare } from "lucide-react";

const categories = [
  "Education",
  "Corruption", 
  "Environment",
  "Equality",
  "Mental Health",
  "Innovation"
];

export const SubmissionForm = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in both your message and select a category.",
        variant: "destructive"
      });
      return;
    }

    if (message.length < 10) {
      toast({
        title: "Message Too Short", 
        description: "Please write at least 10 characters to share your thoughts.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            message: message.trim(),
            category: category
          }
        ]);

      if (error) throw error;

      toast({
        title: "Voice Shared Successfully!",
        description: "Your anonymous message has been submitted and will appear on the dashboard.",
      });

      setMessage("");
      setCategory("");
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sharing your voice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Voice</h1>
          <p className="text-muted-foreground">
            Your identity remains completely anonymous. Share your thoughts, concerns, and ideas freely.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Message</CardTitle>
            <CardDescription>
              What's on your mind? Share your thoughts about society, your community, or any issues that matter to you.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category that best fits your message" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, concerns, ideas, or hopes for the future..."
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {message.length}/1000 characters
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-2">💡 Tips for effective submissions:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Be specific about the issue you're addressing</li>
                  <li>• Share personal experiences or observations</li>
                  <li>• Suggest potential solutions when possible</li>
                  <li>• Keep your message respectful and constructive</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Share Your Voice
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Your submission is completely anonymous and cannot be traced back to you.
          </p>
        </div>
      </div>
    </div>
  );
};