/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { BundleDetails } from '../../server/types/dependency.types';

interface CacheDetails {
  time: number;
  details: Record<string, BundleDetails>;
}

export const getDetailsFromCache = () => {
  const cache = localStorage.getItem('details-cache');

  if (!cache) {
    return {};
  }

  const { details } = JSON.parse(cache) as CacheDetails;

  return details;
};

export const putDetailsToCache = (putDetails: BundleDetails[]): void => {
  const cache = localStorage.getItem('details-cache');

  let time = undefined;
  let previousDetails: Record<string, BundleDetails> = {};

  if (cache) {
    const parsed = JSON.parse(cache) as CacheDetails;
    time = parsed.time;
    previousDetails = parsed.details;
  } else {
    time = Date.now();
  }

  localStorage.setItem(
    'details-cache',
    JSON.stringify({
      time,
      details: {
        ...previousDetails,
        ...Object.fromEntries(
          putDetails.map((det) => [`${det.name}@${det.version}`, det]),
        ),
      },
    } as CacheDetails),
  );
};
