import { RolesBuilder } from 'nest-access-control';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY
  .grant(Role.CUSTOMER)
  .readOwn('customerData')
  .grant(Role.ADMIN)
  .read('customerData')
  .update('customerData')
  .delete('customerData')
