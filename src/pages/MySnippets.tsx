import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SnippetCard from "@/components/SnippetCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MySnippets = () => {
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchMySnippets(user.id);
  };

  const fetchMySnippets = async (userId: string) => {
    const { data, error } = await supabase
      .from("snippets")
      .select(`
        *,
        profiles:user_id (username)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching snippets:", error);
    } else {
      setSnippets(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Snippets
            </h1>
            <p className="text-muted-foreground">Manage your code snippets</p>
          </div>
          <Button onClick={() => navigate("/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Snippet
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading snippets...</div>
        ) : snippets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any snippets yet</p>
            <Button onClick={() => navigate("/create")}>Create Your First Snippet</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                id={snippet.id}
                title={snippet.title}
                description={snippet.description}
                language={snippet.language}
                tags={snippet.tags}
                createdAt={snippet.created_at}
                username={snippet.profiles?.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySnippets;
