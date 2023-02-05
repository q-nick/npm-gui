interface InstalledBase {
  data: {
    trees: [
      {
        name: string;
      },
    ];
  };
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type InstalledYarn = InstalledBase;

export interface OutdatedYarn {
  data?: {
    head: string[];
    body: string[][];
  };
}
