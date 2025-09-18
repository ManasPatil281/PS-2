import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import DomainForm from '@/components/DomainForm';
import mockData from '@/data/mockData.json';

interface Indicator {
  id: string;
  question: string;
  benchmarks: string[];
}

interface Domain {
  domain: string;
  indicators: Indicator[];
}

const Index = () => {
  const [domains] = useState<Domain[]>(mockData);
  const [activeDomain, setActiveDomain] = useState<string>(mockData[0]?.domain || '');

  const currentDomainData = domains.find(d => d.domain === activeDomain);

  return (
    <div className="min-h-screen bg-background">
      <NavBar 
        domains={domains.map(d => d.domain)}
        activeDomain={activeDomain}
        onDomainChange={setActiveDomain}
      />
      
      <main className="py-8">
        {currentDomainData && (
          <DomainForm 
            domain={currentDomainData.domain}
            indicators={currentDomainData.indicators}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
