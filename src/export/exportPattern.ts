import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { mm } from '../patternGenerator';
import { buildSvg } from '../svg/buildSvg';
import { WalletPattern } from '../types';

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

async function shareOrThrow(uri: string, mimeType: string, dialogTitle: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(uri, { mimeType, dialogTitle, UTI: undefined });
}

/**
 * Write the pattern to a standalone .svg file in the cache directory and open
 * the share sheet so the user can save or send it. Returns the file URI.
 */
export async function exportSvg(pattern: WalletPattern): Promise<string> {
  const svg = buildSvg(pattern);
  const file = new File(Paths.cache, `wallet-pattern-${timestamp()}.svg`);
  file.create({ overwrite: true });
  file.write(svg);

  await shareOrThrow(file.uri, 'image/svg+xml', 'Save wallet pattern (SVG)');
  return file.uri;
}

/**
 * Render the pattern to a print-ready PDF (the SVG embedded 1:1 at real size)
 * and open the share sheet. Returns the generated PDF URI.
 */
export async function exportPdf(pattern: WalletPattern): Promise<string> {
  const svg = buildSvg(pattern);
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { margin: 0; }
      html, body { margin: 0; padding: 0; }
      .wrap { padding: 16px; box-sizing: border-box; }
      svg { display: block; }
    </style>
  </head>
  <body>
    <div class="wrap">${svg}</div>
  </body>
</html>`;

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  // Give the file a friendlier name before sharing where possible.
  let shareUri = uri;
  try {
    const dest = new File(Paths.cache, `wallet-pattern-${timestamp()}.pdf`);
    if (dest.exists) dest.delete();
    await new File(uri).move(dest);
    shareUri = dest.uri;
  } catch {
    // Fall back to the original temp URI if the rename fails.
    shareUri = uri;
  }

  await shareOrThrow(shareUri, 'application/pdf', 'Save wallet pattern (PDF)');
  return shareUri;
}

/** Human summary of the pattern, used in the output overlay. */
export function patternSummary(pattern: WalletPattern): string {
  if (Platform.OS === 'web') {
    return `${mm(pattern.width)} × ${mm(pattern.height)} mm`;
  }
  return `${mm(pattern.width)} × ${mm(pattern.height)} mm · ${pattern.stitchHoles.length} stitch holes`;
}
