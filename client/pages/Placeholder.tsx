import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  backLink?: string;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  backLink = "/" 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} backLink={backLink} backText="Back" showActions={false} />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-4xl font-bold">M</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <p className="text-muted-foreground mb-4">
              This page is coming soon! Continue prompting to have me fill in the content for this section.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={backLink}>
                <Button className="bg-brand-red hover:bg-brand-red-hover text-white">
                  Go Back
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
