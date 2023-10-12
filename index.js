const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const app = express();
app.use(cors())
const router = express.Router()
const port = 3001;

router.get('/generate-pdf', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/arrests-data');
  
  await page.waitForSelector("svg");
  await page.emulateMediaType('screen')

  await page.evaluate(async() => {
    await new Promise(function(resolve) { 
           setTimeout(resolve, 4000)
    });
});

  // Capture a screenshot of the chart
  const screenshotBuffer = await page.screenshot();

  // Convert the screenshot to a PDF
  const pdfBuffer = await page.pdf({ format: 'A4' });
  
  res.set('Content-Type', 'application/pdf');
  res.send(pdfBuffer);

  await browser.close();
});

console.log(process.env.DOMAIN_LINK)

app.use("/api", router)

app.listen(process.env.DOMAIN_LINK || port, () => {
  console.log(`Server is running on port ${port}`);
});
