import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Briefcase, Layout, BookOpen, Award, FolderGit2, Clock, CheckCircle, XCircle, User, ChevronDown, Trash } from 'lucide-react';
import { useCompletePosting } from '../components/BlockchainPosting';
import { usePosts, Post } from '../hooks/usePosts';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  email: string;
}

interface Application {
  id: string;
  user_id: string;
  message: string;
  resume_url: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  profiles: Profile;
}

interface PostWithApplications extends Post {
  applications: Application[];
}

export function YourPostings() {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects'>('all');
  const [selectedPosting, setSelectedPosting] = useState<string | null>(null);
  const { completePosting, isLoading: isCompletingOnChain, error: chainError } = useCompletePosting();
  const [completingPosting, setCompletingPosting] = useState<string | null>(null);
  const [postsWithApplications, setPostsWithApplications] = useState<PostWithApplications[]>([]);
  
  const { 
    posts, 
    loading, 
    error: postsError, 
    deletePost,
    updatePost 
  } = usePosts(activeTab === 'all' ? undefined : activeTab, true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const promises = posts.map(async (post) => {
          const { data: applications, error } = await supabase
            .from('applications')
            .select(`
              id,
              user_id,
              message,
              resume_url,
              status,
              created_at,
              profiles (
                id,
                name,
                email
              )
            `)
            .eq('post_id', post.id);

          if (error) throw error;

          return {
            ...post,
            applications: applications || []
          };
        });

        const postsWithApps = await Promise.all(promises);
        setPostsWithApplications(postsWithApps);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    if (posts.length > 0) {
      fetchApplications();
    }
  }, [posts]);

  const handleUpdateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      setPostsWithApplications(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          applications: post.applications.map(app => 
            app.id === applicationId ? { ...app, status } : app
          )
        }))
      );
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleCompletePosting = async (postingId: string) => {
    try {
      setCompletingPosting(postingId);
      await completePosting(postingId);
      
      await updatePost(postingId, { status: 'completed' });
    } catch (err) {
      console.error('Failed to complete posting:', err);
    } finally {
      setCompletingPosting(null);
    }
  };

  const handleRemoveProject = async (postingId: string) => {
    await deletePost(postingId);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'jobs': return Briefcase;
      case 'internships': return Layout;
      case 'courses': return BookOpen;
      case 'scholarships': return Award;
      case 'projects': return FolderGit2;
      default: return Briefcase;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'closed': return 'text-red-400';
      case 'draft': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'all', name: 'All Postings', icon: Briefcase },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'internships', name: 'Internships', icon: Layout },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'scholarships', name: 'Scholarships', icon: Award },
    { id: 'projects', name: 'Projects', icon: FolderGit2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts = activeTab === 'all' 
    ? postsWithApplications 
    : postsWithApplications.filter(posting => posting.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {(chainError || postsError) && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Error: {chainError?.message || postsError}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Postings</h1>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredPosts.map((posting) => (
            <div key={posting.id} className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      {(() => {
                        const Icon = getIcon(posting.type);
                        return <Icon className="h-6 w-6 text-indigo-400" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{posting.title}</h3>
                      <p className="text-gray-400">{posting.organization}</p>
                      <p className="text-gray-500 mt-2">{posting.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`flex items-center ${getStatusColor(posting.status)}`}>
                      <Clock className="h-4 w-4 mr-1" />
                      {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedPosting(selectedPosting === posting.id ? null : posting.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronDown className={`h-5 w-5 transform transition-transform ${
                        selectedPosting === posting.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                {selectedPosting === posting.id && (
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {posting.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      {posting.location && (
                        <p className="text-gray-400">
                          <strong className="text-gray-300">Location:</strong> {posting.location}
                        </p>
                      )}
                      {posting.work_type && (
                        <p className="text-gray-400">
                          <strong className="text-gray-300">Work Type:</strong> {posting.work_type}
                        </p>
                      )}
                      {posting.duration && (
                        <p className="text-gray-400">
                          <strong className="text-gray-300">Duration:</strong> {posting.duration}
                        </p>
                      )}
                      {posting.compensation && (
                        <p className="text-gray-400">
                          <strong className="text-gray-300">Compensation:</strong> {posting.compensation}
                        </p>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-lg font-medium text-white mb-4">
                          Applications ({posting.applications.length})
                        </h4>
                        <div className="space-y-4">
                          {posting.applications.map((application) => (
                            <div key={application.id} className="bg-gray-700 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <User className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-white font-medium">
                                    {application.profiles?.name || application.profiles?.email || 'Anonymous'}
                                  </span>
                                </div>
                                <span className={`flex items-center ${getApplicationStatusColor(application.status)}`}>
                                  {(() => {
                                    const StatusIcon = application.status === 'pending' ? Clock :
                                      application.status === 'accepted' ? CheckCircle :
                                      application.status === 'rejected' ? XCircle :
                                      CheckCircle;
                                    return (
                                      <>
                                        <StatusIcon className="h-4 w-4 mr-1" />
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                      </>
                                    );
                                  })()}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-4">{application.message}</p>
                              {application.resume_url && (
                                <a
                                  href={application.resume_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-300 inline-flex items-center mb-4"
                                >
                                  View Resume
                                </a>
                              )}
                              {application.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              {application.status === 'accepted' && (
                                <button
                                  onClick={() => handleUpdateApplicationStatus(application.id, 'completed')}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Mark as Completed
                                </button>
                              )}
                            </div>
                          ))}
                          {posting.applications.length === 0 && (
                            <p className="text-gray-400 text-center py-4">No applications yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                      <button
                        onClick={() => handleCompletePosting(posting.id)}
                        disabled={isCompletingOnChain || completingPosting === posting.id || posting.status === 'completed'}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                          (isCompletingOnChain || completingPosting === posting.id || posting.status === 'completed') ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {completingPosting === posting.id ? 'Completing...' : 'Complete Posting'}
                      </button>
                      <button
                        onClick={() => handleRemoveProject(posting.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Trash className="h-5 w-5 mr-2" />
                        Remove Posting
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No postings found for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}