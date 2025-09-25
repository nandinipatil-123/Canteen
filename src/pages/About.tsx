import { Clock, Users, Award, Heart } from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">Campus Bites</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Revolutionizing campus dining with fresh, fast, and delicious meals 
              delivered right to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2023 by a group of university students who were tired of long 
                  cafeteria lines and limited food options, Campus Bites was born from a 
                  simple idea: great food shouldn't be hard to get.
                </p>
                <p className="text-muted-foreground mb-4">
                  We partnered with local campus kitchens and talented chefs to create a 
                  diverse menu that caters to every taste and dietary requirement. From 
                  traditional comfort foods to healthy options and international cuisines, 
                  we've got something for everyone.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to serve thousands of students, faculty, and staff 
                  across multiple campuses, delivering not just meals, but convenience, 
                  quality, and community connection.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/hero-food.jpg"
                  alt="Campus Bites story"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-background rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Speed</h3>
                <p className="text-muted-foreground">
                  Lightning-fast delivery and preparation times so you spend less time waiting 
                  and more time enjoying.
                </p>
              </div>
              
              <div className="text-center p-6 bg-background rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  Premium ingredients and expert preparation ensure every bite meets our 
                  high standards for taste and nutrition.
                </p>
              </div>

              <div className="text-center p-6 bg-background rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We're more than a food service - we're part of the campus community, 
                  supporting student life and academic success.
                </p>
              </div>

              <div className="text-center p-6 bg-background rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Care</h3>
                <p className="text-muted-foreground">
                  Every meal is prepared with care, considering dietary restrictions, 
                  sustainability, and student budgets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Campus Bites by the Numbers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">Happy Students Served</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">15 min</div>
                <div className="text-muted-foreground">Average Delivery Time</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-muted-foreground">Average Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};