import { LoggingWinston } from '@google-cloud/logging-winston';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transport, transports } from 'winston';

import { config } from '../config';

export const logger = WinstonModule.createLogger({
  transports: [
    new transports.Console({
      level: config.logging.level,
      silent: config.nodeEnv === 'production',
      format: format.combine(
        format.timestamp(),
        format.ms(),
        utilities.format.nestLike(config.project, { prettyPrint: true, colors: true }),
      ),
    }),
    ...getGCPTransportation(),
  ],
});

function getGCPTransportation(): transport[] {
  return config.nodeEnv !== 'production' || config.logging.transport !== 'gcp'
    ? []
    : [
        new LoggingWinston({
          level: config.logging.level,
          serviceContext: {
            service: config.project,
            version: config.version,
          },
        }),
      ];
}
