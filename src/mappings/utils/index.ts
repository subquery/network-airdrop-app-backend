// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AcalaEvmEvent } from '@subql/acala-evm-processor';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Address, Exception } from '../../types';

export const getUpsertAt = (
  handler: string,
  event: AcalaEvmEvent<any>
): string => {
  const upsertAt = `${handler}:${event.blockNumber}:${event.transactionHash}`;
  return upsertAt;
};

export const getErrorText = (handler: string, error: string) => {
  return `${handler}:${error}`;
};

export const recordException = async (
  txHash: string,
  error: string
): Promise<void> => {
  const exception = Exception.create({
    id: txHash,
    error,
  });

  await exception.save();
};

export const toBigNumber = (amount: BigNumberish) =>
  BigNumber.from(amount.toString());

export const upsertAddress = async (
  address: string,
  airdropAmount: BigNumberish,
  claimedAmount: BigNumberish,
  event: AcalaEvmEvent<any>
) => {
  const account = await Address.get(address);

  if (account) {
    account.totalAirdropAmount = toBigNumber(account.totalAirdropAmount)
      .add(toBigNumber(airdropAmount))
      .toBigInt();
    account.claimedAmount = toBigNumber(account.claimedAmount)
      .add(toBigNumber(claimedAmount))
      .toBigInt();
    account.updateAt = getUpsertAt('upsertAddress', event);

    await account.save();
  } else {
    logger.info(`upsertAddress - create: ${event.transactionHash}`);
    const newAddress = new Address(address);
    newAddress.totalAirdropAmount = toBigNumber(airdropAmount).toBigInt();
    newAddress.claimedAmount = toBigNumber(claimedAmount).toBigInt();
    newAddress.createAt = getUpsertAt('upsertAddress', event);
    await newAddress.save();
  }
};
