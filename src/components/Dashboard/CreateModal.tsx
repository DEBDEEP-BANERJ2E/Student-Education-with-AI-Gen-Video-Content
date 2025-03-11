import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  type: 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects';
}

export function CreateModal({ isOpen, onClose, onSubmit, type }: CreateModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    requirements: '',
    location: '',
    type: 'remote',
    duration: '',
    compensation: '',
    skills: '',
    video_url: '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setUploadError('Please select a valid video file');
        return;
      }
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('Video file must be less than 100MB');
        return;
      }
      setVideoFile(file);
      setUploadError(null);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;
    
    try {
      setIsUploading(true);
      setUploadError(null);

      // Create bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.createBucket('course-videos', {
        public: true,
        allowedMimeTypes: ['video/mp4', 'video/webm'],
        fileSizeLimit: 100 * 1024 * 1024, // 100MB
      });

      if (bucketError && bucketError.message !== 'Bucket already exists') {
        throw bucketError;
      }

      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from('course-videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload video');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let videoUrl = '';
    if (type === 'courses' && videoFile) {
      videoUrl = await uploadVideo() || '';
      if (!videoUrl && uploadError) return;
    }

    const skills = formData.skills.split(',').map(skill => skill.trim());
    
    onSubmit({
      ...formData,
      skills,
      video_url: videoUrl,
    });

    setFormData({
      title: '',
      organization: '',
      description: '',
      requirements: '',
      location: '',
      type: 'remote',
      duration: '',
      compensation: '',
      skills: '',
      video_url: '',
    });
    setVideoFile(null);
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'jobs': return 'Create New Job Listing';
      case 'internships': return 'Create New Internship';
      case 'courses': return 'Create New Course';
      case 'scholarships': return 'Create New Scholarship';
      case 'projects': return 'Create New Project';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {type === 'courses' ? 'Instructor/Institution' : 'Organization'}
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {type === 'courses' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Course Video
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      MP4, WebM up to 100MB
                    </p>
                  </div>
                </div>
                {videoFile && (
                  <p className="mt-2 text-sm text-gray-300">
                    Selected: {videoFile.name}
                  </p>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-red-400">{uploadError}</p>
                )}
              </div>
            )}

            {type !== 'projects' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {(type === 'jobs' || type === 'internships') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </>
            )}

            {(type === 'internships' || type === 'courses' || type === 'scholarships') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder={type === 'courses' ? 'e.g., 12 weeks' : 'e.g., 6 months'}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {(type === 'jobs' || type === 'internships' || type === 'scholarships') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {type === 'scholarships' ? 'Grant Amount' : 'Compensation'}
                </label>
                <input
                  type="text"
                  name="compensation"
                  value={formData.compensation}
                  onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                  placeholder="e.g., $5000"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., Solidity, React, Node.js (comma separated)"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}