import { Button } from "./ui/button";
import { ArrowRight, Clock, Star, TruckIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-primary">
                Campus Bites
              </span>
              <br />
              <span className="text-foreground">Delivered Fast</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Order from our campus menu and get your favorite meals delivered hot and fresh. 
              Skip the queue, save time, and enjoy your food!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">15-30 min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm">4.8 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-primary" />
                <span className="text-sm">Free delivery</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link to="/menu">
                <Button variant="hero" size="lg" className="group">
                  Order Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" size="lg">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-3xl"></div>
            <img
              src="/hero-food.jpg"
              alt="Campus Bites food"
              className="relative rounded-3xl shadow-2xl w-full h-auto border border-border/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};