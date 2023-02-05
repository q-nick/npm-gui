import type { ComponentProps } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import type { Table } from '../../../ui/Table/Table';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type DependenciesColumns =  ComponentProps<typeof Table<DependencyInstalledExtras>>['columns']
