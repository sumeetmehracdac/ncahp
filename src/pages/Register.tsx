import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Lock,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import ncahpLogo from '@/assets/ncahp-logo.png';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'Japan', 'South Korea', 'Singapore', 'UAE', 'Saudi Arabia',
  'Nepal', 'Bangladesh', 'Sri Lanka', 'Pakistan', 'Other'
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  emailOtp: string;
  phone: string;
  phoneOtp: string;
  gender: string;
  dateOfBirth: string;
  isIndian: string;
  country: string;
  password: string;
  confirmPassword: string;
}

const steps = [
  { id: 1, title: 'Your Name', icon: User, fields: ['firstName', 'lastName'] },
  { id: 2, title: 'Email Address', icon: Mail, fields: ['email', 'emailOtp'] },
  { id: 3, title: 'Phone Number', icon: Phone, fields: ['phone', 'phoneOtp'] },
  { id: 4, title: 'Gender', icon: User, fields: ['gender'] },
  { id: 5, title: 'Date of Birth', icon: Calendar, fields: ['dateOfBirth'] },
  { id: 6, title: 'Nationality', icon: Globe, fields: ['isIndian', 'country'] },
  { id: 7, title: 'Create Password', icon: Lock, fields: ['password', 'confirmPassword'] },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    emailOtp: '',
    phone: '',
    phoneOtp: '',
    gender: '',
    dateOfBirth: '',
    isIndian: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendEmailOtp = () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    setEmailOtpSent(true);
    toast({ title: 'OTP sent to your email', description: 'Please check your inbox' });
  };

  const verifyEmailOtp = () => {
    if (formData.emailOtp.length === 6) {
      setEmailVerified(true);
      toast({ title: 'Email verified successfully!', description: 'You can proceed to the next step' });
    } else {
      toast({ title: 'Invalid OTP', variant: 'destructive' });
    }
  };

  const sendPhoneOtp = () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast({ title: 'Please enter a valid phone number', variant: 'destructive' });
      return;
    }
    setPhoneOtpSent(true);
    toast({ title: 'OTP sent to your phone', description: 'Please check your messages' });
  };

  const verifyPhoneOtp = () => {
    if (formData.phoneOtp.length === 6) {
      setPhoneVerified(true);
      toast({ title: 'Phone verified successfully!', description: 'You can proceed to the next step' });
    } else {
      toast({ title: 'Invalid OTP', variant: 'destructive' });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim();
      case 2:
        return emailVerified;
      case 3:
        return phoneVerified;
      case 4:
        return formData.gender !== '';
      case 5:
        return formData.dateOfBirth !== '';
      case 6:
        return formData.isIndian !== '' && (formData.isIndian === 'yes' || formData.country !== '');
      case 7:
        return formData.password.length >= 8 && formData.password === formData.confirmPassword;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({ 
      title: 'Registration Successful!', 
      description: 'Welcome to NCAHP. You can now login to your account.' 
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                What's your name?
              </h2>
              <p className="text-sm text-muted-foreground">Let's start with the basics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="h-10 text-sm bg-background border-border"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="h-10 text-sm bg-background border-border"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                What's your email?
              </h2>
              <p className="text-sm text-muted-foreground">We'll send you a verification code</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-10 text-sm flex-1 bg-background border-border"
                    disabled={emailOtpSent}
                  />
                  <Button 
                    onClick={sendEmailOtp} 
                    disabled={emailOtpSent}
                    className="h-10 px-4 text-sm bg-primary hover:bg-primary/90"
                  >
                    {emailOtpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {emailOtpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="emailOtp" className="text-sm font-medium">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="emailOtp"
                        placeholder="Enter 6-digit OTP"
                        value={formData.emailOtp}
                        onChange={(e) => updateFormData('emailOtp', e.target.value.slice(0, 6))}
                        className="h-10 text-base tracking-[0.3em] text-center flex-1 bg-background border-border font-mono"
                        maxLength={6}
                        disabled={emailVerified}
                      />
                      <Button 
                        onClick={verifyEmailOtp}
                        disabled={emailVerified || formData.emailOtp.length !== 6}
                        className={`h-10 px-4 text-sm ${emailVerified ? 'bg-accent' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {emailVerified ? <Check className="h-4 w-4" /> : 'Verify'}
                      </Button>
                    </div>
                    {emailVerified && (
                      <p className="text-accent text-sm flex items-center gap-1.5 mt-1">
                        <Check className="h-4 w-4" /> Email verified successfully
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                What's your phone number?
              </h2>
              <p className="text-sm text-muted-foreground">We'll verify it with an OTP</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center h-10 px-3 bg-muted rounded-md border border-border text-muted-foreground text-sm font-medium">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="h-10 text-sm flex-1 bg-background border-border"
                    disabled={phoneOtpSent}
                  />
                  <Button 
                    onClick={sendPhoneOtp} 
                    disabled={phoneOtpSent}
                    className="h-10 px-4 text-sm bg-primary hover:bg-primary/90"
                  >
                    {phoneOtpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {phoneOtpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="phoneOtp" className="text-sm font-medium">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phoneOtp"
                        placeholder="Enter 6-digit OTP"
                        value={formData.phoneOtp}
                        onChange={(e) => updateFormData('phoneOtp', e.target.value.slice(0, 6))}
                        className="h-10 text-base tracking-[0.3em] text-center flex-1 bg-background border-border font-mono"
                        maxLength={6}
                        disabled={phoneVerified}
                      />
                      <Button 
                        onClick={verifyPhoneOtp}
                        disabled={phoneVerified || formData.phoneOtp.length !== 6}
                        className={`h-10 px-4 text-sm ${phoneVerified ? 'bg-accent' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {phoneVerified ? <Check className="h-4 w-4" /> : 'Verify'}
                      </Button>
                    </div>
                    {phoneVerified && (
                      <p className="text-accent text-sm flex items-center gap-1.5 mt-1">
                        <Check className="h-4 w-4" /> Phone verified successfully
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                What's your gender?
              </h2>
              <p className="text-sm text-muted-foreground">Select your gender identity</p>
            </div>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              className="grid grid-cols-3 gap-3"
            >
              {['Male', 'Female', 'Other'].map((gender) => (
                <Label
                  key={gender}
                  htmlFor={gender}
                  className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.gender === gender.toLowerCase()
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={gender.toLowerCase()} id={gender} className="sr-only" />
                  <span className="text-sm font-medium">{gender}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                When were you born?
              </h2>
              <p className="text-sm text-muted-foreground">Enter your date of birth</p>
            </div>
            <div className="max-w-xs mx-auto space-y-1.5">
              <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                className="h-10 text-sm bg-background border-border"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                Are you an Indian citizen?
              </h2>
              <p className="text-sm text-muted-foreground">Select your nationality status</p>
            </div>
            <RadioGroup
              value={formData.isIndian}
              onValueChange={(value) => {
                updateFormData('isIndian', value);
                if (value === 'yes') updateFormData('country', '');
              }}
              className="grid grid-cols-2 gap-3 max-w-sm mx-auto"
            >
              {[
                { value: 'yes', label: 'Yes, I am Indian' },
                { value: 'no', label: 'No, I am not' }
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.isIndian === option.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <span className="text-sm font-medium">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
            
            <AnimatePresence>
              {formData.isIndian === 'no' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-w-sm mx-auto space-y-1.5"
                >
                  <Label className="text-sm font-medium">Select your country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger className="h-10 text-sm bg-background border-border">
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country} className="text-sm py-2">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                Create a secure password
              </h2>
              <p className="text-sm text-muted-foreground">At least 8 characters long</p>
            </div>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="h-10 text-sm bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="h-10 text-sm bg-background border-border"
                />
              </div>
              {formData.password && formData.confirmPassword && (
                <p className={`text-sm flex items-center gap-1.5 ${
                  formData.password === formData.confirmPassword ? 'text-accent' : 'text-destructive'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <><Check className="h-4 w-4" /> Passwords match</>
                  ) : (
                    'Passwords do not match'
                  )}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
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
              Already registered?
            </span>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Create Your Account
              </h1>
              <p className="text-muted-foreground mt-1">
                Step {currentStep} of {steps.length} — {steps[currentStep - 1].title}
              </p>
            </div>
            <span className="text-lg font-semibold text-primary">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : isCurrent 
                          ? 'border-primary text-primary bg-primary/10' 
                          : 'border-border text-muted-foreground bg-muted'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs text-center hidden lg:block max-w-[80px] ${
                    isCurrent ? 'text-primary font-semibold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-card border border-primary/15 rounded-xl shadow-lg overflow-hidden">
            {/* Form Content */}
            <div className="p-6 md:p-8">
              <div className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 md:px-8 py-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                
                {currentStep === steps.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    Complete Registration <Sparkles className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By registering, you agree to the NCAHP{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
