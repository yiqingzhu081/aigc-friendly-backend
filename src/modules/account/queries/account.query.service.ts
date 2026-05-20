// src/modules/account/queries/account.query.service.ts
import { IdentityTypeEnum, UserAccountView } from '@app-types/models/account.types';
import { UserInfoView } from '@app-types/models/auth.types';
import { Gender, UserState } from '@app-types/models/user-info.types';
import { UsecaseSession } from '@app-types/auth/session.types';
import { hasRole } from '@core/account/policy/role-access.policy';
import { canViewUserInfo } from '@core/account/policy/user-info-visibility.policy';
import { ACCOUNT_ERROR } from '@core/common/errors';
import { DomainError, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../base/entities/account.entity';
import { AccountService, type AccountTransactionManager } from '../base/services/account.service';

export type VisibleDetailMode = 'BASIC' | 'FULL';

@Injectable()
export class AccountQueryService {
  constructor(private readonly accountService: AccountService) {}

  async getAccountById(params: {
    session: UsecaseSession;
    targetAccountId: number;
  }): Promise<UserAccountView> {
    const { session, targetAccountId } = params;

    if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
      throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
    }

    const allowed = this.isAllowedToViewAccountDetail(session, targetAccountId);
    if (!allowed) {
      throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限查看该账户信息');
    }

    return this.accountService.getAccountById(targetAccountId);
  }

  toUserAccountView(account: AccountEntity): UserAccountView {
    return this.accountService.toUserAccountView(account);
  }

  async getVisibleUserInfo(params: {
    session: UsecaseSession;
    targetAccountId: number;
    detail?: VisibleDetailMode;
  }): Promise<UserInfoView> {
    const { session, targetAccountId } = params;
    const detail: VisibleDetailMode = params.detail ?? 'FULL';

    if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
      throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
    }

    const allowed = this.isAllowedToView(session, targetAccountId);
    if (!allowed) {
      throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限查看该用户信息');
    }

    const view = await this.getUserInfoViewStrict({ accountId: targetAccountId });

    if (detail === 'BASIC') {
      return this.maskToBasic(view);
    }
    return view;
  }

  async getUserInfoViewStrict(params: {
    accountId: number;
    accessGroup?: IdentityTypeEnum[];
    manager?: AccountTransactionManager;
  }): Promise<
    UserInfoView & {
      nickname: string;
      userState: UserState;
      notifyCount: number;
      unreadCount: number;
      createdAt: Date;
      updatedAt: Date;
    }
  > {
    const { accountId } = params;

    const base = await this.accountService.findUserInfoByAccountId(accountId, params.manager);
    if (!base) {
      throw new DomainError(
        ACCOUNT_ERROR.USER_INFO_NOT_FOUND,
        `账户 ID ${accountId} 对应的用户信息不存在，无法完成操作`,
      );
    }

    const finalAccessGroup = this.normalizeAccessGroup(base.accessGroup);

    return this.buildUserInfoView(base, accountId, finalAccessGroup) as UserInfoView & {
      nickname: string;
      userState: UserState;
      notifyCount: number;
      unreadCount: number;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  private isAllowedToView(session: UsecaseSession, targetAccountId: number): boolean {
    const isSelf = session.accountId === targetAccountId;
    if (isSelf) return true;
    if (hasRole(session.roles, IdentityTypeEnum.ADMIN)) return true;

    return canViewUserInfo(session.roles, { isSelf });
  }

  private isAllowedToViewAccountDetail(session: UsecaseSession, targetAccountId: number): boolean {
    const isSelf = session.accountId === targetAccountId;
    if (isSelf) return true;
    if (hasRole(session.roles, IdentityTypeEnum.ADMIN)) return true;
    return false;
  }

  private buildUserInfoView(
    base: Awaited<ReturnType<AccountService['findUserInfoByAccountId']>>,
    accountId: number,
    accessGroup: IdentityTypeEnum[],
  ): UserInfoView {
    return {
      accountId,
      accessGroup,
      ...this.buildBasicFields(base),
      ...this.buildContactFields(base),
      ...this.buildExtendedFields(base),
      ...this.buildSystemFields(base),
    };
  }

  private buildBasicFields(base: Awaited<ReturnType<AccountService['findUserInfoByAccountId']>>) {
    return {
      nickname: base?.nickname ?? '',
      gender: base?.gender ?? Gender.SECRET,
      birthDate: base?.birthDate ?? null,
      avatarUrl: base?.avatarUrl ?? null,
      signature: base?.signature ?? null,
    };
  }

  private buildContactFields(base: Awaited<ReturnType<AccountService['findUserInfoByAccountId']>>) {
    return {
      email: base?.email ?? null,
      address: base?.address ?? null,
      phone: base?.phone ?? null,
    };
  }

  private buildExtendedFields(
    base: Awaited<ReturnType<AccountService['findUserInfoByAccountId']>>,
  ) {
    return {
      tags: this.normalizeTags(base?.tags),
      geographic: base?.geographic ?? null,
      metaDigest: base?.metaDigest ?? null,
    };
  }

  private buildSystemFields(base: Awaited<ReturnType<AccountService['findUserInfoByAccountId']>>) {
    return {
      notifyCount: base?.notifyCount ?? 0,
      unreadCount: base?.unreadCount ?? 0,
      userState: base?.userState ?? UserState.PENDING,
      createdAt: base?.createdAt ?? new Date(),
      updatedAt: base?.updatedAt ?? new Date(),
    };
  }

  private normalizeTags(tags: unknown): string[] | null {
    if (!tags) return null;
    if (Array.isArray(tags)) return tags.map((v) => String(v));
    return null;
  }

  private normalizeAccessGroup(accessGroup?: IdentityTypeEnum[] | null): IdentityTypeEnum[] {
    const validRoles = new Set<string>(Object.values(IdentityTypeEnum));
    const normalized = (accessGroup ?? []).filter((role): role is IdentityTypeEnum =>
      validRoles.has(String(role)),
    );
    return normalized.length > 0 ? Array.from(new Set(normalized)) : [IdentityTypeEnum.REGISTRANT];
  }

  private maskToBasic(view: UserInfoView): UserInfoView {
    return {
      accountId: view.accountId,
      nickname: view.nickname,
      gender: view.gender,
      birthDate: view.birthDate,
      avatarUrl: view.avatarUrl,
      email: null,
      signature: null,
      accessGroup: view.accessGroup,
      address: null,
      phone: view.phone,
      tags: null,
      geographic: null,
      metaDigest: null,
      notifyCount: 0,
      unreadCount: 0,
      userState: view.userState,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }
}
