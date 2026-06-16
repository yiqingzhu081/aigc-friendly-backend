// src/bootstraps/api/api.controller.ts
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiService, type ApiHealthPayload, type ApiReadinessPayload } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  getRoot(): Record<string, unknown> {
    return {
      status: 'ok',
      service: 'aigc-friendly-backend',
      message: '欢迎使用魔法道具工坊 API',
      endpoints: {
        health: '/health',
        readiness: '/health/readiness',
        graphql: '/graphql',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth(): ApiHealthPayload {
    return this.apiService.getHealth();
  }

  @Get('health/readiness')
  async getReadiness(): Promise<ApiReadinessPayload> {
    try {
      return await this.apiService.getReadiness();
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'api',
        checks: {
          database: 'down',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
