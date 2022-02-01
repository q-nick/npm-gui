interface InstalledBase {
  data: {
    trees: [
      {
        name: string;
      },
    ];
  };
}

export type InstalledYarn = InstalledBase;

export interface OutdatedYarn {
  data?: {
    head: string[];
    body: string[][];
  };
}
