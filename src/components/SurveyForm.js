import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Eye, EyeOff } from 'lucide-react';
import QuestionCard from './QuestionCard';

const SurveyForm = ({ domain, responses, onResponsesChange }) => {
  const [showUnanswered, setShowUnanswered] = useState(false);
  const { toast } = useToast();

  if (!domain) return null;

  const handleAnswerChange = (questionId, answer) => {
    const newResponses = {
      ...responses,
      [questionId]: {
        ...responses[questionId],
        question: domain.questions.find(q => q.id === questionId)?.question || '',
        answer,
        isOptional: responses[questionId]?.isOptional || false
      }
    };
    onResponsesChange(newResponses);
  };

  const handleOptionalChange = (questionId, isOptional) => {
    const newResponses = {
      ...responses,
      [questionId]: {
        ...responses[questionId],
        question: domain.questions.find(q => q.id === questionId)?.question || '',
        answer: isOptional ? '' : (responses[questionId]?.answer || ''),
        isOptional
      }
    };
    onResponsesChange(newResponses);
  };

  const saveProgress = () => {
    const validResponses = Object.entries(responses)
      .filter(([_, response]) => response.answer && response.answer.trim() !== '')
      .map(([questionId, response]) => ({
        questionId,
        question: response.question,
        answer: response.answer,
        isOptional: response.isOptional || false
      }));

    // Save to localStorage
    const savedData = {
      domainId: domain.id,
      domain: domain.domain,
      responses: validResponses,
      timestamp: new Date().toISOString()
    };

    const existingData = JSON.parse(localStorage.getItem('householdSurvey') || '[]');
    const updatedData = existingData.filter(item => item.domainId !== domain.id);
    updatedData.push(savedData);
    localStorage.setItem('householdSurvey', JSON.stringify(updatedData));

    toast({
      title: "Progress saved successfully",
      description: `${validResponses.length} responses saved for ${domain.domain}`,
      variant: "default"
    });
  };

  const downloadData = () => {
    const allData = JSON.parse(localStorage.getItem('householdSurvey') || '[]');
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `household_survey_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data downloaded",
      description: "Survey data has been downloaded as JSON file",
      variant: "default"
    });
  };

  const answeredCount = Object.values(responses).filter(r => r?.answer && r.answer.trim() !== '').length;
  const optionalCount = Object.values(responses).filter(r => r?.isOptional).length;
  const totalQuestions = domain.questions.length;
  const mandatoryQuestions = totalQuestions - optionalCount;
  const unansweredMandatory = domain.questions.filter(q => {
    const response = responses[q.id];
    return !response?.isOptional && (!response?.answer || response.answer.trim() === '');
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Domain {domain.id}: {domain.domain}
        </h2>
        <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
          <span>
            {answeredCount}/{totalQuestions} questions answered
          </span>
          <span>
            {optionalCount} questions marked optional
          </span>
          <span>
            {unansweredMandatory.length} mandatory questions remaining
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => setShowUnanswered(!showUnanswered)}
          className="flex items-center space-x-2"
        >
          {showUnanswered ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>
            {showUnanswered ? 'Show All' : 'Highlight Unanswered'}
          </span>
        </Button>

        <div className="flex space-x-3">
          <Button
            onClick={saveProgress}
            className="bg-success hover:bg-success/90 text-success-foreground flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Progress</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadData}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Data</span>
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="grid gap-6">
        {domain.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={responses[question.id]?.answer || ''}
            isOptional={responses[question.id]?.isOptional || false}
            onAnswerChange={handleAnswerChange}
            onOptionalChange={(isOptional) => handleOptionalChange(question.id, isOptional)}
            isHighlighted={showUnanswered}
          />
        ))}
      </div>

      {/* Summary */}
      {unansweredMandatory.length > 0 && (
        <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <h3 className="font-semibold text-warning mb-2">
            Incomplete Mandatory Questions ({unansweredMandatory.length})
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {unansweredMandatory.map(q => (
              <li key={q.id}>• Question {q.id}</li>
            ))}
          </ul>
        </div>
      )}

      {answeredCount === totalQuestions && (
        <div className="mt-8 p-4 bg-success/10 border border-success/30 rounded-lg text-center">
          <h3 className="font-semibold text-success mb-2">
            🎉 Domain Complete!
          </h3>
          <p className="text-sm text-muted-foreground">
            All questions in this domain have been answered.
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;