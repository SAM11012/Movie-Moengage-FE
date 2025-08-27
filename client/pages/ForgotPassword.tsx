import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5173/api/auth/forgot-password", {
        email,
        newPassword,
      });
      toast.success("Password reset successful!");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Failed to reset password.");
        toast.error("Failed to reset password.");
      }
    } finally {
      setLoading(false);
      navigate('/')
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen`}
    >
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="new-password" className="mb-2 block">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password" className="mb-2 block">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Confirm new password"
            />
          </div>
          {error && (
            <div className="text-green-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
