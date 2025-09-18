import React, { useState, useEffect } from 'react';
import SurveyNavbar from '@/components/SurveyNavbar';
import SurveyForm from '@/components/SurveyForm';
import surveyData from '@/data/surveyData.json';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeDomain, setActiveDomain] = useState(1);
  const [allResponses, setAllResponses] = useState({});
  const [progressData, setProgressData] = useState({});

  // Load saved responses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('householdSurvey');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        const responsesByDomain = {};
        const progress = {};
        
        parsedData.forEach(domainData => {
          responsesByDomain[domainData.domainId] = {};
          progress[domainData.domainId] = [];
          
          domainData.responses.forEach(response => {
            responsesByDomain[domainData.domainId][response.questionId] = {
              question: response.question,
              answer: response.answer,
              isOptional: response.isOptional
            };
            if (response.answer && response.answer.trim() !== '') {
              progress[domainData.domainId].push(response.questionId);
            }
          });
        });
        
        setAllResponses(responsesByDomain);
        setProgressData(progress);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Update progress when responses change
  useEffect(() => {
    const newProgress: Record<string, string[]> = {};
    Object.keys(allResponses).forEach(domainId => {
      newProgress[domainId] = Object.entries((allResponses as any)[domainId] || {})
        .filter(([_, response]: [string, any]) => response?.answer && response.answer.trim() !== '')
        .map(([questionId]) => questionId);
    });
    setProgressData(newProgress);
  }, [allResponses]);

  const currentDomain = surveyData.find(d => d.id === activeDomain);
  const currentResponses = allResponses[activeDomain] || {};

  const handleResponsesChange = (newResponses: any) => {
    setAllResponses(prev => ({
      ...prev,
      [activeDomain]: newResponses
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SurveyNavbar 
        domains={surveyData}
        activeDomain={activeDomain}
        onDomainChange={setActiveDomain}
        progressData={progressData}
      />
      
      <main className="py-8">
        <SurveyForm
          domain={currentDomain}
          responses={currentResponses}
          onResponsesChange={handleResponsesChange}
        />
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
