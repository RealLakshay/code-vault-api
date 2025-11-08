import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchSnippet();
    getCurrentUser();
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchSnippet = async () => {
    const { data, error } = await supabase
      .from("snippets")
      .select(`
        *,
        profiles:user_id (username)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching snippet:", error);
      toast.error("Failed to load snippet");
      navigate("/snippets");
    } else {
      setSnippet(data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("snippets").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete snippet");
    } else {
      toast.success("Snippet deleted successfully");
      navigate("/my-snippets");
    }
  };

  const isOwner = currentUser?.id === snippet?.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center text-muted-foreground">
          Loading snippet...
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <Card className="border-border bg-card p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
              {snippet.description && (
                <p className="text-muted-foreground">{snippet.description}</p>
              )}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/edit/${snippet.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this snippet? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="border-primary/30">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{snippet.profiles?.username || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(snippet.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>

          <CodeBlock code={snippet.code} language={snippet.language} />
        </Card>
      </div>
    </div>
  );
};

export default SnippetDetail;
