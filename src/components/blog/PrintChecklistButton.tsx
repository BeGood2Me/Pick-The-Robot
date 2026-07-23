'use client';

import { Button } from '@/components/ui/Button';

const PRINT_CLASS = 'printing-checklist';

export function PrintChecklistButton() {
  function handlePrint() {
    document.body.classList.add(PRINT_CLASS);
    const cleanup = () => {
      document.body.classList.remove(PRINT_CLASS);
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  return (
    <Button type="button" variant="secondary" onClick={handlePrint}>
      Print checklist (PDF)
    </Button>
  );
}
