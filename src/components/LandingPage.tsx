import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Users, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import logo from './assets/logo.jpg';


interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl">CivicCare</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button onClick={onLoginClick} className="bg-primary hover:bg-primary/90">
                Admin Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4">
                Global Civic Solutions
              </Badge>
              <h1 className="text-4xl lg:text-5xl mb-6 text-foreground">
                Building Better Cities Through
                <span className="text-primary block">Smart Civic Management</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                CivicCare is a municipal corporation dedicated to transforming urban infrastructure 
                through innovative technology solutions. We partner with governments worldwide to 
                streamline civic issue reporting and resolution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={onLoginClick}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1681115481690-e7c1209d528d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwaW5mcmFzdHJ1Y3R1cmUlMjBidWlsZGluZ3N8ZW58MXx8fHwxNzU4MzE2NjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern city infrastructure"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2 text-primary">50+</div>
              <p className="text-muted-foreground">Cities Served</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-primary">100K+</div>
              <p className="text-muted-foreground">Issues Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-primary">24/7</div>
              <p className="text-muted-foreground">Support Available</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-primary">98%</div>
              <p className="text-muted-foreground">Resolution Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To create smarter, more responsive cities by connecting citizens directly with 
              government departments through innovative technology solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Citizen-Centric",
                description: "Empowering citizens to report issues quickly and track resolution progress in real-time."
              },
              {
                icon: CheckCircle,
                title: "Efficient Resolution",
                description: "Streamlined workflows that connect reports directly to the right department specialists."
              },
              {
                icon: Clock,
                title: "Real-Time Tracking",
                description: "Complete transparency with live updates on issue status and resolution timeline."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-3xl mb-4">Departments We Serve</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive coverage across all essential civic services
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {[
              "Electrical", 
              "Sanitation", 
              "Road & Infrastructure", 
              "Water Supply",
              "Public Safety",
              "Transportation",
              "Environmental",
              "Parks & Recreation"
            ].map((dept, index) => (
              <Card key={index} className="p-4 text-center hover:bg-accent/50 transition-colors duration-200">
                <span className="text-sm">{dept}</span>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h2 className="text-3xl mb-6">Ready to Transform Your City?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of administrators worldwide who trust CivicCare to manage their civic infrastructure.
          </p>
          <Button size="lg" onClick={onLoginClick} className="bg-primary hover:bg-primary/90">
            Access Admin Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CivicCare International. Building smarter cities worldwide.</p>
        </div>
      </footer>
    </div>
  );
};