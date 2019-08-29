const merge = require('easy-pdf-merge');
const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path');

const dict = fs.readFileSync('./dict.txt', 'utf-8').split('\n');
const Ashkelon = '%D7%90%D7%A9%D7%A7%D7%9C%D7%95%D7%9F'
const searchField = Ashkelon
const URL = `https://www.shatil.org.il/modaot/joboffer_lastweek?field_activity_zones_tid%5B%5D=87&field_main_roles_job_tid%5B%5D=98&combine=${searchField}`;


const containAny = (string, arrayOfStr) => arrayOfStr.reduce((answer, cur) => {
  if (string.indexOf(cur) > -1 ) return true
  return answer
}, false);

const updateLastNode = node => {
  const nodeNo = node.match(/(\d+)/)[0];
  fs.writeFileSync('./lastNodeList.txt', nodeNo, {'flag':'a'});
}

(async () => {

  async function takeScreen(node, pdfName) {
    (async () => {
      const qTxt = 'הצג כתובת';
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(node, {waitUntil: 'networkidle0'})
      const elem = await page.evaluate(() => {
        const tar = [...document.querySelectorAll('span')].find(e => e.innerText.includes('הצג כתובת'))
        tar && tar.click();
      })
      await page.waitFor(150);
      await page.pdf({path: pdfName, format: 'A4'});
      browser.close();
    })();
  };

  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(URL);
  const jobs = await page.$$eval('.job', nods => Array.from(nods.map(node => ({txt: node.firstElementChild.textContent, href: node.firstElementChild.href}))))
  const rJobs = jobs
    .filter(({txt}) => containAny(txt, dict));

  let pdfNames = [];
  const iPhone = puppeteer.devices['iPhone X'];

  // await page.emulate(iPhone);
  for (var i = 0; i < rJobs.length; i++){
    const pdfName = rJobs[i].href.split('/').slice(-1)[0] + '.pdf';
    const theNode = rJobs[i].href;
    pdfNames.push(pdfName);
    takeScreen(theNode, pdfName);
    i === 0 && updateLastNode(theNode)
  }

  await browser.close();
})();
