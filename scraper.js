const puppeteer = require('puppeteer');
const mergePdf = require('./merge');
const fs = require('fs')
const path = require('path');
const dict = fs.readFileSync('./dict.txt', 'utf-8').split('\n').slice(0, -1);
const Ashkelon = '%D7%90%D7%A9%D7%A7%D7%9C%D7%95%D7%9F'
const searchField = ''

const getQuery = () => {
  const args = process.argv.slice(2)
  if (!args) return ''
  return args
    .some(el => el.includes('query=')) ? 
    args
      .filter(el=>el.includes('query='))[0]
      .split('=')[1] 
    : searchField
}

const URL = `https://www.shatil.org.il/modaot/joboffer_lastweek?field_activity_zones_tid%5B%5D=87&field_main_roles_job_tid%5B%5D=98&combine=${getQuery()}`;

const getDateArg = () => {
  const oneday = 1000 * 60 * 60 * 24
  if (!process.argv[2]) return 0;
  if (process.argv[2] === 'last') {
    return oneday
  }
  if (!(isNaN(process.argv[2]))) {
    return oneday * process.argv[2]
  }
}

const toMail = () => {
  return [...process.argv.slice(2)].includes('mail') ? true : false
}

const filterByDate = (node) => {
  let arg = getDateArg();
  if (!arg) return true
  const nodeDate = `2019/${node.date.slice(3,5)}/${node.date.slice(0,2)}`
  const nodeTimestamp = new Date(nodeDate).getTime();
  return (new Date().getTime() - nodeTimestamp <= arg)
}
const containAny = (string, arrayOfStr) => arrayOfStr.reduce((answer, cur) => {
  if (string.indexOf(cur) > -1) return true
  return answer
}, false);

const updateLastNode = node => {
  const nodeNo = node.match(/(\d+)/)[0] + '\n';
  fs.writeFileSync('./lastNodeList.txt', nodeNo, {'flag':'a'});
}

(async () => {

  async function takeScreen(node, pdfName) {
      const qTxt = 'הצג כתובת';
      console.log(`scraping: ${node}`)
      const elem = await page.evaluate(() => {
        const tar = [...document.querySelectorAll('span')].find(e => e.innerText.includes('הצג כתובת'))
        tar && tar.click();
      })
      await page.pdf({path: pdfName, format: 'A4'});
  };

  let browser = await puppeteer.launch({headless: true, handleSIGINT: false});
  let page = await browser.newPage();
  await page.goto(URL);
  const jobs = await page.$$eval(
    '.job', 
    nods => Array
    .from(nods
      .map(node => ({
        txt: node.firstElementChild.innerText,
        href: node.firstElementChild.href,
        date: node.previousSibling.previousSibling.innerText
      }))))

  console.log('jobs length before filter: ', jobs.length)
  const rJobs = await jobs
    .filter(({txt}) => !containAny(txt, dict))
    .filter(filterByDate)

  console.log('jobs length after filter: ', rJobs.length)

  let pdfNames = [];
  const iPhone = puppeteer.devices['iPhone X'];
  await page.emulate(iPhone);
  for (var i = 0; i < rJobs.length; i++){
    const pdfName = rJobs[i].href.split('/').slice(-1)[0] + '.pdf';
    const theNode = rJobs[i].href;
    pdfNames.push(pdfName);
    await page.waitFor(200);
    await page.goto(theNode);
    await takeScreen(theNode, pdfName);
    i === 0 && updateLastNode(theNode)
  }

  await browser.close();
  await (async () => mergePdf(toMail()))();
})();
