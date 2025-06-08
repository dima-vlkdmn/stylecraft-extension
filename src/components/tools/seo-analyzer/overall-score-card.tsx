import React from "react";
import styled from "styled-components";

interface OverallScoreCardProps {
  score: number;
}

const OverallScoreCard: React.FC<OverallScoreCardProps> = ({ score }) => {
  return (
    <ScoreCard>
      <ScoreTitle>Overall SEO Score</ScoreTitle>
      <ScoreValue>{score}</ScoreValue>
      <ScoreDescription>
        This score represents the overall SEO performance of the site on a scale of 1 to 100.
      </ScoreDescription>
    </ScoreCard>
  );
};

const ScoreCard = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
`;

const ScoreTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #333;
`;

const ScoreValue = styled.h1`
  font-size: 3rem;
  margin: 0.5rem 0;
  color: #2ecc71;
`;

const ScoreDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
`;

export { OverallScoreCard };
