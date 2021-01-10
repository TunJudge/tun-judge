// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isEmpty(s: any): boolean {
  return [null, undefined, ''].includes(s);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (event) => {
      if (event.target?.readyState === FileReader.DONE) {
        resolve((event.target.result as string).split(';base64,').pop()!);
      }
    };
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function generalComparator(a: any, b: any): number {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length - b.length;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    if (a.name && b.name) {
      return generalComparator(a.name, b.name);
    }
    return generalComparator(a.id, b.id);
  }
  return 0;
}
