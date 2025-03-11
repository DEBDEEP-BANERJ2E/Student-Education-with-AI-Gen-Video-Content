import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '../lib/supabase';
import { ProfileData, Education, WorkExperience, Project, Certification, Skills } from '../types/profile';

export function useProfile() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No profile found');

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!updatedProfile) throw new Error('Failed to fetch updated profile');

      setProfile(updatedProfile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addEducation = async (education: Education) => {
    if (!profile) return false;
    const updatedEducation = [...(profile.education || []), education];
    return updateProfile({ education: updatedEducation });
  };

  const updateEducation = async (index: number, education: Education) => {
    if (!profile) return false;
    const updatedEducation = [...(profile.education || [])];
    updatedEducation[index] = education;
    return updateProfile({ education: updatedEducation });
  };

  const removeEducation = async (index: number) => {
    if (!profile) return false;
    const updatedEducation = profile.education.filter((_, i) => i !== index);
    return updateProfile({ education: updatedEducation });
  };

  const addExperience = async (experience: WorkExperience) => {
    if (!profile) return false;
    const updatedExperience = [...(profile.experience || []), experience];
    return updateProfile({ experience: updatedExperience });
  };

  const updateExperience = async (index: number, experience: WorkExperience) => {
    if (!profile) return false;
    const updatedExperience = [...(profile.experience || [])];
    updatedExperience[index] = experience;
    return updateProfile({ experience: updatedExperience });
  };

  const removeExperience = async (index: number) => {
    if (!profile) return false;
    const updatedExperience = profile.experience.filter((_, i) => i !== index);
    return updateProfile({ experience: updatedExperience });
  };

  const updateSkills = async (skills: Skills) => {
    return updateProfile({ skills });
  };

  const addProject = async (project: Project) => {
    if (!profile) return false;
    const updatedProjects = [...(profile.projects || []), project];
    return updateProfile({ projects: updatedProjects });
  };

  const updateProject = async (index: number, project: Project) => {
    if (!profile) return false;
    const updatedProjects = [...(profile.projects || [])];
    updatedProjects[index] = project;
    return updateProfile({ projects: updatedProjects });
  };

  const removeProject = async (index: number) => {
    if (!profile) return false;
    const updatedProjects = profile.projects.filter((_, i) => i !== index);
    return updateProfile({ projects: updatedProjects });
  };

  const addCertification = async (certification: Certification) => {
    if (!profile) return false;
    const updatedCertifications = [...(profile.certifications || []), certification];
    return updateProfile({ certifications: updatedCertifications });
  };

  const updateCertification = async (index: number, certification: Certification) => {
    if (!profile) return false;
    const updatedCertifications = [...(profile.certifications || [])];
    updatedCertifications[index] = certification;
    return updateProfile({ certifications: updatedCertifications });
  };

  const removeCertification = async (index: number) => {
    if (!profile) return false;
    const updatedCertifications = profile.certifications.filter((_, i) => i !== index);
    return updateProfile({ certifications: updatedCertifications });
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification
  };
}