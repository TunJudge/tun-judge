import { deserialize, serialize } from '@zenstackhq/runtime/browser';

export function marshal(value: unknown) {
  const { data, meta } = serialize(value);
  if (meta) {
    return JSON.stringify({ ...(data as any), meta: { serialization: meta } });
  } else {
    return JSON.stringify(data);
  }
}

export function unmarshal(value: string) {
  const parsed = JSON.parse(value);
  if (parsed.data && parsed.meta?.serialization) {
    const deserializedData = deserialize(parsed.data, parsed.meta.serialization);
    return { ...parsed, data: deserializedData };
  } else {
    return parsed;
  }
}
