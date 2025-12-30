import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ncahpLogo from '@/assets/ncahp-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    
    // Placeholder login logic
    toast({ title: 'Login successful!' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header Bar */}
      <header className="bg-primary text-primary-foreground py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={ncahpLogo} alt="NCAHP" className="h-10" />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg">NCAHP</span>
              <p className="text-xs text-primary-foreground/70">Government of India</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80 hidden md:inline">
              New user?
            </span>
            <Link to="/register">
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your NCAHP account
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-card border border-primary/15 rounded-2xl shadow-lg p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base bg-background border-border"
                    autoFocus
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base bg-background border-border"
                  />
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Captcha Placeholder */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Security Verification
                  </Label>
                  <div className="h-20 bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Captcha will appear here</span>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Register now
                  </Link>
                </p>
              </div>
            </div>

            {/* Helper Text */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              By logging in, you agree to the NCAHP{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
