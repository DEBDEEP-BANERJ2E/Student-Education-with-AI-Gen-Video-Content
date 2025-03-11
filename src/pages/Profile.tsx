import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useProfile } from '../hooks/useProfile';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Edit, 
  Plus, 
  Star,
  CheckCircle,
  XCircle,
  Save,
  X,
  Loader2,
  Trash2,
  FolderGit2
} from 'lucide-react';
import { AddEducationModal } from '../components/Profile/AddEducationModal';
import { AddExperienceModal } from '../components/Profile/AddExperienceModal';
import { AddProjectModal } from '../components/Profile/AddProjectModal';
import { AddCertificationModal } from '../components/Profile/AddCertificationModal';
import { EditSkillsModal } from '../components/Profile/EditSkillsModal';
import { Education, WorkExperience, Project, Certification, Skills } from '../types/profile';

export function Profile() {
  const { 
    profile, 
    loading, 
    error, 
    updateProfile,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    updateSkills,
    addProject,
    removeProject,
    addCertification,
    removeCertification
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    about: '',
    age: '',
    gender: '',
    work_environment: 'remote' as const,
  });

  const handleEditClick = () => {
    if (!profile) return;
    
    setIsEditing(true);
    setEditForm({
      name: profile.name || '',
      title: profile.title || '',
      location: profile.location || '',
      email: profile.email || '',
      phone: profile.phone || '',
      about: profile.about || '',
      age: profile.age?.toString() || '',
      gender: profile.gender || '',
      work_environment: profile.work_environment,
    });
  };

  const handleSave = async () => {
    const success = await updateProfile({
      ...editForm,
      age: editForm.age ? parseInt(editForm.age) : null,
      verified: false
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleAddEducation = async (education: Education) => {
    await addEducation(education);
    setShowEducationModal(false);
  };

  const handleAddExperience = async (experience: WorkExperience) => {
    await addExperience(experience);
    setShowExperienceModal(false);
  };

  const handleAddProject = async (project: Project) => {
    await addProject(project);
    setShowProjectModal(false);
  };

  const handleAddCertification = async (certification: Certification) => {
    await addCertification(certification);
    setShowCertificationModal(false);
  };

  const handleUpdateSkills = async (skills: Skills) => {
    await updateSkills(skills);
    setShowSkillsModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          No profile found. Please sign in.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Points Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.points || 0}</h2>
              <p className="text-gray-400">Total Points</p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Name"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Location"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Phone"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  placeholder="Age"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  placeholder="Gender"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <select
                  value={editForm.work_environment}
                  onChange={(e) => setEditForm({ ...editForm, work_environment: e.target.value as 'remote' | 'hybrid' | 'in-office' })}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="in-office">In-office</option>
                </select>
                <textarea
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  placeholder="About"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-6">
                  <div className="bg-indigo-600 rounded-full p-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                      {profile.verified ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-400 text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Unverified
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400">{profile.title}</p>
                    <div className="flex items-center mt-2 text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleEditClick}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {profile.phone}
                </div>
                <div className="flex items-center text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  {profile.age ? `${profile.age} years old` : 'Age not specified'} • {profile.gender || 'Gender not specified'}
                </div>
                <div className="flex items-center text-gray-400">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {profile.work_environment.charAt(0).toUpperCase() + profile.work_environment.slice(1)} work
                </div>
              </div>
              <p className="mt-4 text-gray-300">{profile.about}</p>
            </>
          )}
        </div>

        {/* Education Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Education</h2>
            </div>
            <button
              onClick={() => setShowEducationModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </button>
          </div>
          <div className="space-y-6">
            {profile.education?.map((edu, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white">{edu.degree}</h3>
                    <p className="text-gray-400">{edu.institution}</p>
                    <p className="text-gray-500">{edu.year} • {edu.specialization}</p>
                    {edu.gpa && <p className="text-gray-400 mt-1">GPA: {edu.gpa}</p>}
                    {edu.certifications && edu.certifications.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-400">Certifications:</p>
                        <ul className="list-disc list-inside text-gray-400 ml-2">
                          {edu.certifications.map((cert, i) => (
                            <li key={i}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!profile.education || profile.education.length === 0) && (
              <p className="text-gray-400 text-center py-4">No education entries yet</p>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Work Experience</h2>
            </div>
            <button
              onClick={() => setShowExperienceModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {profile.experience?.map((exp, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                    <p className="text-gray-400">{exp.company} • {exp.industry}</p>
                    <p className="text-gray-500">{exp.duration} • {exp.type}</p>
                    <p className="text-gray-300 mt-2">{exp.description}</p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-400">Key Responsibilities:</p>
                        <ul className="list-disc list-inside text-gray-400 ml-2">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!profile.experience || profile.experience.length === 0) && (
              <p className="text-gray-400 text-center py-4">No experience entries yet</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Code className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Skills</h2>
            </div>
            <button
              onClick={() => setShowSkillsModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Skills
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.technical.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.soft.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.languages.map((language, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FolderGit2 className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Projects</h2>
            </div>
            <button
              onClick={() => setShowProjectModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </button>
          </div>
          <div className="space-y-6">
            {profile.projects?.map((project, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-white">{project.title}</h3>
                      {project.verified ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-400 text-sm">
                          <XCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400">{project.type} Project</p>
                    <p className="text-gray-300 mt-2">{project.description}</p>
                    <p className="text-gray-300 mt-2">Outcome: {project.outcome}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-600 text-gray-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!profile.projects || profile.projects.length === 0) && (
              <p className="text-gray-400 text-center py-4">No projects added yet</p>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Certifications</h2>
            </div>
            <button
              onClick={() => setShowCertificationModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </button>
          </div>
          <div className="space-y-6">
            {profile.certifications?.map((cert, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-white">{cert.name}</h3>
                      {cert.verified ? (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-400 text-sm">
                          <XCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400">{cert.issuer}</p>
                    <p className="text-gray-500">{cert.year}</p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        View Certificate
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!profile.certifications || profile.certifications.length === 0) && (
              <p className="text-gray-400 text-center py-4">No certifications added yet</p>
            )}
          </div>
        </div>
      </div>

      <AddEducationModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        onSubmit={handleAddEducation}
      />

      <AddExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        onSubmit={handleAddExperience}
      />

      <AddProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleAddProject}
      />

      <AddCertificationModal
        isOpen={showCertificationModal}
        onClose={() => setShowCertificationModal(false)}
        onSubmit={handleAddCertification}
      />

      <EditSkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        onSubmit={handleUpdateSkills}
        initialSkills={profile.skills}
      />
    </div>
  );
}