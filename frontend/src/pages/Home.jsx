import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import Notifications from '../components/Notifications';
import Profile from '../pages/Profile';

const Home = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed': return <Feed />;
      case 'alerts': return <Notifications />;
      case 'profile': return <Profile />;
      default: return <Feed />;
    }
  };

  return (
    <div className="home-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="home-content">{renderContent()}</main>
    </div>
  );
};

export default Home;
