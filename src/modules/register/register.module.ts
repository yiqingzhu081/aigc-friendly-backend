// src/modules/register/register.module.ts

import { AccountInstallerModule } from '@modules/account/account-installer.module';
import { ThirdPartyAuthModule } from '@modules/third-party-auth/third-party-auth.module';
import { PasswordModule } from '@modules/common/password/password.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AccountInstallerModule,
    ThirdPartyAuthModule,
    PasswordModule, // 导入 PasswordModule 以提供 PasswordPolicyService
  ],
})
export class RegisterModule {}
