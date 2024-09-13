import { getDuration, paramsToString } from '../utils';
import { logger } from './logger';
import { loggerStore } from './logger-store';

const decorateMethod =
  (context: string): MethodDecorator =>
  (target, methodName, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const currentMethod = descriptor.value;
    const metadataKeys = Reflect.getMetadataKeys(currentMethod);

    const onSuccess = (time: number, params: Record<string, unknown>) => (result: unknown) => {
      const duration = getDuration(time);
      logger.debug?.(
        {
          message: `[OUT] ${String(methodName)}(${paramsToString(params)}) - ${duration} ms`,
          methodName,
          duration: `${duration} ms`,
          ...loggerStore.getStore(),
        },
        context,
      );

      return result;
    };

    const onError = (time: number, params: Record<string, unknown>) => (error?: Error) => {
      const duration = getDuration(time);
      logger.error(
        {
          message: `[OUT] ${String(methodName)}(${paramsToString(params)}) (${
            error?.message ?? '-'
          }) - ${duration} ms`,
          methodName,
          duration: `${duration} ms`,
          ...loggerStore.getStore(),
        },
        error?.stack,
        context,
      );

      throw error;
    };

    descriptor.value = function (...args: unknown[]) {
      const params: Record<string, unknown> = {};

      for (let i = 0; i < args.length; i++) {
        const key = `${target.constructor.name}_${String(methodName)}`;
        const paramsMap = paramInfo.get(key);
        if (paramsMap && paramsMap.has(i)) {
          const paramName = paramsMap.get(i);
          if (paramName && args[i] !== undefined && args[i] !== null) {
            params[paramName] = args[i];
          }
        }
      }

      const time = performance.now();
      logger.debug?.(
        {
          message: `[IN] ${String(methodName)}(${paramsToString(params)})`,
          methodName,
          ...loggerStore.getStore(),
        },
        context,
      );

      try {
        const result = currentMethod.apply(this, args);

        if (result instanceof Promise || String(result) === '[object PrismaPromise]') {
          return result.then(onSuccess(time, params)).catch(onError(time, params));
        }

        return onSuccess(time, params)(result);
      } catch (error: unknown) {
        onError(time, params)(error as Error);
      }
    };

    Object.defineProperty(descriptor.value, 'name', { value: methodName });

    for (const key of metadataKeys) {
      const value = Reflect.getMetadata(key, currentMethod);
      Reflect.defineMetadata(key, value, descriptor.value);
    }

    return descriptor;
  };

export const LogClass: ClassDecorator = ({ name, prototype }) => {
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (propertyName) => propertyName !== 'constructor' && prototype[propertyName] instanceof Function,
  );

  for (const methodName of methodNames) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);

    if (!descriptor) continue;

    Object.defineProperty(
      prototype,
      methodName,
      decorateMethod(name)(prototype, methodName, descriptor) as PropertyDescriptor,
    );
  }
};

const paramInfo: Map<string, Map<number, string>> = new Map();

export const LogParam: (name: string) => ParameterDecorator =
  (name) => (target, methodName, parameterIndex) => {
    const key = `${target.constructor.name}_${String(methodName)}`;
    let params = paramInfo.get(key);
    if (params) {
      params.set(parameterIndex, name);
    } else {
      params = new Map();
      params.set(parameterIndex, name);
      paramInfo.set(key, params);
    }
  };
