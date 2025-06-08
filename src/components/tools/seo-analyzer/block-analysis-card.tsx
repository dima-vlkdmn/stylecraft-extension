import React from "react";
import styled from "styled-components";

export interface BlockAnalysis {
  title: string;
  score: number;
  issues: string[];
  recommendations: string[];
  correctCount: number;
  incorrectCount: number;
}

interface BlockAnalysisCardProps {
  analysis: BlockAnalysis;
}

const BlockAnalysisCard: React.FC<BlockAnalysisCardProps> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{analysis.title}</CardTitle>
        <CardScore>Score: {analysis.score}</CardScore>
      </CardHeader>
      <Section>
        <SectionTitle>Correct elements: {analysis.correctCount}</SectionTitle>
        <SectionTitle>Incorrect elements: {analysis.incorrectCount}</SectionTitle>
      </Section>
      <Section>
        <SectionTitle>Issues Found:</SectionTitle>
        {analysis.issues.length > 0 ? (
          <ul>
            {analysis.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p>No issues detected.</p>
        )}
      </Section>
      <Section>
        <SectionTitle>Recommendations:</SectionTitle>
        {analysis.recommendations.length > 0 ? (
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available.</p>
        )}
      </Section>
    </Card>
  );
};

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h4`
  margin: 0;
  color: #333;
`;

const CardScore = styled.span`
  font-size: 0.875rem;
  color: #888;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h5`
  margin: 0.5rem 0;
  color: #555;
`;

export { BlockAnalysisCard };
