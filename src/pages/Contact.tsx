import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact <span className="text-primary">Campus Bites</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions, feedback, or need help? We're here for you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input placeholder="John" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input placeholder="Doe" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john.doe@university.edu" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Order inquiry, feedback, etc." className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md resize-none h-32"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-8">
                    Choose the best way to reach us. Our support team is ready to help 
                    with orders, account questions, or any feedback you'd like to share.
                  </p>
                </div>

                <div className="grid gap-6">
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Phone Support</h3>
                        <p className="text-muted-foreground mb-2">Call us for immediate assistance</p>
                        <p className="font-medium">(555) 123-BITE</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Email Support</h3>
                        <p className="text-muted-foreground mb-2">Send us an email anytime</p>
                        <p className="font-medium">support@campusbites.com</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Live Chat</h3>
                        <p className="text-muted-foreground mb-2">Chat with our support team</p>
                        <Button variant="outline" size="sm">Start Chat</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Business Hours</h3>
                        <div className="text-muted-foreground space-y-1">
                          <p>Monday - Friday: 7:00 AM - 11:00 PM</p>
                          <p>Saturday - Sunday: 8:00 AM - 10:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Locations */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Campus Locations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Main Campus</h3>
                    <p className="text-muted-foreground">
                      Student Union Building<br />
                      Room 150<br />
                      University Avenue
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">North Campus</h3>
                    <p className="text-muted-foreground">
                      Library Food Court<br />
                      Lower Level<br />
                      Scholar's Way
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">South Campus</h3>
                    <p className="text-muted-foreground">
                      Recreation Center<br />
                      Wellness Hub<br />
                      Athletic Drive
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};