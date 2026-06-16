// src/infrastructure/bullmq/contracts/magic-workshop-queue.runtime.ts
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '../bullmq.constants';
import { isNonEmptyString, isOptionalNonEmptyString, isRecord } from './shared-payload-validators';

export const MAGIC_ITEM_TYPES = ['WEAPON', 'ARMOR', 'TOOL', 'TOY'] as const;
export type MagicItemTypeString = (typeof MAGIC_ITEM_TYPES)[number];

export interface MagicCraftPayload {
  readonly craftId: string;
  readonly itemName: string;
  readonly itemType: MagicItemTypeString;
  readonly materialLevel: number;
  readonly requestNote?: string;
}

export interface MagicCraftResult {
  readonly craftId: string;
  readonly qualityLevel: string;
  readonly resultDescription: string;
  readonly craftLog: string;
}

const isMagicItemType = (value: unknown): value is MagicItemTypeString => {
  if (typeof value !== 'string') return false;
  return (MAGIC_ITEM_TYPES as readonly string[]).includes(value);
};

const isSafeInt = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value) && !Number.isNaN(value);
};

const isMagicCraftPayload = (payload: unknown): payload is MagicCraftPayload => {
  if (!isRecord(payload)) return false;
  return (
    isNonEmptyString(payload.craftId) &&
    isNonEmptyString(payload.itemName) &&
    isMagicItemType(payload.itemType) &&
    isSafeInt(payload.materialLevel) &&
    payload.materialLevel >= 1 &&
    payload.materialLevel <= 5 &&
    isOptionalNonEmptyString(payload.requestNote)
  );
};

export const MAGIC_WORKSHOP_JOB_CONTRACT = {
  [BULLMQ_JOBS.MAGIC_WORKSHOP.CRAFT]: {
    payload: {} as MagicCraftPayload,
    result: {} as MagicCraftResult,
    payloadValidator: isMagicCraftPayload,
  },
} as const;

export const MAGIC_WORKSHOP_QUEUE_CONTRACT = {
  queueName: BULLMQ_QUEUES.MAGIC_WORKSHOP,
  jobs: MAGIC_WORKSHOP_JOB_CONTRACT,
} as const;
