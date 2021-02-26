import React from 'react';
import type { Hook } from './hooks/useDependencies';

export const DependenciesContext = React.createContext<Hook>({
  onInstallNewDependency: () => {},
  onForceInstallAllDependencies: () => {},
  onInstallAllDependencies: () => {},
});
