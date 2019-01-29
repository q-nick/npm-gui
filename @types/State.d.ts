declare namespace State {
  type Status = 'loading' | 'loaded';

  interface Executing {
    [key:string]: boolean
  }

  interface Dependencies {
    scripts: any;
    list: any[];
    status: Status;
    sortKey: string;
    sortReversed: boolean;
    executing: Executing;
  }

  interface Scripts {
    list: any[],
    status: boolean,
    executing: Executing,
  }

  interface Console {
    dependencies: any;
    scripts: any;
  }

  interface Root {
    dependencies: Dependencies;
    scripts: Scripts;
  }
}
