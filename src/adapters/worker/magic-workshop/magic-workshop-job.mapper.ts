import type { MagicItemCraftPayload } from '@src/modules/magic-workshop/magic-workshop.types';
import type { Job } from 'bullmq';

export const MAGIC_WORKSHOP_QUEUE_NAME = 'magic-workshop';
export const MAGIC_CRAFT_JOB_NAME = 'craft';

export type MagicCraftJob = Job<
  MagicItemCraftPayload,
  MagicCraftResult,
  typeof MAGIC_CRAFT_JOB_NAME
>;
export type MagicCraftFailedJob = Job<Record<string, unknown>, unknown, string>;

export interface MagicCraftResult {
  readonly craftId: string;
  readonly qualityLevel: string;
  readonly resultDescription: string;
  readonly craftLog: string;
}
