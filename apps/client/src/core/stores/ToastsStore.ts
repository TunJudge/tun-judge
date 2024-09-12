import { action, observable } from 'mobx';

export type ToastType = 'info' | 'success' | 'warn' | 'error';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  testId: string;
};

export class ToastsStore {
  @observable toasts: Toast[] = [];

  @action
  info(message: string, timeout = 3000): void {
    this.toast('info', message, timeout);
  }

  @action
  success(message: string, timeout = 3000): void {
    this.toast('success', message, timeout);
  }

  @action
  warn(message: string, timeout = 3000): void {
    this.toast('warn', message, timeout);
  }

  @action
  error(message: string, timeout = 3000): void {
    this.toast('error', message, timeout);
  }

  @action
  toast(type: ToastType, message: string, timeout = 3000): void {
    const id = Math.random().toString();
    this.toasts.push({
      id: id,
      type: type,
      message: message,
      testId: `${type}-toast`,
    });
    setTimeout(() => (this.toasts = this.toasts.filter((toast) => toast.id !== id)), timeout);
  }
}
