import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoadingFallback: React.FC = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
  </div>
);
