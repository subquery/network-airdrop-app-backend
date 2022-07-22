// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AcalaEvmEvent } from '@subql/acala-evm-processor';
import { NewEraStartEvent } from '@subql/contract-sdk/typechain/EraManager';
import assert from 'assert';
import { Era } from '../types';
import { getUpsertAt } from './utils';

/* Era Handlers */
export async function handleNewEra(event: AcalaEvmEvent<NewEraStartEvent['args']>): Promise<void> {
  logger.info('handleNewEra');
  assert(event.args, 'No event args');

  const { era: id } = event.args;

  const era = Era.create({
    id: id.toHexString(),
    startTime: event.blockTimestamp,
    forceNext: false,
    createAt: getUpsertAt('handleNewEra', event),
  });

  await era.save();
}
