interface InstalledBase {
  data: {
    trees: [
      {
        name: string;
      },
    ];
  };
}

export type Installed = InstalledBase;

export interface Outdated {
  data?: {
    head: string[];
    body: string[][];
  };
}
