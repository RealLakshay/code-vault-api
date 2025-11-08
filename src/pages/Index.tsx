import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Code2, Sparkles, Lock, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <Navbar />
      
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Your Personal Code Library</span>
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            Store & Share
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Code Snippets
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Keep your code organized, searchable, and accessible. Share snippets with the community or keep them private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/snippets">
              <Button size="lg" className="text-lg px-8">
                Browse Snippets
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <div className="mb-4 rounded-lg bg-primary/10 w-fit p-3">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Organize Efficiently</h3>
            <p className="text-muted-foreground">
              Tag and categorize your snippets by language, framework, or project for quick access.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <div className="mb-4 rounded-lg bg-accent/10 w-fit p-3">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Public or Private</h3>
            <p className="text-muted-foreground">
              Choose to share your snippets with the community or keep them for personal use only.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <div className="mb-4 rounded-lg bg-primary/10 w-fit p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Powerful search and filtering to find exactly what you need in seconds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
