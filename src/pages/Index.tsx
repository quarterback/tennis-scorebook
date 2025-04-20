
import React, { useEffect } from 'react';
import Dashboard from './Dashboard';
import { useData } from '@/context/DataContext';

const Index = () => {
  const { schools, teams } = useData();
  
  // Log counts on app startup for debugging
  useEffect(() => {
    console.log(`Home page loaded with ${schools.length} schools and ${teams.length} teams`);
  }, [schools.length, teams.length]);
  
  return <Dashboard />;
};

export default Index;
