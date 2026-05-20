// src/modules/identity-management/identity-management.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInstallerModule } from '@src/modules/account/account-installer.module';
import { CoachServiceModule } from '@src/modules/account/identities/training/coach/coach-service.module';
import { CustomerServiceModule } from '@src/modules/account/identities/training/customer/customer-service.module';
import { LearnerIdentityModule } from '@src/modules/account/identities/training/learner/learner.module';
import { ManagerServiceModule } from '@src/modules/account/identities/training/manager/manager-service.module';
import { CoachQueryService } from '@src/modules/account/queries/coach.query.service';
import { CustomerQueryService } from '@src/modules/account/queries/customer.query.service';
import { LearnerQueryService } from '@src/modules/account/queries/learner.query.service';
import { ManagerQueryService } from '@src/modules/account/queries/manager.query.service';
import { AuthModule } from '@src/modules/auth/auth.module';

/**
 * Legacy training identity-management module.
 * P5 will remove or replace these training-specific services.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([]), // 为 DataSource 注入提供支持
    AccountInstallerModule, // 提供账户相关服务
    CustomerServiceModule, // 提供 CustomerService
    CoachServiceModule, // 提供 CoachService
    LearnerIdentityModule, // 提供 LearnerService
    ManagerServiceModule, // 提供 ManagerService
    AuthModule, // 提供认证相关服务
  ],
  providers: [CoachQueryService, CustomerQueryService, LearnerQueryService, ManagerQueryService],
  exports: [
    AccountInstallerModule,
    CustomerServiceModule,
    CoachServiceModule,
    LearnerIdentityModule,
    ManagerServiceModule,
    CoachQueryService,
    CustomerQueryService,
    LearnerQueryService,
    ManagerQueryService,
  ],
})
export class IdentityManagementModule {}
