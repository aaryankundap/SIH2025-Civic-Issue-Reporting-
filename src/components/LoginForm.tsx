import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, User, Mail, Lock, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Admin } from '../App';

interface LoginFormProps {
  onLoginSuccess: (admin: Admin) => void;
  onBack: () => void;
}

const departments = [
  'Electrical',
  'Sanitation',
  'Road & Infrastructure',
  'Water Supply',
  'Public Safety',
  'Transportation',
  'Environmental',
  'Parks & Recreation'
];

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onBack }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      // Login validation
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }
    } else {
      // Signup validation
      if (!formData.name || !formData.email || !formData.password || !formData.department) {
        toast.error('Please fill in all fields');
        return;
      }
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLoginMode ? 'http://localhost:5000/api/admin/login' : 'http://localhost:5000/api/admin/signup';
      const requestBody = isLoginMode
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, department: formData.department };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        onLoginSuccess({
          name: data.admin.name,
          email: data.admin.email,
          department: data.admin.department
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      department: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>

            <div className="text-center">
              <motion.div
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Building className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <CardTitle className="text-2xl">
                {isLoginMode ? 'Admin Login' : 'Admin Signup'}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {isLoginMode
                  ? 'Access your department dashboard'
                  : 'Create your admin account'
                }
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLoginMode && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12"
                    disabled={loading}
                  />
                </motion.div>
              )}

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@civiccare.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </motion.div>

              {!isLoginMode && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Label className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange('department', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {isLoginMode ? 'Logging in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLoginMode ? 'Login to Dashboard' : 'Create Account'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto text-primary hover:text-primary/80"
                  onClick={toggleMode}
                >
                  {isLoginMode ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </motion.div>

            <motion.div
              className="mt-4 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <p>Secure access for authorized personnel only</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
