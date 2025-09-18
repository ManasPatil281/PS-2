import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Circle, AlertCircle, SkipForward } from 'lucide-react';

const QuestionCard = ({ question, answer, isOptional, onAnswerChange, onOptionalChange, isHighlighted }) => {
  const [localAnswer, setLocalAnswer] = useState(answer || '');

  const handleAnswerSubmit = () => {
    onAnswerChange(question.id, localAnswer);
  };

  const renderAnswerInput = () => {
    switch (question.type) {
      case 'yesno':
        return (
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <Label htmlFor={`switch-${question.id}`} className="text-sm font-medium">
              Your Response
            </Label>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${localAnswer === 'No' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                No
              </span>
              <Switch
                id={`switch-${question.id}`}
                checked={localAnswer === 'Yes'}
                onCheckedChange={(checked) => {
                  const newAnswer = checked ? 'Yes' : 'No';
                  setLocalAnswer(newAnswer);
                  onAnswerChange(question.id, newAnswer);
                }}
                className="data-[state=checked]:bg-success"
              />
              <span className={`text-sm ${localAnswer === 'Yes' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Yes
              </span>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select an option</Label>
            <Select 
              value={localAnswer} 
              onValueChange={(value) => {
                setLocalAnswer(value);
                onAnswerChange(question.id, value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Answer</Label>
            <div className="flex space-x-2">
              <Textarea
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                placeholder={question.placeholder || "Enter your response here..."}
                className="flex-1"
                rows={3}
              />
              <Button 
                onClick={handleAnswerSubmit}
                disabled={!localAnswer.trim()}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                Save
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const hasAnswer = answer && answer.trim() !== '';
  const isUnanswered = !hasAnswer && !isOptional;

  return (
    <Card 
      className={`
        transition-all duration-200 shadow-[var(--shadow-card)]
        ${hasAnswer 
          ? 'border-success/30 bg-success/5' 
          : isOptional 
            ? 'border-muted bg-muted/30'
            : isHighlighted && isUnanswered
              ? 'border-destructive/50 bg-destructive/5'
              : 'border-border hover:border-primary/30 hover:shadow-lg'
        }
      `}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-start gap-3 text-lg">
          <div className="flex-shrink-0 mt-1">
            {hasAnswer ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : isOptional ? (
              <SkipForward className="h-5 w-5 text-muted-foreground" />
            ) : isHighlighted && isUnanswered ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-primary font-semibold text-sm mb-1 block">
              Question {question.id}
            </span>
            <span className="text-foreground font-normal leading-relaxed">
              {question.question}
            </span>
            {isHighlighted && isUnanswered && (
              <span className="text-destructive text-xs mt-1 block">
                This question requires an answer
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Optional Toggle */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <Label htmlFor={`optional-${question.id}`} className="text-sm font-medium">
            Mark as Optional/Skip
          </Label>
          <Switch
            id={`optional-${question.id}`}
            checked={isOptional}
            onCheckedChange={onOptionalChange}
            className="data-[state=checked]:bg-warning"
          />
        </div>

        {/* Answer Input */}
        {!isOptional && renderAnswerInput()}
        
        {/* Show current answer if answered */}
        {hasAnswer && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Answer saved:</span>
              <span className="text-sm text-foreground">{answer}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;