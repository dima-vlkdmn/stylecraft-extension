import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { PrimaryButton }     from "../../ui/buttons/primary-button";
import { Subtitle, Title }   from "../../ui/typography";
import { OverallScoreCard }  from "./overall-score-card";
import { BlockAnalysisCard, BlockAnalysis } from "./block-analysis-card";
import { SidePulse }         from "@/lib/chrome-pulse/side-pulse";
import { useTabId }          from "../../base/app";

export interface DetailedSeoAnalysisResult {
  overallScore: number;
  technicalAudit: BlockAnalysis;
  metaDataAnalysis: BlockAnalysis;
  contentAnalysis: BlockAnalysis;
  linkAnalysis: BlockAnalysis;
}

const seoPulse = new SidePulse("SeoAnalyzer");

const SeoAnalyzer: React.FC = () => {
  const tabId = useTabId()!
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetailedSeoAnalysisResult | null>(null);

  const handleAnalyzeSite = async () => {
    setLoading(true);
    setResults(null);

    try {
      const reply = await seoPulse.sendMessage<{
        overallScore: number;
        details: {
          technicalBlock: any;
          metaBlock:      any;
          contentBlock:   any;
          linkBlock:      any;
        };
      }>("analyzeSite", { tabId });

      const data = Array.isArray(reply) ? reply[0] : reply;
      const { overallScore, details } = data;

      setResults({
        overallScore,
        technicalAudit: {
          title: "Technical Audit",
          issues:          details.technicalBlock.issues,
          recommendations: details.technicalBlock.recommendations,
          score:           details.technicalBlock.score,
          correctCount:    details.technicalBlock.correctCount,
          incorrectCount:  details.technicalBlock.incorrectCount,
        },
        metaDataAnalysis: {
          title: "Meta Data Analysis",
          issues:          details.metaBlock.issues,
          recommendations: details.metaBlock.recommendations,
          score:           details.metaBlock.score,
          correctCount:    details.metaBlock.correctCount,
          incorrectCount:  details.metaBlock.incorrectCount,
        },
        contentAnalysis: {
          title: "Content Analysis",
          issues:          details.contentBlock.issues,
          recommendations: details.contentBlock.recommendations,
          score:           details.contentBlock.score,
          correctCount:    details.contentBlock.correctCount,
          incorrectCount:  details.contentBlock.incorrectCount,
        },
        linkAnalysis: {
          title: "Link Analysis",
          issues:          details.linkBlock.issues,
          recommendations: details.linkBlock.recommendations,
          score:           details.linkBlock.score,
          correctCount:    details.linkBlock.correctCount,
          incorrectCount:  details.linkBlock.incorrectCount,
        },
      });
    } catch (err) {
      console.error("SEO analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>SEO Website Analyzer</Title>
      <Subtitle>Get detailed SEO analysis from any website</Subtitle>

      <PrimaryButton onClick={handleAnalyzeSite} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Site"}
      </PrimaryButton>

      {results && (
        <ResultsContainer>
          <OverallScoreCard score={results.overallScore} />
          <DetailedBlocks>
            <BlockAnalysisCard analysis={results.technicalAudit} />
            <BlockAnalysisCard analysis={results.metaDataAnalysis} />
            <BlockAnalysisCard analysis={results.contentAnalysis} />
            <BlockAnalysisCard analysis={results.linkAnalysis} />
          </DetailedBlocks>
        </ResultsContainer>
      )}
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
`;

const ResultsContainer = styled.div`
  width: 90%;
  animation: ${fadeIn} 1s forwards;
  margin-top: 2rem;
`;

const DetailedBlocks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export { SeoAnalyzer };
