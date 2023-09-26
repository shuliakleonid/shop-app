import { RolesBuilder } from 'nest-access-control';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY
  .grant(Role.CUSTOMER)
  .read('customerData')
  .create('customerData')
  .update('customerData')
  .delete('customerData')
  .grant(Role.ADMINISTRATOR)
  .extend(Role.CUSTOMER)
  .read('adminData')
  .create('adminData')
  .update('adminData')
  .delete('adminData');
