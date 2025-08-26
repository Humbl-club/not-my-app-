import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleSaveService } from '@/services/simpleSaveService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export const CachedApplicationBanner: React.FC = () => {
  const navigate = useNavigate();
  const [hasCached, setHasCached] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);

  useEffect(() => {
    checkForCachedApplications();
    // Check every 30 seconds for changes
    const interval = setInterval(checkForCachedApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkForCachedApplications = () => {
    try {
      const hasApplication = SimpleSaveService.hasCachedApplication();
      if (hasApplication) {
        const cached = SimpleSaveService.getCachedForUser();
        setHasCached(true);
        setCachedCount(cached.length);
      } else {
        setHasCached(false);
        setCachedCount(0);
      }
    } catch (error) {
      console.error('Error checking for cached applications:', error);
    }
  };

  if (!hasCached) return null;

  return (
    <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              You have {cachedCount} saved application{cachedCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-muted-foreground">
              Continue where you left off
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/account')}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          View Applications
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};