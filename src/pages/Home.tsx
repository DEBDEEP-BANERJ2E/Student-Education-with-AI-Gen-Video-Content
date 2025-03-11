import { ArrowRight, LogIn, BookOpen, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Welcome to <span className="text-indigo-600">VeriLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            An integrated platform combining AI, blockchain, and DeFi to enhance your learning journey and career growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/auth?mode=login"
              className="inline-flex items-center px-8 py-3 border-2 border-indigo-600 text-base font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Login
              <LogIn className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              AI-powered personalized learning paths tailored to your needs and goals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Briefcase className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
            <p className="text-gray-600">
              Connect with opportunities through our decentralized job matching platform.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <GraduationCap className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Skill Verification</h3>
            <p className="text-gray-600">
              Blockchain-powered credentials and achievements as verifiable NFTs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Award className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">DeFi Scholarships</h3>
            <p className="text-gray-600">
              Access decentralized funding and scholarship opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}