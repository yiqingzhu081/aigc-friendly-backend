export enum MagicItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  TOOL = 'TOOL',
  TOY = 'TOY',
}

export enum MagicItemQuality {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum MagicItemCraftStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export interface CreateMagicItemCraftInput {
  readonly itemName: string;
  readonly itemType: MagicItemType;
  readonly materialLevel: number;
  readonly requestNote?: string;
}

export interface MagicItemCraftResult {
  readonly id: string;
  readonly status: MagicItemCraftStatus;
  readonly itemName: string;
  readonly createdAt: Date;
}

export interface MagicItemCraftDetail {
  readonly id: string;
  readonly itemName: string;
  readonly itemType: MagicItemType;
  readonly status: MagicItemCraftStatus;
  readonly qualityLevel?: MagicItemQuality;
  readonly resultDescription?: string;
  readonly craftLog?: string;
  readonly failureReason?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MagicItemCraftPayload {
  readonly craftId: string;
  readonly itemName: string;
  readonly itemType: MagicItemType;
  readonly materialLevel: number;
  readonly requestNote?: string;
}
