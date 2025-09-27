'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ShoppingBag, Users, Shield } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        // Seed database first
        await fetch('/api/seed');
        
        // Load featured products
        const response = await fetch('/api/products?featured=true&limit=3');
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        // Show success message or update UI
        alert('Item added to cart!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-hero py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl sm:tracking-tight lg:text-7xl drop-shadow-lg">
            Welcome to{' '}
            <span className="block text-gradient-primary bg-white bg-clip-text text-transparent">
              QuickCart
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90 leading-relaxed">
            {session 
              ? `Welcome back, ${session.user.name || session.user.email.split('@')[0]}! Discover amazing products with our premium shopping experience.`
              : 'Experience the future of online shopping with premium products, lightning-fast delivery, and unmatched customer service.'
            }
          </p>
          
          <div className="mt-10 flex justify-center space-x-6">
            {session ? (
              <Link href="/products">
                <Button size="lg" className="gradient-primary hover:shadow-glow hover-lift text-white border-0 px-8 py-4 text-lg">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  <span>Browse Products</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-6">
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" className="gradient-accent hover:shadow-glow-accent hover-lift text-white border-0 px-8 py-4 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose QuickCart?</h2>
            <p className="mt-4 text-muted-foreground">Experience the best online shopping with our premium features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-lift hover:shadow-glow border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gradient-primary">Fast Shopping</h3>
                <p className="text-muted-foreground leading-relaxed">Quick and easy checkout process with secure payments and lightning-fast delivery</p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift hover:shadow-glow-accent border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="gradient-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow-accent">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gradient-accent">Trusted by Thousands</h3>
                <p className="text-muted-foreground leading-relaxed">Join our growing community of satisfied customers from around the globe</p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift hover:shadow-glow border-0 gradient-card">
              <CardContent className="p-8 text-center">
                <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gradient-primary">Secure & Safe</h3>
                <p className="text-muted-foreground leading-relaxed">Your data and payments are protected with enterprise-grade security measures</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="mt-4 text-muted-foreground">Discover our most popular items</p>
          </div>

          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden group hover-lift hover:shadow-glow border-0 gradient-card">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                      <Badge className="gradient-primary text-white border-0 shadow-sm">{product.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {product.description.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gradient-primary">
                        ${product.price}
                      </span>
                      <div className="flex space-x-2">
                        <Link href={`/products/${product._id}`}>
                          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                            View
                          </Button>
                        </Link>
                        <Button 
                          size="sm"
                          className="gradient-primary hover:shadow-glow text-white border-0"
                          onClick={() => addToCart(product._id)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of customers who trust QuickCart for their online shopping needs.
          </p>
          {!session && (
            <Link href="/auth/signup">
              <Button size="lg">
                Create Your Account Today
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}