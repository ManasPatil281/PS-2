import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const SurveyNavbar = ({ domains, activeDomain, onDomainChange, progressData }) => {
  const totalQuestions = domains.reduce((sum, domain) => sum + domain.questions.length, 0);
  const answeredQuestions = Object.values(progressData).reduce((sum, answers) => sum + answers.length, 0);
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <nav className="bg-primary shadow-[var(--shadow-nav)] border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-foreground">
                Household Survey Questionnaire
              </h1>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-primary-foreground/80 text-sm">
              Progress: {answeredQuestions}/{totalQuestions}
            </span>
            <div className="w-32">
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-primary-foreground/20"
              />
            </div>
            <span className="text-primary-foreground/80 text-sm font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Domain Tabs */}
      <div className="border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {domains.map((domain) => {
              const domainAnswered = progressData[domain.id]?.length || 0;
              const domainTotal = domain.questions.length;
              const isCompleted = domainAnswered === domainTotal;
              
              return (
                <Button
                  key={domain.id}
                  variant={activeDomain === domain.id ? "secondary" : "ghost"}
                  className={`
                    whitespace-nowrap flex-shrink-0 transition-all duration-200 relative
                    ${activeDomain === domain.id 
                      ? 'bg-primary-foreground text-primary font-medium shadow-sm' 
                      : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                    }
                    ${isCompleted ? 'ring-2 ring-success' : ''}
                  `}
                  onClick={() => onDomainChange(domain.id)}
                >
                  <span className="flex items-center space-x-2">
                    <span>Domain {domain.id}</span>
                    {isCompleted && (
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                    )}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-success/50 transform scale-x-0 transition-transform" 
                       style={{ transform: `scaleX(${domainAnswered / domainTotal})` }}>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SurveyNavbar;