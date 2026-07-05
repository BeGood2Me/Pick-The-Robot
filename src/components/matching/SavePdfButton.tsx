'use client';

import { Button } from '@/components/ui/Button';

export function SavePdfButton() {
  function handleSave() {
    window.print();
  }

  return (
    <Button type="button" variant="secondary" onClick={handleSave}>
      Print results
    </Button>
  );
}
