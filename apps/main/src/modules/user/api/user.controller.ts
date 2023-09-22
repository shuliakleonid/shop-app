import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { UseRoles } from 'nest-access-control';
import { JwtAuthGuard } from '@main/modules/auth/api/guards/jwt-auth.guard';

@Controller('customer')
@UseGuards(JwtAuthGuard)
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

  @UseRoles({
    resource: 'adminData',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  deleteCustomer(@Param('id') id: number) {
    return `delete customer ${id}`;
  }
}
