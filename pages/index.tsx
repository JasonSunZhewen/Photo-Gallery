import './../styles/globals.css';
import React from 'react';
import PhotoGallery from './components/PhotoGallery';

const HomePage = () => {
  return (
    <div className='container'>
      <h1>Photo Gallery</h1>
      <PhotoGallery />
    </div>
  );
};

export default HomePage;
