import React from 'react';
import { Button } from '@/components/ui/button';

interface NavBarProps {
  domains: string[];
  activeDomain: string;
  onDomainChange: (domain: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ domains, activeDomain, onDomainChange }) => {
  return (
    <nav className="bg-primary shadow-[var(--shadow-nav)] border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-foreground">
                Government Monitoring Portal
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Domain Tabs */}
      <div className="border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {domains.map((domain) => (
              <Button
                key={domain}
                variant={activeDomain === domain ? "secondary" : "ghost"}
                className={`
                  whitespace-nowrap flex-shrink-0 transition-all duration-200
                  ${activeDomain === domain 
                    ? 'bg-primary-foreground text-primary font-medium shadow-sm' 
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                  }
                `}
                onClick={() => onDomainChange(domain)}
              >
                {domain}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;