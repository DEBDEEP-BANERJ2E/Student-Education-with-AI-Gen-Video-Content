import { useState } from 'react';
import { X } from 'lucide-react';
import { Skills } from '../../types/profile';

interface EditSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (skills: Skills) => void;
  initialSkills: Skills;
}

export function EditSkillsModal({ isOpen, onClose, onSubmit, initialSkills }: EditSkillsModalProps) {
  const [formData, setFormData] = useState<Skills>(initialSkills);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Edit Skills</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Technical Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.technical.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                technical: e.target.value.split(',').map(skill => skill.trim())
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Soft Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.soft.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                soft: e.target.value.split(',').map(skill => skill.trim())
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Languages (comma-separated)
            </label>
            <input
              type="text"
              value={formData.languages.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                languages: e.target.value.split(',').map(lang => lang.trim())
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Skills
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}