import React from 'react';
import { Hook } from './hooks/useDependencies';

export const DependenciesContext = React.createContext<Hook>({
  onInstallNewDependency: () => {},
});
