import { Connection, FindConditions, FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { ObjectID } from 'typeorm/driver/mongodb/typings';

export class ExtendedRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  constructor(private readonly repository: Repository<Entity>) {
    super();
    Object.assign(this, repository);
  }

  findOneOrThrow(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>,
    exception?: Error
  ): Promise<Entity>;

  findOneOrThrow(id?: string | number | Date | ObjectID, exception?: Error): Promise<Entity>;

  findOneOrThrow(conditions?: FindConditions<Entity>, exception?: Error): Promise<Entity>;

  findOneOrThrow(options?: FindOneOptions<Entity>, exception?: Error): Promise<Entity>;

  findOneOrThrow(
    conditions?: FindConditions<Entity>,
    options?: FindOneOptions<Entity>,
    exception?: Error
  ): Promise<Entity>;

  async findOneOrThrow(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    optionsOrException?: FindOneOptions<Entity> | Error,
    maybeException?: Error
  ): Promise<Entity> {
    try {
      return await this.manager.findOneOrFail(
        this.metadata.target,
        optionsOrConditions as any,
        optionsOrException instanceof Error ? undefined : optionsOrException
      );
    } catch (_) {
      throw maybeException ? maybeException : optionsOrException;
    }
  }
}

export const CustomRepositoryProvider = (entity: any) => ({
  provide: `${entity.name}Repository`,
  useFactory: (connection: Connection) =>
    new ExtendedRepository<any>(connection.getRepository(entity)),
  inject: [Connection],
});
