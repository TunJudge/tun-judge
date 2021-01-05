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
