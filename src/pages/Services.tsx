import { Briefcase, GraduationCap, BookOpen, Award, Shield, Coins } from 'lucide-react';

export function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive blockchain-powered educational solutions for students and institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <GraduationCap className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Verified Credentials</h2>
            <p className="text-gray-600 mb-4">
              Secure and immutable academic credentials stored on the blockchain
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Digital Certificates
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Skill Badges
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Achievement Tracking
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Briefcase className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Career Development</h2>
            <p className="text-gray-600 mb-4">
              AI-powered career guidance and job matching services
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Job Matching
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Skills Assessment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Career Planning
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Learning Platform</h2>
            <p className="text-gray-600 mb-4">
              Comprehensive online learning environment with blockchain integration
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Interactive Courses
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Progress Tracking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Peer Learning
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Award className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Scholarships</h2>
            <p className="text-gray-600 mb-4">
              DeFi-powered scholarship and funding opportunities
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Merit-based Awards
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Research Grants
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Study Abroad
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Shield className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Security Services</h2>
            <p className="text-gray-600 mb-4">
              Robust security measures for educational data and transactions
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Data Protection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Smart Contracts
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Identity Verification
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Coins className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Financial Services</h2>
            <p className="text-gray-600 mb-4">
              Blockchain-based financial solutions for education
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Student Loans
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Payment Plans
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Token Rewards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}