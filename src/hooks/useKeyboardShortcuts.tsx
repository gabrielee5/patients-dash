import { useEffect } from 'react';

export type ShortcutAction =
  | 'newPatient'
  | 'newVisit'
  | 'search'
  | 'dashboard'
  | 'patients'
  | 'toggleTheme';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: ShortcutAction;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'n', ctrl: true, action: 'newPatient', description: 'New Patient' },
  { key: 'v', ctrl: true, action: 'newVisit', description: 'New Visit' },
  { key: 'f', ctrl: true, action: 'search', description: 'Search' },
  { key: 'd', ctrl: true, action: 'dashboard', description: 'Go to Dashboard' },
  { key: 'p', ctrl: true, action: 'patients', description: 'Go to Patients' },
  { key: 't', ctrl: true, shift: true, action: 'toggleTheme', description: 'Toggle Theme' },
];

export const useKeyboardShortcuts = (
  handlers: Partial<Record<ShortcutAction, () => void>>
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          const handler = handlers[shortcut.action];
          if (handler) {
            event.preventDefault();
            handler();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);

  return shortcuts;
};

export { shortcuts };
