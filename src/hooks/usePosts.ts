import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  organization: string;
  description: string;
  requirements?: string;
  location?: string;
  type: 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects';
  work_type?: 'remote' | 'onsite' | 'hybrid';
  duration?: string;
  compensation?: string;
  skills: string[];
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
}

export function usePosts(type?: Post['type'], userOnly: boolean = false) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [type, userOnly]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (userOnly && user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('status', 'active');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<Post, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error: createError } = await supabase
        .from('posts')
        .insert([
          {
            ...postData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (createError) throw createError;
      
      setPosts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPosts(prev => prev.map(post => post.id === id ? data : post));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const deletePost = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refreshPosts: fetchPosts
  };
}