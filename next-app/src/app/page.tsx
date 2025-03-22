'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, BrainCircuit, Sparkle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-pattern">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">Study Dash</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="outline" className="rounded-full px-6">Log in</Button>
            </Link>
            <Link href="/auth">
              <Button className="rounded-full px-6 shadow-soft">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
                Manage your studies, <span className="text-primary">effortlessly</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 animate-slide-up animate-delay-100">
                Organize your courses, manage materials, and enhance your learning experience with AI-powered summaries and quizzes.
              </p>
              <Link href="/auth">
                <Button size="lg" className="rounded-full px-8 shadow-soft animate-slide-up animate-delay-200">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animate-delay-300">
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Course Management</h3>
                <p className="text-muted-foreground">Keep track of all your courses, lectures, and materials in one organized place.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Schedule Planning</h3>
                <p className="text-muted-foreground">Set up your weekly schedule with lectures, tutorials, and study sessions.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-soft">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-muted-foreground">Generate summaries from uploaded materials and practice with auto-generated quizzes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Study Dash Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Study Dash streamlines your academic journey with powerful tools designed for students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg border shadow-soft">
                <h3 className="text-xl font-semibold mb-4">Upload & Organize</h3>
                <p className="text-muted-foreground mb-4">
                  Easily upload your lecture materials, syllabi, and notes. Study Dash keeps everything organized by course and topic.
                </p>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Upload Interface Preview</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg border shadow-soft">
                <h3 className="text-xl font-semibold mb-4">Test Your Knowledge</h3>
                <p className="text-muted-foreground mb-4">
                  Practice with automatically generated quizzes based on your course materials at various difficulty levels.
                </p>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Quiz Interface Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your learning experience?</h2>
            <p className="text-muted-foreground mb-8">
              Join Study Dash today and take your academic organization to the next level.
            </p>
            <Link href="/auth">
              <Button size="lg" className="rounded-full px-8 shadow-soft">
                Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Study Dash</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Study Dash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 