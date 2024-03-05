import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider';

declare global {
  interface Window {
    $dialog: DialogApiInjection;
  }
}
