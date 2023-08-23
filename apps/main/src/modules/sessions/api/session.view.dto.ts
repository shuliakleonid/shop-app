import { SessionEntity } from '../domain/session.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DeviceViewModel {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  lastVisit: string;

  @ApiProperty()
  deviceId: number;

  constructor(session: SessionEntity) {
    this.ip = session.ip;
    this.userAgent = session.deviceName;
    this.lastVisit = new Date(session.iat * 1000).toISOString();
    this.deviceId = session.deviceId;
  }
}

export class DevicesViewModel {
  @ApiProperty({ type: [DeviceViewModel] })
  devices: DeviceViewModel[];

  @ApiProperty()
  currentDeviceId: number;

  constructor(sessions: SessionEntity[], currentDeviceId: number) {
    this.devices = sessions.map(session => new DeviceViewModel(session));
    this.currentDeviceId = currentDeviceId;
  }
}
