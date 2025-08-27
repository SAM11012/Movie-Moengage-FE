import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import AvatarMenu from "@/components/AvatarMenu";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface HeaderProps {
  showBackButton?: boolean;
  backLink?: string;
  backText?: string;
  title?: string;
  showActions?: boolean;
}

export default function Header({
  showBackButton = false,
  backLink = "/",
  backText = "Back",
  title,
  showActions = true,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back button or logo */}
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <Link
                to={backLink}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{backText}</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">M</span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  MovieFlix
                </span>
              </Link>
            )}
            {title && (
              <span className="text-xl font-bold text-foreground">{title}</span>
            )}
          </div>

          {/* Center - Logo when back button is shown */}
          {/* {showBackButton && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">M</span>
              </div>
              <span className="text-xl font-bold text-foreground">MovieFlix</span>
            </div>
          )} */}

          {/* Right side actions */}
          {showActions && (
            <div className="flex items-center space-x-4">
              <Link to="/analytics">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Stats
                </Button>
              </Link>
              {/* Show AvatarMenu if user is logged in, else show Login button */}
              {(() => {
                const user = useSelector((state: RootState) => state.user.user);
                if (user) {
                  return (
                    <AvatarMenu
                      userName={user.id ? user.role : "MovieFlix User"}
                      userEmail={user.email ? user.email : "user@movieflix.com"}
                    />
                  );
                } else {
                  return (
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3"
                      >
                        Login
                      </Button>
                    </Link>
                  );
                }
              })()}
            </div>
          )}

          {/* Spacer when showing back button */}
          {showBackButton && !showActions && <div className="w-20"></div>}
        </div>
      </div>
    </header>
  );
}
