// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AcalaEvmEvent } from '@subql/acala-evm-processor';
import {
  RoundCreatedEvent,
  AddAirdropEvent,
  AirdropClaimedEvent,
  RoundSettledEvent,
} from '@subql/contract-sdk/typechain/Airdropper';
import assert from 'assert';
import { Airdrop, AirdropClaimStatus, AirdropUser } from '../types';
import {
  getErrorText,
  getUpsertAt,
  recordException,
  upsertAddress,
} from './utils';

const getAirdropUserId = (roundId: string, address: string) =>
  `${roundId}:${address}`;

export async function handleRoundCreated(
  event: AcalaEvmEvent<RoundCreatedEvent['args']>
): Promise<void> {
  const HANDLER = 'handleRoundCreated';
  logger.info(HANDLER);
  assert(event.args, 'No event args');

  const { roundId, roundDeadline, roundStartTime, tokenAddress } = event.args;

  const airdropRound = Airdrop.create({
    id: roundId.toString(),
    startTime: new Date(roundStartTime.toNumber() * 1000), // seconds return from contract and manipulate into milliseconds / Date object.
    endTime: new Date(roundDeadline.toNumber() * 1000), // seconds return from contract and manipulate into milliseconds / Date object.
    tokenAddress,
    createAt: getUpsertAt(HANDLER, event),
  });

  await airdropRound.save();
}

export async function handleRoundSettled(
  event: AcalaEvmEvent<RoundSettledEvent['args']>
): Promise<void> {
  const HANDLER = 'handleRoundSettled';
  logger.info(HANDLER);
  assert(event.args, 'No event args');

  const { roundId, unclaimAmount } = event.args;
  const roundIdString = roundId.toString();
  const airdrop = await Airdrop.get(roundIdString);

  if (airdrop) {
    airdrop.withdrawAmount = unclaimAmount.toBigInt();
    airdrop.hasWithdrawn = true;
    airdrop.updateAt = getUpsertAt(HANDLER, event);
  } else {
    const error = getErrorText(
      HANDLER,
      `Expect roundId - ${roundIdString} exit`
    );
    await recordException(event.transactionHash, error);
    logger.error(error);
  }
}

export async function handleAddAirdrop(
  event: AcalaEvmEvent<AddAirdropEvent['args']>
): Promise<void> {
  const HANDLER = 'handleAddAirdrop';
  logger.info(HANDLER);
  assert(event.args, 'No event args');

  const { addr, roundId, amount } = event.args;
  const roundIdString = roundId.toString();
  const airdrop = await Airdrop.get(roundIdString);

  if (airdrop) {
    await upsertAddress(addr, amount, '0', event);

    const airdropUser = AirdropUser.create({
      id: getAirdropUserId(roundIdString, addr),
      addressId: addr,
      airdropId: roundId.toString(),
      amount: amount.toBigInt(),
      status: AirdropClaimStatus.UNCLAIMED,
      createAt: getUpsertAt(HANDLER, event),
    });

    await airdropUser.save();
  } else {
    const error = getErrorText(
      HANDLER,
      `Expect roundId - ${roundIdString} exit`
    );
    await recordException(event.transactionHash, error);
    logger.error(error);
  }
}

export async function handleAirdropClaimed(
  event: AcalaEvmEvent<AirdropClaimedEvent['args']>
): Promise<void> {
  const HANDLER = 'handleAirdropClaimed';
  logger.info(HANDLER);
  assert(event.args, 'No event args');

  const { addr, roundId, amount } = event.args;
  const roundIdString = roundId.toString();
  const airdrop = await Airdrop.get(roundIdString);
  const airdropUserId = getAirdropUserId(roundIdString, addr);
  const airdropUser = await AirdropUser.get(airdropUserId);

  if (!airdrop) {
    const error = getErrorText(
      HANDLER,
      `Expect roundId - ${roundIdString} exit`
    );
    await recordException(event.transactionHash, error);
    logger.error(error);
    return;
  }

  if (!airdropUser) {
    const error = getErrorText(
      HANDLER,
      `Expect airdropUser - ${airdropUserId} exit`
    );
    await recordException(event.transactionHash, error);
    logger.error(error);
    return;
  }

  await upsertAddress(addr, '0', amount.toString(), event);

  airdropUser.status = AirdropClaimStatus.CLAIMED;
  airdropUser.updateAt = getUpsertAt(HANDLER, event);

  await airdropUser.save();
}
