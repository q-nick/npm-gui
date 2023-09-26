/* eslint-disable unicorn/prefer-at */
/* eslint-disable new-cap */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-extraneous-dependencies */
import { When } from '@cucumber/cucumber';

import type { TestWorld } from './TestWorld';

When(
  'I explore path: {string}',
  async function (this: TestWorld, path: string) {
    await this.saveCallResult(this.explorer(path));
  },
);

When(
  'I search for: {string}',
  async function (this: TestWorld, searchString: string) {
    await this.saveCallResult(this.search(searchString));
  },
);

When('I check available managers', async function (this: TestWorld) {
  await this.saveCallResult(this.managers());
});

When('I request info', async function (this: TestWorld) {
  await this.saveCallResult(this.info());
});
