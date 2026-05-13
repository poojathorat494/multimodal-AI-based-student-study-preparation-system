import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Monitor, Video, Download, BookMarked, ExternalLink } from 'lucide-react';

const CATEGORIES = ['All', 'College', 'Courses', 'Placements', 'Interview Prep', 'Resume'];

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const resources = getFilteredResources(searchQuery, activeCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Resources</h1>
      
      {/* Search and filter */}
      <div className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${getResourceTypeColor(resource.type)}`}>
            {getResourceTypeIcon(resource.type)}
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {resource.category}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
        
        <div className="flex items-center justify-between">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 text-sm font-medium hover:text-primary-600 flex items-center gap-1"
          >
            <span>View Resource</span>
            <ExternalLink size={14} />
          </a>
          
          <button className="text-gray-400 hover:text-primary-500 transition-colors">
            <BookMarked size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions
const getResourceTypeIcon = (type: ResourceType) => {
  switch (type) {
    case 'document':
      return <BookOpen size={18} className="text-white" />;
    case 'website':
      return <Monitor size={18} className="text-white" />;
    case 'video':
      return <Video size={18} className="text-white" />;
    case 'download':
      return <Download size={18} className="text-white" />;
    default:
      return <BookOpen size={18} className="text-white" />;
  }
};

const getResourceTypeColor = (type: ResourceType) => {
  switch (type) {
    case 'document':
      return 'bg-primary-500';
    case 'website':
      return 'bg-secondary-500';
    case 'video':
      return 'bg-accent-500';
    case 'download':
      return 'bg-success-500';
    default:
      return 'bg-primary-500';
  }
};

const getFilteredResources = (query: string, category: string) => {
  let filtered = MOCK_RESOURCES;
  
  // Filter by search query
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(
      (resource) =>
        resource.title.toLowerCase().includes(lowercaseQuery) ||
        resource.description.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Filter by category
  if (category !== 'All') {
    filtered = filtered.filter((resource) => resource.category === category);
  }
  
  return filtered;
};

// Types and mock data
type ResourceType = 'document' | 'website' | 'video' | 'download';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ResourceType;
  url: string;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Placement Preparation Guide',
    description: 'A comprehensive guide to help students prepare for campus placements and interviews.',
    category: 'Placements',
    type: 'document',
   url: 'https://www.geeksforgeeks.org/placement-preparation-guide/'
  },
  {
    id: '2',
    title: 'Resume Building Workshop',
    description: 'Learn how to create an impressive resume that stands out to recruiters and employers.',
    category: 'Resume',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ'
  },
  {
    id: '3',
    title: 'College Handbook 2025',
    description: 'Official handbook containing all information about the college, departments, and facilities.',
    category: 'College',
    type: 'download',
    url: 'https://www.ugc.gov.in/'
  },
  {
    id: '4',
    title: 'Data Structures & Algorithms Course',
    description: 'Master the fundamentals of DSA to crack technical interviews at top companies.',
    category: 'Courses',
    type: 'website',
    url: 'https://www.geeksforgeeks.org/data-structures/'
  },
  {
    id: '5',
    title: 'Mock Interview Platform',
    description: 'Practice interviews with AI and get feedback to improve your interview skills.',
    category: 'Interview Prep',
    type: 'website',
    url: 'https://www.pramp.com/'
  },
  {
    id: '6',
    title: 'Top Companies Visiting Campus',
    description: 'List of companies visiting for campus recruitment along with eligibility criteria.',
    category: 'Placements',
    type: 'document',
    url: 'https://www.naukri.com/fresher-jobs'
  },
  {
    id: '7',
    title: 'Technical Interview Questions',
    description: 'Collection of most frequently asked technical questions in placement interviews.',
    category: 'Interview Prep',
    type: 'download',
    url: 'https://leetcode.com/problemset/'
  },
  {
    id: '8',
    title: 'Introduction to Machine Learning',
    description: 'Beginner-friendly course on machine learning fundamentals and applications.',
    category: 'Courses',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ'
  

  },
  {
    id: '9',
    title: 'College Events Calendar',
    description: 'Upcoming events, workshops, guest lectures, and placement drives at the college.',
    category: 'College',
    type: 'website',
    url: 'https://www.eventbrite.com/'
  }
];

export default ResourcesPage;