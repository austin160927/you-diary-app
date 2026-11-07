import { Entry } from '../constants/templates';

// Common fonts
const FONTS_LINK = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
`;

// Format paragraphs cleanly with proper line breaks
const renderBody = (body: string, isCursive = false) => {
  if (!body) return '';
  return body
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<div class="spacer"></div>';
      return `<p class="${isCursive ? 'cursive' : ''}">${trimmed}</p>`;
    })
    .join('');
};

// 1. Single Entry - Book Page HTML
export const renderDiaryHtml = (entry: Entry, pageNumber = 1, userName = 'Me'): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    ${FONTS_LINK}
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 40px 50px;
        background-color: #FAF7F0;
        color: #2C221E;
        font-family: 'Lora', Georgia, serif;
        font-size: 13pt;
        line-height: 1.9;
        min-height: 100vh;
      }
      .page-frame {
        background: #FFFDF9;
        border: 1px solid #EADBCE;
        padding: 50px 60px;
        min-height: 1020px;
        position: relative;
        box-shadow: inset 0 0 40px rgba(220, 205, 190, 0.2);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1.5px solid #E6D8C8;
        padding-bottom: 12px;
        margin-bottom: 25px;
      }
      .date {
        font-family: 'Playfair Display', serif;
        font-size: 13pt;
        font-weight: 700;
        color: #8B4513;
        letter-spacing: 0.5px;
      }
      .mood {
        font-size: 16pt;
      }
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 22pt;
        font-weight: 700;
        color: #2C221E;
        margin: 0 0 25px 0;
        line-height: 1.3;
      }
      .content p {
        margin: 0 0 14px 0;
        text-align: justify;
        text-indent: 25px;
      }
      .content .spacer {
        height: 14px;
      }
      .footer {
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10pt;
        color: #A0938A;
        font-family: 'Playfair Display', serif;
        letter-spacing: 2px;
      }
    </style>
  </head>
  <body>
    <div class="page-frame">
      <div class="header">
        <div class="date">${entry.dateStr}</div>
        <div class="mood">${entry.mood || ''}</div>
      </div>
      ${entry.title ? `<div class="title">${entry.title}</div>` : ''}
      <div class="content">
        ${renderBody(entry.body)}
      </div>
      <div class="footer">- ${pageNumber} -</div>
    </div>
  </body>
  </html>
  `;
};

