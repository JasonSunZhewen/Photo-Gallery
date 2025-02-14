'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PhotoProps {
  id: number;
  url: string;
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<HTMLDivElement | null>(null);
  const LIMIT: number = 10;

  const fetchPhotos = async (pageNum: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/photos?page=${pageNum}&limit=${LIMIT}`);
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data: PhotoProps[] = await response.json();

      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setPhotos((prevPhotos) => [...prevPhotos, ...data]);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  useEffect(() => {
    const loadMore = (entries: IntersectionObserverEntry[]): void => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const currentObserver = new IntersectionObserver(loadMore, {
      rootMargin: '100px',
    });

    if (observer.current) {
      currentObserver.observe(observer.current);
    }

    return () => {
      if (currentObserver && observer.current) {
        currentObserver.unobserve(observer.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div className="photo-gallery">
      {photos.map((photo) => (
        <div key={photo.id} className="photo-item">
          <img src={photo.url} alt={photo.url} />
        </div>
      ))}

      {loading && <div>Loading more images...</div>}

      <div ref={observer} className='hidden-div'></div>
    </div>
  );
};

export default PhotoGallery;
