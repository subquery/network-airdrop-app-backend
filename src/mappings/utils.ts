import { AcalaEvmEvent } from '@subql/acala-evm-processor';
import testnetAddresses from '@subql/contract-sdk/publish/testnet.json';
import { Exception } from '../types';

export const QUERY_REGISTRY_ADDRESS = testnetAddresses.QueryRegistry.address;
export const ERA_MANAGER_ADDRESS = testnetAddresses.EraManager.address;
export const PLAN_MANAGER_ADDRESS = testnetAddresses.PlanManager.address;
export const SA_REGISTRY_ADDRESS = testnetAddresses.ServiceAgreementRegistry.address;
export const REWARD_DIST_ADDRESS = testnetAddresses.RewardsDistributer.address;
export const AIRDROP_ADDRESS = testnetAddresses.Airdropper.address;

export const getUpsertAt = (handler: string, event: AcalaEvmEvent<any>): string => {
  const upsertAt = `${handler}:${event.blockNumber}:${event.transactionHash}`;
  return upsertAt;
};

export const getErrorText = (handler: string, error: string) => {
  return `${handler}:${error}`;
};

export const recordException = async (txHash: string, error: string): Promise<void> => {
  const exception = Exception.create({
    id: txHash,
    error,
  });

  await exception.save();
};
