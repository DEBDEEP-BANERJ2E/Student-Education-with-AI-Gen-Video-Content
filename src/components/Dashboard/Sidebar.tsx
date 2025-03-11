import { BookOpen, Briefcase, GraduationCap, Layout, Award, FolderGit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Job Matching', icon: Briefcase, href: '/dashboard/jobs' },
  { name: 'Internships', icon: Layout, href: '/dashboard/internships' },
  { name: 'Courses', icon: BookOpen, href: '/dashboard/courses' },
  { name: 'Scholarships', icon: Award, href: '/dashboard/scholarships' },
  { name: 'Projects', icon: FolderGit2, href: '/dashboard/projects' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-800 border-r border-gray-700 w-64">
      <div 
        className="flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => navigate('/')}
      >
        <GraduationCap className="h-8 w-8 text-indigo-400" />
        <span className="ml-2 text-xl font-bold text-white">VeriLearn</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}