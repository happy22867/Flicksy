import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Feed from '../components/feed/Feed';
import CreatePost from '../components/CreatePost';
import Profile from './Profile';
import Notifications from '../components/Notifications';
import '../styles/Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('feed'); // feed, create, profile, notifications

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'create':
        return <CreatePost onPostCreated={() => setActiveTab('feed')} />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="home-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="home-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
