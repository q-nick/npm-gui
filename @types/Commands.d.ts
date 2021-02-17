declare namespace Commands {
  interface OutdatedBody {
    current: string;
    wanted: string;
    latest: string;
  }

  type InstalledBody = {
    version: string;
    extraneous?: boolean;
  } | {
    required: {
      version: string;
    };
    peerMissing: boolean;
  } | {
    required: string;
    missing: boolean;
  }

  type Outdated = Record<string, OutdatedBody>;

  interface Installed {
    dependencies: Record<string, InstalledBody>;
  }

  type Install = {
    error: {
      summary: string
    };
  } | {

  }
}
