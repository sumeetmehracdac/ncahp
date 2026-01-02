import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Calendar, Type, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import FileUploadZone from '@/components/announcements/FileUploadZone';
import RichTextEditor from '@/components/announcements/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(150, 'Title must be under 150 characters'),
  punchline: z.string().min(10, 'Punchline must be at least 10 characters').max(100, 'Punchline must be under 100 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters').max(2000, 'Content must be under 2000 characters'),
  fromDate: z.date({ required_error: 'Start date is required' }),
  toDate: z.date({ required_error: 'End date is required' }),
}).refine((data) => data.toDate >= data.fromDate, {
  message: 'End date must be after start date',
  path: ['toDate'],
});

const AnnouncementSubmit = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      punchline: '',
      content: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form data:', data);
    console.log('Files:', files);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: 'Announcement Submitted',
      description: 'Your announcement has been submitted for review.',
    });
  };

  const steps = [
    { icon: Type, label: 'Title & Punchline', completed: !!form.watch('title') && !!form.watch('punchline') },
    { icon: FileText, label: 'Content', completed: !!form.watch('content') },
    { icon: Calendar, label: 'Date Range', completed: !!form.watch('fromDate') && !!form.watch('toDate') },
    { icon: Sparkles, label: 'Documents', completed: files.length > 0 },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Header />
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="h-12 w-12 text-success" />
            </motion.div>
            
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Submission Successful!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your announcement has been submitted and is pending review. You will be notified once it's approved and published.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/announcements">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Announcements
                </Button>
              </Link>
              <Button onClick={() => { setIsSubmitted(false); form.reset(); setFiles([]); }} className="bg-primary hover:bg-primary-dark text-primary-foreground">
                Submit Another
              </Button>
            </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-primary py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/announcements" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Announcements
          </Link>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Submit Announcement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl"
          >
            Create a new official announcement to be published on the NCAHP portal.
          </motion.p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-background border-b border-border sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-8 overflow-x-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  step.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className={cn(
                  'text-sm font-medium hidden md:block',
                  step.completed ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'w-8 md:w-12 h-0.5 rounded-full',
                    step.completed ? 'bg-success' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Title & Punchline Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Type className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Title & Punchline</h2>
                      <p className="text-sm text-muted-foreground">Capture attention with a clear headline</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Announcement Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., New Registration Portal Launch for Allied Health Professionals"
                              className="h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value.length}/150 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="punchline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Punchline / Tagline</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Streamlined digital registration process now available nationwide"
                              className="h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A catchy one-liner that summarizes the announcement ({field.value.length}/100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Announcement Content</h2>
                      <p className="text-sm text-muted-foreground">Provide detailed information</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Write the full announcement content here. Include all relevant details, instructions, and important information..."
                            maxLength={2000}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Date Range Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Validity Period</h2>
                      <p className="text-sm text-muted-foreground">Set active dates for "New" badge visibility</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'h-12 rounded-xl justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, 'PPP') : 'Select start date'}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'h-12 rounded-xl justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, 'PPP') : 'Select end date'}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => form.watch('fromDate') ? date < form.watch('fromDate') : false}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Announcement will show "New" badge until this date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>

                {/* Documents Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Attach Documents</h2>
                      <p className="text-sm text-muted-foreground">Upload supporting files (optional)</p>
                    </div>
                  </div>

                  <FileUploadZone
                    files={files}
                    onFilesChange={setFiles}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-end"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/announcements')}
                    className="h-12 px-6 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground font-semibold shadow-primary"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Announcement
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AnnouncementSubmit;
