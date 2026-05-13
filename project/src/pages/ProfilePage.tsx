import React from 'react';
import { User, Mail, BookOpen, Briefcase, Award, Edit, Settings, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-primary-500 h-32 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="bg-white p-2 rounded-full">
              <div className="bg-gray-200 h-28 w-28 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
            </div>
          </div>
          <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors">
            <Edit size={18} />
          </button>
        </div>
        
        <div className="pt-20 pb-6 px-6">
          <h1 className="text-2xl font-semibold text-gray-800">Anil Shelke</h1>
          <p className="text-gray-500 flex items-center gap-1 mt-1">
            <Mail size={16} />
            <span>poojathoratl456@gmail.com</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <ProfileCard
              icon={<BookOpen size={20} className="text-primary-500" />}
              title="Education"
              content="Master of Computer Application in Eng"
              subtitle="SPPU University, 2022-2026"
            />
            
            <ProfileCard
              icon={<Briefcase size={20} className="text-secondary-500" />}
              title="Skills"
              content="Python, Java, Web Development"
              subtitle="3 skill assessments completed"
            />
            
            <ProfileCard
              icon={<Award size={20} className="text-accent-500" />}
              title="Achievements"
              content="AY2023-25"
              subtitle="2 certifications completed"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSection title="Application Status">
          <div className="space-y-4">
            <ApplicationStatus
              company="Tech Solutions Inc."
              position="Software Engineering Intern"
              status="interview"
              date="May 15, 2025"
            />
            <ApplicationStatus
              company="Global Systems"
              position="Data Analyst"
              status="applied"
              date="May 10, 2025"
            />
            <ApplicationStatus
              company="Innovative Web"
              position="Frontend Developer"
              status="rejected"
              date="April 28, 2025"
            />
          </div>
        </ProfileSection>
        
        <ProfileSection title="Saved Resources">
          <div className="space-y-4">
            <SavedResource
              title="Top 50 Interview Questions"
              type="document"
              date="Saved on May 12, 2025"
            />
            <SavedResource
              title="Resume Building Workshop"
              type="video"
              date="Saved on May 5, 2025"
            />
            <SavedResource
              title="Python for Data Science"
              type="course"
              date="Saved on April 23, 2025"
            />
          </div>
        </ProfileSection>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          <Settings size={18} />
          <span>Account Settings</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  subtitle: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ icon, title, content, subtitle }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <p className="text-gray-800 font-medium">{content}</p>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
};

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
};

interface ApplicationStatusProps {
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'rejected' | 'accepted';
  date: string;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ company, position, status, date }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'applied':
        return { color: 'bg-gray-100 text-gray-600', text: 'Applied' };
      case 'interview':
        return { color: 'bg-warning-500/10 text-warning-500', text: 'Interview Scheduled' };
      case 'rejected':
        return { color: 'bg-error-500/10 text-error-500', text: 'Not Selected' };
      case 'accepted':
        return { color: 'bg-success-500/10 text-success-500', text: 'Accepted' };
      default:
        return { color: 'bg-gray-100 text-gray-600', text: 'Applied' };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{company}</h4>
          <p className="text-gray-600 text-sm">{position}</p>
        </div>
        <span className={`${statusInfo.color} text-xs font-medium px-2 py-1 rounded-full`}>
          {statusInfo.text}
        </span>
      </div>
      <p className="text-gray-500 text-xs mt-2">{date}</p>
    </div>
  );
};

interface SavedResourceProps {
  title: string;
  type: 'document' | 'video' | 'course';
  date: string;
}

const SavedResource: React.FC<SavedResourceProps> = ({ title, type, date }) => {
  const getTypeInfo = () => {
    switch (type) {
      case 'document':
        return { icon: <BookOpen size={16} />, color: 'text-primary-500' };
      case 'video':
        return { icon: <Video size={16} />, color: 'text-accent-500' };
      case 'course':
        return { icon: <Monitor size={16} />, color: 'text-secondary-500' };
      default:
        return { icon: <BookOpen size={16} />, color: 'text-primary-500' };
    }
  };
  
  const typeInfo = getTypeInfo();
  
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className={`${typeInfo.color}`}>{typeInfo.icon}</span>
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>
      <p className="text-gray-500 text-xs mt-2">{date}</p>
    </div>
  );
};

// Import for video and monitor icons
import { Video, Monitor } from 'lucide-react';

export default ProfilePage;