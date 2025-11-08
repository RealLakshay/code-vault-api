import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface SnippetCardProps {
  id: string;
  title: string;
  description?: string;
  language: string;
  tags: string[];
  createdAt: string;
  username?: string;
}

const SnippetCard = ({
  id,
  title,
  description,
  language,
  tags,
  createdAt,
  username,
}: SnippetCardProps) => {
  return (
    <Link to={`/snippet/${id}`}>
      <Card className="group h-full overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <div className="ml-4 rounded-lg bg-primary/10 p-2">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-secondary/50">
              {language}
            </Badge>
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="border-primary/30">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="border-primary/30">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {username && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{username}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SnippetCard;
