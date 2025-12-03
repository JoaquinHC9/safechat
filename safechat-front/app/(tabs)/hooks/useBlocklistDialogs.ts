import { useState } from 'react';

interface DialogState {
  visible: boolean;
  data?: any;
}

export const useBlocklistDialogs = () => {
  const [removeDialog, setRemoveDialog] = useState<DialogState>({ visible: false });
  const [importDialog, setImportDialog] = useState({ visible: false });
  const [exportDialog, setExportDialog] = useState({ visible: false, message: '' });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const openRemoveDialog = (id: string, numero: string) => {
    setRemoveDialog({ visible: true, data: { id, numero } });
  };

  const closeRemoveDialog = () => {
    setRemoveDialog({ visible: false });
  };

  const openImportDialog = () => {
    setImportDialog({ visible: true });
  };

  const closeImportDialog = () => {
    setImportDialog({ visible: false });
  };

  const openExportDialog = (message: string) => {
    setExportDialog({ visible: true, message });
  };

  const closeExportDialog = () => {
    setExportDialog({ visible: false, message: '' });
  };

  return {
    removeDialog,
    openRemoveDialog,
    closeRemoveDialog,
    isRemoving,
    setIsRemoving,
    importDialog,
    openImportDialog,
    closeImportDialog,
    exportDialog,
    openExportDialog,
    closeExportDialog,
    isExporting,
    setIsExporting,
  };
};
