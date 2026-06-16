import { Injectable } from '@nestjs/common';
import { MagicWorkshopService } from '@src/modules/magic-workshop/magic-workshop.service';
import { MagicItemQuality, MagicItemType } from '@src/modules/magic-workshop/magic-workshop.types';
import type { MagicCraftJob, MagicCraftResult } from './magic-workshop-job.mapper';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MagicWorkshopJobHandler {
  constructor(
    private readonly workshopService: MagicWorkshopService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MagicWorkshopJobHandler.name);
  }

  async processCraft({ job }: { readonly job: MagicCraftJob }): Promise<MagicCraftResult> {
    const { craftId, itemName, itemType, materialLevel, requestNote } = job.data;

    await this.workshopService.updateStatusProcessing(craftId);

    const craftResult = await this.performCraft({
      itemName,
      itemType,
      materialLevel,
      requestNote,
    });

    await this.workshopService.updateStatusSucceeded(
      craftId,
      craftResult.qualityLevel,
      craftResult.resultDescription,
      craftResult.craftLog,
    );

    return {
      craftId,
      qualityLevel: craftResult.qualityLevel,
      resultDescription: craftResult.resultDescription,
      craftLog: craftResult.craftLog,
    };
  }

  async onCraftCompleted({ job }: { readonly job: MagicCraftJob }): Promise<void> {
    await Promise.resolve();
    this.logger.info({ jobId: job.id }, 'Magic craft job completed');
  }

  async onCraftFailed({
    job,
    error,
  }: {
    readonly job: MagicCraftJob | undefined;
    readonly error: Error;
  }): Promise<void> {
    if (job?.data?.craftId) {
      await this.workshopService.updateStatusFailed(job.data.craftId, error.message);
    }
    this.logger.error({ err: error, jobId: job?.id }, 'Magic craft job failed');
  }

  private async performCraft(input: {
    readonly itemName: string;
    readonly itemType: MagicItemType;
    readonly materialLevel: number;
    readonly requestNote?: string;
  }): Promise<{
    readonly qualityLevel: MagicItemQuality;
    readonly resultDescription: string;
    readonly craftLog: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

    const qualityLevel = this.determineQuality(input.materialLevel);
    const resultDescription = this.generateDescription({
      itemName: input.itemName,
      itemType: input.itemType,
      qualityLevel,
    });
    const craftLog = this.generateCraftLog({
      itemName: input.itemName,
      itemType: input.itemType,
      materialLevel: input.materialLevel,
      qualityLevel,
      requestNote: input.requestNote,
    });

    return {
      qualityLevel,
      resultDescription,
      craftLog,
    };
  }

  private determineQuality(materialLevel: number): MagicItemQuality {
    const rand = Math.random();
    const baseChance = materialLevel * 0.15;

    if (rand < baseChance) {
      return MagicItemQuality.LEGENDARY;
    }
    if (rand < baseChance + 0.2) {
      return MagicItemQuality.EPIC;
    }
    if (rand < baseChance + 0.4) {
      return MagicItemQuality.RARE;
    }
    return MagicItemQuality.COMMON;
  }

  private generateDescription(input: {
    readonly itemName: string;
    readonly itemType: MagicItemType;
    readonly qualityLevel: MagicItemQuality;
  }): string {
    const typeDescriptions: Record<MagicItemType, string> = {
      [MagicItemType.WEAPON]: '一把蕴含神秘力量的武器',
      [MagicItemType.ARMOR]: '一件附有魔法加持的护甲',
      [MagicItemType.TOOL]: '一件神奇的魔法工具',
      [MagicItemType.TOY]: '一件充满魔力的玩具',
    };

    const qualityDescriptions: Record<string, string> = {
      [MagicItemQuality.COMMON]: '普通品质，蕴含微弱的魔力',
      [MagicItemQuality.RARE]: '稀有品质，散发着淡淡的光芒',
      [MagicItemQuality.EPIC]: '史诗品质，蕴含强大的力量',
      [MagicItemQuality.LEGENDARY]: '传说品质，散发着耀眼的光芒',
    };

    return `${qualityDescriptions[input.qualityLevel]} - ${input.itemName}：${typeDescriptions[input.itemType]}`;
  }

  private generateCraftLog(input: {
    readonly itemName: string;
    readonly itemType: MagicItemType;
    readonly materialLevel: number;
    readonly qualityLevel: string;
    readonly requestNote?: string;
  }): string {
    const logs: string[] = [];
    logs.push(`[开始制作] ${input.itemName} (${input.itemType})`);
    logs.push(`[材料等级] ${input.materialLevel}/5`);
    if (input.requestNote) {
      logs.push(`[备注要求] ${input.requestNote}`);
    }
    logs.push(`[工艺阶段] 熔炼材料...`);
    logs.push(`[工艺阶段] 注入魔力...`);
    logs.push(`[工艺阶段] 塑形打磨...`);
    logs.push(`[工艺阶段] 附魔完成...`);
    logs.push(`[品质鉴定] ${input.qualityLevel}`);
    logs.push(`[制作完成] ${input.itemName} 已成功打造！`);
    return logs.join('\n');
  }
}
