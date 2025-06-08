import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        const htmlString = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title;
        const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        const siteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || url;

        if (!title && !description && !image) {
          throw new Error('No preview data found');
        }

        setPreviewData({ title, description, image, siteName });
      } catch (error) {
        console.error('Error fetching link preview:', error);
        setError('Failed to load preview data');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [url]);

  if (loading) return <p>Loading preview...</p>;
  if (error) return <p>{error}</p>;

  return (
    previewData && (
      <PreviewContainer>
        {previewData.image ? (
          <Image src={previewData.image} alt="Preview" crossOrigin="anonymous" onError={(e) => { e.currentTarget.src = 'fallback_image_url_here'; }} />
        ) : (
          <Image src="fallback_image_url_here" alt="Preview" />
        )}
        <Info>
          <SiteName>{previewData.siteName}</SiteName>
          <Title>{previewData.title}</Title>
          <Description>{previewData.description}</Description>
        </Info>
      </PreviewContainer>
    )
  );
};

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const Info = styled.div`
  text-align: center;
`;

const SiteName = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #333;
`;

const Description = styled.p`
  margin: 0.5em 0 0;
  font-size: 1em;
  color: #666;
`;

export { LinkPreview };
