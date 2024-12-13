//app/page.tsx
'use client';
import 'regenerator-runtime/runtime';
import Hero from './components/Hero'; 
import SantaTalkSection from './components/SantaTalkSection';
import MainSecond from './components/MainSecond';

const Home = () => {
  return (
    <div className="">
      <Hero /> 
      
      <SantaTalkSection />

      <MainSecond />
      
      
    </div>
  );
};

export default Home;
