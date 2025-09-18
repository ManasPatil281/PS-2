import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Circle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Indicator {
  id: string;
  question: string;
  benchmarks: string[];
}

interface DomainFormProps {
  domain: string;
  indicators: Indicator[];
}

interface Response {
  indicator: string;
  answer: string;
  benchmark?: string;
}

const DomainForm: React.FC<DomainFormProps> = ({ domain, indicators }) => {
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const { toast } = useToast();

  const handleAnswerChange = (indicatorId: string, answer: boolean) => {
    setResponses(prev => ({
      ...prev,
      [indicatorId]: {
        ...prev[indicatorId],
        indicator: indicators.find(i => i.id === indicatorId)?.question || '',
        answer: answer ? 'Yes' : 'No'
      }
    }));
  };

  const handleBenchmarkChange = (indicatorId: string, benchmark: string) => {
    setResponses(prev => ({
      ...prev,
      [indicatorId]: {
        ...prev[indicatorId],
        benchmark
      }
    }));
  };

  const handleSubmit = () => {
    const validResponses = Object.values(responses).filter(response => response.answer);
    
    if (validResponses.length === 0) {
      toast({
        title: "No responses provided",
        description: "Please answer at least one indicator before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving to local storage
    const savedData = {
      domain,
      responses: validResponses,
      timestamp: new Date().toISOString()
    };

    const existingData = JSON.parse(localStorage.getItem('responses') || '[]');
    const updatedData = existingData.filter((item: any) => item.domain !== domain);
    updatedData.push(savedData);
    localStorage.setItem('responses', JSON.stringify(updatedData));

    toast({
      title: "Responses saved successfully",
      description: `${validResponses.length} indicators saved for ${domain}`,
      variant: "default"
    });

    // Reset form
    setResponses({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">{domain}</h2>
        <p className="text-muted-foreground">
          Please evaluate each indicator and provide your assessment
        </p>
      </div>

      <div className="grid gap-6">
        {indicators.map((indicator) => {
          const response = responses[indicator.id];
          const hasAnswer = response?.answer;
          
          return (
            <Card 
              key={indicator.id} 
              className={`
                transition-all duration-200 shadow-[var(--shadow-card)]
                ${hasAnswer 
                  ? 'border-success/30 bg-success/5' 
                  : 'border-border hover:border-primary/30 hover:shadow-lg'
                }
              `}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-start gap-3 text-lg">
                  <div className="flex-shrink-0 mt-1">
                    {hasAnswer ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-primary font-semibold text-sm mb-1 block">
                      Indicator {indicator.id}
                    </span>
                    <span className="text-foreground font-normal leading-relaxed">
                      {indicator.question}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Yes/No Toggle */}
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <Label htmlFor={`switch-${indicator.id}`} className="text-sm font-medium">
                    Assessment Response
                  </Label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm ${response?.answer === 'No' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      No
                    </span>
                    <Switch
                      id={`switch-${indicator.id}`}
                      checked={response?.answer === 'Yes'}
                      onCheckedChange={(checked) => handleAnswerChange(indicator.id, checked)}
                      className="data-[state=checked]:bg-success"
                    />
                    <span className={`text-sm ${response?.answer === 'Yes' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      Yes
                    </span>
                  </div>
                </div>

                {/* Benchmark Selection */}
                {indicator.benchmarks.length > 0 && hasAnswer && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Benchmark Level</Label>
                    <Select 
                      value={response?.benchmark || ''} 
                      onValueChange={(value) => handleBenchmarkChange(indicator.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select benchmark level" />
                      </SelectTrigger>
                      <SelectContent>
                        {indicator.benchmarks.map((benchmark) => (
                          <SelectItem key={benchmark} value={benchmark}>
                            {benchmark}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit}
          className="bg-success hover:bg-success/90 text-success-foreground px-8 py-3 text-lg font-medium"
          size="lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Save {domain} Assessment
        </Button>
      </div>
    </div>
  );
};

export default DomainForm;