/* eslint-disable unicorn/prefer-at */
/* eslint-disable new-cap */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-extraneous-dependencies */
import type { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@cucumber/cucumber';
import assert from 'assert';

import type { Manager } from '../../server/types/dependency.types';
import type { TestWorld } from './TestWorld';

When(
  'Install project using {string}',
  async function (this: TestWorld, manager: Manager) {
    await this.saveCallResult(this.installDependencies(manager));
  },
);

When(
  'Add dependency {string} version {string}',
  async function (this: TestWorld, name: string, version: string) {
    await this.saveCallResult(this.addDependencies([{ name, version }], 'dev'));
  },
);

When('Add dependencies:', async function (this: TestWorld, data: DataTable) {
  const deps = data.raw();

  await this.saveCallResult(
    this.addDependencies(
      deps.map((dep) => ({
        name: dep[0],
        version: dep[1],
      })),
      'dev',
    ),
  );
});

When(
  'Add {string} dependency {string}',
  async function (this: TestWorld, type: 'dev' | 'prod', name: string) {
    await this.saveCallResult(this.addDependencies([{ name }], type));
  },
);

When(
  'Remove {string} dependency {string}',
  async function (this: TestWorld, type: 'dev' | 'prod', name: string) {
    await this.saveCallResult(this.removeDependencies([{ name }], type));
  },
);

Then(
  'Fast dependencies should be:',
  async function (this: TestWorld, data: DataTable) {
    const dependencies = await this.getFastDependencies();
    const expectedBody = data
      .raw()
      .map((row) => JSON.parse(row.join(' '))) as unknown;

    // extra properties check
    assert.deepStrictEqual(
      dependencies,
      expectedBody,
      `Extra properties in response: ${JSON.stringify(dependencies)}`,
    );
  },
);

Then('Fast dependencies should be empty', async function (this: TestWorld) {
  const dependencies = await this.getFastDependencies();

  // extra properties check
  assert.deepStrictEqual(
    dependencies,
    [],
    `Invalid response: ${JSON.stringify(dependencies)}`,
  );
});

Then(
  'Full dependencies should be:',
  async function (this: TestWorld, data: DataTable) {
    const result = await this.getFullDependencies();
    const expectedBody = data
      .raw()
      .map((row) => JSON.parse(row.join(' '))) as unknown;

    // extra properties check
    assert.deepStrictEqual(
      result,
      expectedBody,
      `Extra properties in response: ${JSON.stringify(result)}`,
    );
  },
);

Then('Full dependencies should be empty', async function (this: TestWorld) {
  const result = await this.getFullDependencies();

  // extra properties check
  assert.deepStrictEqual(
    result,
    [],
    `Invalid response: ${JSON.stringify(result)}`,
  );
});
