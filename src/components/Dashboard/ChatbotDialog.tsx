import { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Volume2, VolumeX } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatbotDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you find learning opportunities and career paths. What are your interests or skills?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setSpeechEnabled(false);
    }

    // Cancel any ongoing speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!speechEnabled) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for a more natural sound
    utterance.rate = 1; // Speed of speech (0.1 to 10)
    utterance.pitch = 1; // Pitch of voice (0 to 2)
    utterance.volume = 1; // Volume (0 to 1)

    // Get available voices and select a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google UK English Female')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Speak the last assistant message
      const lastAssistantMessage = [...messages]
        .reverse()
        .find(m => m.role === 'assistant');
      if (lastAssistantMessage) {
        speak(lastAssistantMessage.content);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate AI response since we can't run Python in WebContainer
    setTimeout(() => {
      const aiResponse = `Based on your interest in "${userMessage}", here are some suggestions:

1. Explore relevant courses and certifications
2. Look for internship opportunities
3. Build practical experience through projects
4. Network with professionals in the field

Recommended Opportunities:

COURSES:
- Web Development Bootcamp (MIT)
- Data Science and Machine Learning (Harvard University)

INTERNSHIPS:
- Software Development Intern (Tech Solutions)
- Data Analytics Intern (Data Corp)

PROJECTS:
- Digital Education Platform (EduTech)
- AI Healthcare Solution (HealthTech)`;

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsLoading(false);

      // Automatically speak the response
      if (speechEnabled) {
        speak(aiResponse);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">VeriLearn Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          {speechEnabled && (
            <button
              onClick={toggleSpeech}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title={isSpeaking ? "Stop speaking" : "Start speaking"}
            >
              {isSpeaking ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="h-96 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}