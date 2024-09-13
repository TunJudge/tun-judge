import { Logger } from '@nestjs/common';

import { LoggerFactory } from './logger.factory';

const decorateMethod =
  (logger: Logger): MethodDecorator =>
  (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const currentMethod = descriptor.value;
    const metadataKeys = Reflect.getMetadataKeys(currentMethod);

    const onSuccess = (time: number) => (result: any) => {
      logger.debug(`[OUT] ${String(propertyKey)}() - ${getDuration(time)} s`);

      return result;
    };

    const onError = (time: number) => (error: any) => {
      logger.error(`[OUT] ${String(propertyKey)}() - ${getDuration(time)} s`, error.stack);

      throw error;
    };

    descriptor.value = function (...args: any[]) {
      const time = Date.now();
      logger.debug(`[IN] ${String(propertyKey)}()`);

      try {
        const result = currentMethod.apply(this, args);

        if (result instanceof Promise) {
          return result.then(onSuccess(time)).catch(onError(time));
        }

        return onSuccess(time)(result);
      } catch (error) {
        onError(time)(error);
      }
    };

    Object.defineProperty(descriptor.value, 'name', { value: propertyKey });

    for (const key of metadataKeys) {
      const value = Reflect.getMetadata(key, currentMethod);
      Reflect.defineMetadata(key, value, descriptor.value);
    }

    return descriptor;
  };

export const LogClass: ClassDecorator = ({ name, prototype }) => {
  const logger = LoggerFactory.getInstance(name);
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (propertyName) => propertyName !== 'constructor' && prototype[propertyName] instanceof Function,
  );

  for (const methodName of methodNames) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);

    if (!descriptor) continue;

    Object.defineProperty(
      prototype,
      methodName,
      decorateMethod(logger)(prototype, methodName, descriptor) as PropertyDescriptor,
    );
  }
};

function getDuration(oldTime: number): string {
  return String((Date.now() - oldTime) / 1000).padEnd(3, '0');
}
