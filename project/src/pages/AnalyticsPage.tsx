import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, FileQuestion, Lightbulb, BookOpen, Briefcase, BookMarked } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MessageSquare size={20} className="text-primary-500" />}
          title="Total Conversations"
          value="128"
          change="+12% from last month"
          isPositive={true}
        />
        <StatCard
          icon={<Clock size={20} className="text-secondary-500" />}
          title="Avg. Response Time"
          value="1.8s"
          change="-0.3s from last month"
          isPositive={true}
        />
        <StatCard
          icon={<CheckCircle size={20} className="text-success-500" />}
          title="Queries Resolved"
          value="87%"
          change="+5% from last month"
          isPositive={true}
        />
        <StatCard
          icon={<FileQuestion size={20} className="text-warning-500" />}
          title="Unresolved Queries"
          value="16"
          change="-3 from last month"
          isPositive={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Asked Topics</h2>
          <div className="space-y-4">
            <TopicBar 
              icon={<Lightbulb size={18} className="text-warning-500" />}
              topic="College Resources" 
              percentage={75} 
              color="bg-warning-500" 
            />
            <TopicBar 
              icon={<BookOpen size={18} className="text-primary-500" />}
              topic="Study Materials" 
              percentage={60} 
              color="bg-primary-500" 
            />
            <TopicBar 
              icon={<Briefcase size={18} className="text-secondary-500" />}
              topic="Job Opportunities" 
              percentage={85} 
              color="bg-secondary-500" 
            />
            <TopicBar 
              icon={<BookMarked size={18} className="text-accent-500" />}
              topic="Interview Preparation" 
              percentage={45} 
              color="bg-accent-500" 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversation Timeline</h2>
          <div className="flex flex-col space-y-3">
            {MOCK_TIMELINE_DATA.map((item, index) => (
              <TimelineItem 
                key={index}
                time={item.time}
                title={item.title}
                description={item.description}
                isLast={index === MOCK_TIMELINE_DATA.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ResourceUsageCard 
            icon={<BookOpen size={20} className="text-primary-500" />}
            title="Documents" 
            count={42} 
            percentage={65} 
            color="bg-primary-500" 
          />
          <ResourceUsageCard 
            icon={<Video size={20} className="text-accent-500" />}
            title="Videos" 
            count={23} 
            percentage={35} 
            color="bg-accent-500" 
          />
          <ResourceUsageCard 
            icon={<Monitor size={20} className="text-secondary-500" />}
            title="Websites" 
            count={31} 
            percentage={48} 
            color="bg-secondary-500" 
          />
          <ResourceUsageCard 
            icon={<Download size={20} className="text-success-500" />}
            title="Downloads" 
            count={15} 
            percentage={23} 
            color="bg-success-500" 
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
      </div>
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
        <p className={`text-xs mt-2 ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
};

interface TopicBarProps {
  icon: React.ReactNode;
  topic: string;
  percentage: number;
  color: string;
}

const TopicBar: React.FC<TopicBarProps> = ({ icon, topic, percentage, color }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-700 font-medium">{topic}</span>
        <span className="text-gray-500 text-sm ml-auto">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ time, title, description, isLast }) => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="bg-primary-500 rounded-full h-3 w-3"></div>
        {!isLast && <div className="flex-grow bg-gray-200 w-0.5 my-1"></div>}
      </div>
      <div className="pb-4">
        <p className="text-xs text-gray-500">{time}</p>
        <h4 className="text-sm font-medium text-gray-800 mt-1">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

interface ResourceUsageCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  percentage: number;
  color: string;
}

const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ icon, title, count, percentage, color }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-gray-800">{count}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Usage</span>
          <span className="text-xs text-gray-700 font-medium">{percentage}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full">
          <div 
            className={`h-full ${color} rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Mock data
const MOCK_TIMELINE_DATA = [
  {
    time: "Today, 10:32 AM",
    title: "Interview Preparation",
    description: "User asked about common interview questions"
  },
  {
    time: "Today, 9:15 AM",
    title: "Study Materials",
    description: "User requested resources for Data Structures"
  },
  {
    time: "Yesterday, 4:45 PM",
    title: "Job Opportunities",
    description: "User asked about upcoming placement drives"
  },
  {
    time: "Yesterday, 2:20 PM",
    title: "College Resources",
    description: "User inquired about library access hours"
  }
];

// Import for additional icons
import { Video, Monitor, Download } from 'lucide-react';

export default AnalyticsPage;