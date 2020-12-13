import { Module } from '@nestjs/common';
import { DockerModule } from './docker/docker.module';

@Module({
  imports: [DockerModule],
})
export class AppModule {}
