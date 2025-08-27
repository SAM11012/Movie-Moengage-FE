import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { resetMovieState } from "@/store/movieSlice";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "../lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface AvatarMenuProps {
  userName?: string;
  userEmail?: string;
}

export default function AvatarMenu({
  userName = "User",
  userEmail = "user@example.com",
}: AvatarMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.user.token);

  const handleLogout = async () => {
    try {
      await axios.post(
        API_ENDPOINTS.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(clearUser());
      dispatch(resetMovieState());
      localStorage.removeItem("movieflix-user");
      window.location.href = "/";
    } catch (error) {
      // Optionally handle error (e.g., show a toast)
      console.error("Logout failed", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand-red text-white font-medium">
              {getUserInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="w-[200px] truncate font-medium text-foreground ">
              {userEmail}
            </p>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
