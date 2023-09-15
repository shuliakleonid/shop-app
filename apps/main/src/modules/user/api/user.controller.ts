import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { UseRoles } from 'nest-access-control';

@Controller('customer')
export class UserController {
  constructor(private readonly customerQueryRepository: UserQueryRepository) {}
  @UseRoles({
    resource: 'customerData',
    action: 'read',
    possession: 'any',
  })
  @Get()
  getAllCustomers() {
    return this.customerQueryRepository.getAllCustomers();
  }

  @Delete(':id')
  deleteCustomer(@Param('id') id: number) {
    return `delete customer ${id}`;
  }
}