// 2. Love Letter - Romantic Book Page HTML
export const renderLoveLetterHtml = (entry: Entry, pageNumber = 1): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    ${FONTS_LINK}
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 40px 50px;
        background-color: #FAF3F4;
        color: #382226;
        font-family: 'Lora', Georgia, serif;
        font-size: 13pt;
        line-height: 1.9;
      }
      .letter-frame {
        background: #FFFDFD;
        border: 2px solid #EAC8CD;
        outline: 1px dashed #D4A3A9;
        outline-offset: -8px;
        padding: 50px 60px;
        min-height: 1020px;
        position: relative;
      }
      .date {
        text-align: right;
        font-size: 11pt;
        font-style: italic;
        color: #9C6B71;
        margin-bottom: 25px;
      }
      .greeting {
        font-family: 'Playfair Display', serif;
        font-size: 18pt;
        color: #8C2D39;
        margin-bottom: 25px;
      }
      .content p {
        margin: 0 0 14px 0;
        font-size: 14pt;
        line-height: 2.1;
      }
      .content p.cursive {
        font-family: 'Caveat', cursive;
        font-size: 17pt;
        line-height: 2.0;
        color: #2D1B1E;
      }
      .content .spacer {
        height: 14px;
      }
      .divider {
        text-align: center;
        font-size: 16pt;
        color: #D81B60;
        margin: 30px 0;
      }
      .closing-box {
        margin-top: 40px;
        text-align: right;
      }
      .closing {
        font-family: 'Playfair Display', serif;
        font-size: 14pt;
        font-style: italic;
        color: #8C2D39;
        margin-bottom: 6px;
      }
      .author {
        font-family: 'Caveat', cursive;
        font-size: 20pt;
        color: #2D1B1E;
      }
      .footer {
        position: absolute;
        bottom: 25px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10pt;
        color: #B58A90;
        font-family: 'Playfair Display', serif;
      }
    </style>
  </head>
  <body>
    <div class="letter-frame">
      <div class="date">${entry.dateStr}</div>
      <div class="greeting">${entry.greeting || 'My Dearest'} ${entry.recipient || 'Love'},</div>
      <div class="content">
        ${renderBody(entry.body, true)}
      </div>
      <div class="divider">❦ ❧</div>
      <div class="closing-box">
        <div class="closing">${entry.closing || 'Forever yours,'}</div>
        <div class="author">${entry.authorName || 'Me'}</div>
      </div>
      <div class="footer">- ${pageNumber} -</div>
    </div>
  </body>
  </html>
  `;
};

// 3. Parent / Friend Letter HTML
export const renderStationeryLetterHtml = (entry: Entry, pageNumber = 1): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    ${FONTS_LINK}
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 40px 50px;
        background-color: #FAF8F2;
        color: #2A2421;
        font-family: 'Lora', Georgia, serif;
        font-size: 13pt;
        line-height: 1.9;
      }
      .stationery-frame {
        background: #FFFFFF;
        border-top: 5px solid #8B4513;
        border-bottom: 5px solid #8B4513;
        border-left: 1px solid #EFE8DC;
        border-right: 1px solid #EFE8DC;
        padding: 50px 60px;
        min-height: 1020px;
        position: relative;
      }
      .date {
        text-align: right;
        font-size: 11pt;
        color: #6B5B52;
        margin-bottom: 25px;
      }
      .greeting {
        font-family: 'Playfair Display', serif;
        font-size: 17pt;
        color: #2A2421;
        margin-bottom: 25px;
      }
      .content p {
        margin: 0 0 14px 0;
        text-indent: 25px;
        text-align: justify;
      }
      .content .spacer {
        height: 14px;
      }
      .closing-box {
        margin-top: 50px;
        text-align: right;
      }
      .closing {
        font-size: 12pt;
        font-style: italic;
        color: #6B5B52;
        margin-bottom: 6px;
      }
      .author {
        font-family: 'Playfair Display', serif;
        font-size: 15pt;
        font-weight: 700;
        color: #2A2421;
      }
      .footer {
        position: absolute;
        bottom: 25px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10pt;
        color: #A0938A;
        font-family: 'Playfair Display', serif;
      }
    </style>
  </head>
  <body>
    <div class="stationery-frame">
      <div class="date">${entry.dateStr}</div>
      <div class="greeting">${entry.greeting || 'Dear'} ${entry.recipient || ''},</div>
      <div class="content">
        ${renderBody(entry.body)}
      </div>
      <div class="closing-box">
        <div class="closing">${entry.closing || 'Warm regards,'}</div>
        <div class="author">${entry.authorName || 'Me'}</div>
      </div>
      <div class="footer">- ${pageNumber} -</div>
    </div>
  </body>
  </html>
  `;
};

