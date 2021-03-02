export const ZERO = 0;

export function getNormalizedRequiredVersion(required?: string | null): string | undefined {
  if (required === null || required === undefined) {
    return undefined;
  }

  const normalized = /\d.+/.exec(required);

  return normalized ? normalized[0] : undefined;
}
