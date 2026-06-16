// src/bootstraps/api/main.ts
import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import type { Express } from 'express';
import { Logger } from 'nestjs-pino';
import { createConnection } from 'net';
import { Redis } from 'ioredis';
import { initGraphQLSchema } from '@src/adapters/api/graphql/schema/schema.init';
import { ApiModule } from '@src/bootstraps/api/api.module';

/**
 * 检查 MySQL 连接是否就绪
 */
async function checkMySQL(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(port, host);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.setTimeout(2000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/**
 * 检查 Redis 连接是否就绪
 */
async function checkRedis(host: string, port: number): Promise<boolean> {
  const client = new Redis({
    host,
    port,
    connectTimeout: 2000,
  });

  try {
    await client.ping();
    await client.quit();
    return true;
  } catch {
    client.disconnect();
    return false;
  }
}

/**
 * 等待服务就绪
 */
async function waitForService(
  serviceName: string,
  checkFn: () => Promise<boolean>,
  maxRetries: number = 30,
  retryDelay: number = 1000,
): Promise<void> {
  console.log(`[启动检查] 等待 ${serviceName} 服务就绪...`);

  for (let retry = 1; retry <= maxRetries; retry++) {
    if (await checkFn()) {
      console.log(`[启动检查] ${serviceName} 服务就绪 ✓`);
      return;
    }
    console.log(`[启动检查] ${serviceName} 服务未就绪，重试中 (${retry}/${maxRetries})`);
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }

  throw new Error(`${serviceName} 服务启动超时，请检查服务是否正常运行`);
}

/**
 * 应用程序启动函数
 * 使用 NestJS ConfigService 获取配置信息
 */
async function bootstrap() {
  // 启动前检查 MySQL 和 Redis 服务
  const configService = new ConfigService();
  const mysqlHost = configService.get<string>('db.host', '127.0.0.1');
  const mysqlPort = configService.get<number>('db.port', 3306);
  const redisHost = configService.get<string>('redis.host', '127.0.0.1');
  const redisPort = configService.get<number>('redis.port', 6379);

  try {
    await waitForService('MySQL', () => checkMySQL(mysqlHost, mysqlPort));
    await waitForService('Redis', () => checkRedis(redisHost, redisPort));
  } catch (error) {
    console.error('[启动检查] 服务检查失败:', (error as Error).message);
    process.exit(1);
  }

  initGraphQLSchema();
  const app = await NestFactory.create(ApiModule);
  app.enableShutdownHooks();

  // 隐匿技术栈：移除 Express 默认的 X-Powered-By 响应头
  const expressApp = app.getHttpAdapter().getInstance() as unknown as Express;
  expressApp.disable('x-powered-by');

  // 启用 class-validator 的依赖注入支持
  useContainer(app.select(ApiModule), { fallbackOnErrors: true });

  // 获取 ConfigService 实例（从应用容器中）
  const appConfigService = app.get<ConfigService>(ConfigService);

  // 全局启用 CORS（按配置限制来源与凭据）
  const corsEnabled = appConfigService.get<boolean>('server.cors.enabled', true);
  if (corsEnabled) {
    const originsStr = appConfigService.get<string>('server.cors.origins', '');
    const origins = originsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    app.enableCors({
      origin: origins.length > 0 ? origins : true,
      credentials: appConfigService.get<boolean>('server.cors.credentials', true),
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'ETag'],
      maxAge: 600,
    });
  }

  // 获取 PinoLogger 实例
  const logger = app.get(Logger);

  // 从配置服务中获取服务器配置
  const host = appConfigService.get<string>('server.host', '127.0.0.1');
  const port = appConfigService.get<number>('server.port', 3000);
  const nodeEnv = appConfigService.get<string>('NODE_ENV', 'development');

  await app.listen(port, host);

  // 使用 PinoLogger 记录服务器启动信息
  logger.log(`🚀 NestJS 服务在 http://${host}:${port} 上以 ${nodeEnv} 模式启动成功`);
}

void bootstrap();