// 4. Stitched Book HTML: Cover Page + Multiple Sequential Pages
export const renderCompleteBookHtml = (
  entries: Entry[],
  collectionTitle = 'My Diary',
  userName = 'Me',
  period = '2026'
): string => {
  const pagesHtml = entries
    .map((entry, index) => {
      const pageNum = index + 1;
      let bodySnippet = '';
      if (entry.type === 'love') {
        bodySnippet = `
          <div class="sheet-container">
            <div class="letter-frame">
              <div class="date">${entry.dateStr}</div>
              <div class="greeting">${entry.greeting || 'My Dearest'} ${entry.recipient || 'Love'},</div>
              <div class="content">${renderBody(entry.body, true)}</div>
              <div class="divider">❦ ❧</div>
              <div class="closing-box">
                <div class="closing">${entry.closing || 'Forever yours,'}</div>
                <div class="author">${entry.authorName || 'Me'}</div>
              </div>
              <div class="footer">- ${pageNum} -</div>
            </div>
          </div>
        `;
      } else if (entry.type === 'parent' || entry.type === 'friend') {
        bodySnippet = `
          <div class="sheet-container">
            <div class="stationery-frame">
              <div class="date">${entry.dateStr}</div>
              <div class="greeting">${entry.greeting || 'Dear'} ${entry.recipient || ''},</div>
              <div class="content">${renderBody(entry.body)}</div>
              <div class="closing-box">
                <div class="closing">${entry.closing || 'Warm regards,'}</div>
                <div class="author">${entry.authorName || 'Me'}</div>
              </div>
              <div class="footer">- ${pageNum} -</div>
            </div>
          </div>
        `;
      } else {
        bodySnippet = `
          <div class="sheet-container">
            <div class="page-frame">
              <div class="header">
                <div class="date">${entry.dateStr}</div>
                <div class="mood">${entry.mood || ''}</div>
              </div>
              ${entry.title ? `<div class="title">${entry.title}</div>` : ''}
              <div class="content">${renderBody(entry.body)}</div>
              <div class="footer">- ${pageNum} -</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="page-wrapper">
          ${bodySnippet}
        </div>
      `;
    })
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    ${FONTS_LINK}
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        background: #FAF7F0;
        font-family: 'Lora', Georgia, serif;
        color: #2C221E;
      }

      /* Book Cover Page */
      .cover-page {
        width: 100vw;
        height: 100vh;
        min-height: 1050px;
        background-color: #24140E;
        color: #F5EBE1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        page-break-after: always;
      }
      .cover-border {
        border: 3px solid #D4AF37;
        outline: 1px solid #D4AF37;
        outline-offset: -12px;
        width: 85%;
        height: 90%;
        min-height: 950px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        padding: 60px 40px;
      }
      .cover-ornament {
        font-size: 26pt;
        color: #D4AF37;
      }
      .cover-title {
        font-family: 'Playfair Display', serif;
        font-size: 38pt;
        font-weight: 700;
        letter-spacing: 4px;
        color: #FFFFFF;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .cover-sub {
        font-size: 15pt;
        font-style: italic;
        color: #D4AF37;
      }
      .cover-author {
        font-size: 18pt;
        letter-spacing: 2px;
        color: #F5EBE1;
        margin-bottom: 8px;
      }
      .cover-period {
        font-size: 12pt;
        letter-spacing: 3px;
        color: #A8988B;
      }

      /* Individual Entry Pages */
      .page-wrapper {
        page-break-after: always;
        page-break-inside: avoid;
        padding: 40px 50px;
        min-height: 100vh;
      }
      .sheet-container {
        width: 100%;
      }

      .page-frame {
        background: #FFFDF9;
        border: 1px solid #EADBCE;
        padding: 50px 60px;
        min-height: 1000px;
        position: relative;
        box-shadow: inset 0 0 30px rgba(220, 205, 190, 0.15);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1.5px solid #E6D8C8;
        padding-bottom: 12px;
        margin-bottom: 25px;
      }
      .date {
        font-family: 'Playfair Display', serif;
        font-size: 13pt;
        font-weight: 700;
        color: #8B4513;
      }
      .mood { font-size: 16pt; }
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 22pt;
        font-weight: 700;
        color: #2C221E;
        margin: 0 0 25px 0;
      }
      .content p {
        margin: 0 0 14px 0;
        text-align: justify;
        text-indent: 25px;
        font-size: 13pt;
        line-height: 1.9;
      }
      .content p.cursive {
        font-family: 'Caveat', cursive;
        font-size: 17pt;
        line-height: 2.0;
        color: #2D1B1E;
        text-indent: 0;
      }
      .content .spacer { height: 14px; }
      .footer {
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10pt;
        color: #A0938A;
        font-family: 'Playfair Display', serif;
      }

      .letter-frame {
        background: #FFFDFD;
        border: 2px solid #EAC8CD;
        outline: 1px dashed #D4A3A9;
        outline-offset: -8px;
        padding: 50px 60px;
        min-height: 1000px;
        position: relative;
      }
      .greeting {
        font-family: 'Playfair Display', serif;
        font-size: 18pt;
        color: #8C2D39;
        margin-bottom: 25px;
      }
      .divider {
        text-align: center;
        font-size: 16pt;
        color: #D81B60;
        margin: 30px 0;
      }
      .closing-box {
        margin-top: 40px;
        text-align: right;
      }
      .closing {
        font-family: 'Playfair Display', serif;
        font-size: 14pt;
        font-style: italic;
        color: #8C2D39;
        margin-bottom: 6px;
      }
      .author {
        font-family: 'Caveat', cursive;
        font-size: 20pt;
        color: #2D1B1E;
      }

      .stationery-frame {
        background: #FFFFFF;
        border-top: 5px solid #8B4513;
        border-bottom: 5px solid #8B4513;
        border-left: 1px solid #EFE8DC;
        border-right: 1px solid #EFE8DC;
        padding: 50px 60px;
        min-height: 1000px;
        position: relative;
      }
    </style>
  </head>
  <body>
    <!-- Book Cover -->
    <div class="cover-page">
      <div class="cover-border">
        <div class="cover-ornament">❖</div>
        <div>
          <div class="cover-title">${collectionTitle}</div>
          <div class="cover-sub">A Collection of Memories & Letters</div>
        </div>
        <div>
          <div class="cover-author">by ${userName}</div>
          <div class="cover-period">${period}</div>
        </div>
        <div class="cover-ornament">❖</div>
      </div>
    </div>

    <!-- Book Pages -->
    ${pagesHtml}
  </body>
  </html>
  `;
};
