import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Entry } from '../constants/templates';
import {
  renderDiaryHtml,
  renderLoveLetterHtml,
  renderStationeryLetterHtml,
  renderCompleteBookHtml,
} from '../templates/pdfTemplates';
import { getUserName } from './entryService';

// PDF Generator & Direct Downloader
const triggerDownload = async (html: string, fileName: string) => {
  if (Platform.OS === 'web') {
    // Generate clean print window without disrupting the active app view
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    return;
  }

  // Mobile native PDF Generation & Sharing
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: fileName,
    });
  }
};

// Export Single Page
export const exportSingleEntryPdf = async (entry: Entry): Promise<void> => {
  try {
    const author = await getUserName();

    let htmlContent = '';
    if (entry.type === 'love') {
      htmlContent = renderLoveLetterHtml(entry, 1);
    } else if (entry.type === 'parent' || entry.type === 'friend') {
      htmlContent = renderStationeryLetterHtml(entry, 1);
    } else {
      htmlContent = renderDiaryHtml(entry, 1, author);
    }

    await triggerDownload(htmlContent, `Entry_${entry.dateStr}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

// Export Complete Journal Collection as a Real Book
export const exportCollectionPdf = async (
  entries: Entry[],
  collectionTitle = 'My Diary',
  periodLabel = '2026'
): Promise<void> => {
  try {
    if (entries.length === 0) {
      alert('No entries to export in this selection');
      return;
    }

    const author = await getUserName();

    // Sort chronologically (Oldest first -> Newest last) like a real printed book
    // First written entry appears on Page 1, subsequent entries follow in order!
    const chronologicalEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);

    const bookHtml = renderCompleteBookHtml(chronologicalEntries, collectionTitle, author, periodLabel);

    await triggerDownload(bookHtml, `${collectionTitle}.pdf`);
  } catch (error) {
    console.error('Error exporting collection:', error);
    alert('Failed to export book collection.');
  }
};
