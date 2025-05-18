const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePDFFromDescription(description) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // البحث عن المحتوى بناءً على الوصف
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(description)}`);
    
    // استخراج النتائج الرئيسية
    const content = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('div.g').forEach(result => {
        const title = result.querySelector('h3')?.innerText;
        const snippet = result.querySelector('div[data-sncf]')?.innerText;
        if (title && snippet) {
          results.push(`## ${title}\n${snippet}`);
        }
      });
      return results.join('\n\n');
    });
    
    // إنشاء ملف PDF
    await page.setContent(`<h1>ملخص عن: ${description}</h1>\n${content}`);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });
    
    await browser.close();
    
    // حفظ الملف
    const fileName = `ملخص_${description.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.pdf`;
    fs.writeFileSync(fileName, pdfBuffer);
    
    return { success: true, filePath: fileName };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { generatePDFFromDescription };