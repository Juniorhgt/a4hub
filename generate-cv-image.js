const puppeteer = require('puppeteer');
const path = require('path');

async function generateCVImage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the CV template HTML
    await page.goto(`file:${path.join(__dirname, 'cv-template.html')}`, {
        waitUntil: 'networkidle0'
    });

    // Set viewport to A4 size
    await page.setViewport({
        width: 794, // 210mm in pixels at 96 DPI
        height: 1123, // 297mm in pixels at 96 DPI
        deviceScaleFactor: 2 // For higher quality
    });

    // Take screenshot
    await page.screenshot({
        path: 'images/cv-template.png',
        fullPage: true,
        omitBackground: true
    });

    await browser.close();
    console.log('CV template image generated successfully!');
}

generateCVImage().catch(console.error); 