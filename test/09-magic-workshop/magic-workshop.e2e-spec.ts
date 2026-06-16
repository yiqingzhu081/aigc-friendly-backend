import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppConfigModule } from '@src/infrastructure/config/config.module';
import { LoggerModule } from '@src/infrastructure/logger/logger.module';
import { DatabaseModule } from '@src/infrastructure/database/database.module';
import { BullMqModule } from '@src/infrastructure/bullmq/bullmq.module';
import { GraphQLAdapterModule } from '@src/adapters/api/graphql/graphql-adapter.module';
import { MagicWorkshopModule } from '@src/modules/magic-workshop/magic-workshop.module';
import { MagicWorkshopUsecasesModule } from '@src/usecases/magic-workshop/magic-workshop-usecases.module';
import { RedisModule } from '@src/infrastructure/redis/redis.module';
import { TypeOrmTransactionModule } from '@src/infrastructure/database/transaction/typeorm-transaction.module';
import {
  MagicItemType,
  MagicItemCraftStatus,
} from '@src/modules/magic-workshop/magic-workshop.types';

describe('Magic Workshop (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        LoggerModule,
        DatabaseModule,
        TypeOrmTransactionModule,
        RedisModule,
        BullMqModule,
        MagicWorkshopModule,
        MagicWorkshopUsecasesModule,
        GraphQLAdapterModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createMagicItemCraftTask', () => {
    it('should create a craft task successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
                status
                itemName
                createdAt
              }
            }
          `,
          variables: {
            input: {
              itemName: '火焰戒指',
              itemType: MagicItemType.WEAPON,
              materialLevel: 3,
              requestNote: '请打造一枚火焰属性的戒指',
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.data.createMagicItemCraftTask).toBeDefined();
      expect(response.body.data.createMagicItemCraftTask.id).toBeDefined();
      expect(response.body.data.createMagicItemCraftTask.status).toBe(MagicItemCraftStatus.PENDING);
      expect(response.body.data.createMagicItemCraftTask.itemName).toBe('火焰戒指');
    });

    it('should reject invalid material level (less than 1)', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              itemName: '测试道具',
              itemType: MagicItemType.TOOL,
              materialLevel: 0,
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid material level (greater than 5)', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              itemName: '测试道具',
              itemType: MagicItemType.TOOL,
              materialLevel: 6,
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject empty item name', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              itemName: '',
              itemType: MagicItemType.WEAPON,
              materialLevel: 1,
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid item type', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              itemName: '测试道具',
              itemType: 'INVALID_TYPE',
              materialLevel: 1,
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('magicItemCraftTask', () => {
    it('should return null for non-existent task', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetCraftTask($input: GetMagicItemCraftTaskInput!) {
              magicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              id: 'non-existent-id-12345',
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.data.magicItemCraftTask).toBeNull();
    });

    it('should return task details for existing task', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCraftTask($input: CreateMagicItemCraftTaskInput!) {
              createMagicItemCraftTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              itemName: '隐身斗篷',
              itemType: MagicItemType.ARMOR,
              materialLevel: 4,
            },
          },
        });

      const taskId = createResponse.body.data.createMagicItemCraftTask.id;

      const getResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetCraftTask($input: GetMagicItemCraftTaskInput!) {
              magicItemCraftTask(input: $input) {
                id
                itemName
                itemType
                status
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              id: taskId,
            },
          },
        });

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.magicItemCraftTask).toBeDefined();
      expect(getResponse.body.data.magicItemCraftTask.id).toBe(taskId);
      expect(getResponse.body.data.magicItemCraftTask.itemName).toBe('隐身斗篷');
      expect(getResponse.body.data.magicItemCraftTask.itemType).toBe(MagicItemType.ARMOR);
      expect(getResponse.body.data.magicItemCraftTask.status).toBe(MagicItemCraftStatus.PENDING);
    });
  });

  describe('magicItemCraftTasks', () => {
    it('should return list of craft tasks', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetCraftTasks {
              magicItemCraftTasks {
                items {
                  id
                  itemName
                  status
                }
              }
            }
          `,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.magicItemCraftTasks).toBeDefined();
      expect(Array.isArray(response.body.data.magicItemCraftTasks.items)).toBe(true);
    });
  });
});
