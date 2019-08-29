const merge = require('easy-pdf-merge');
const fs = require('fs')

const dict = fs.readFileSync('./dict.txt', 'utf-8').split('\n');
const dirPdfs = () => fs.readdirSync('./').filter(s => s.split('-')[0] !== 'merged' && s.match(/.+\.pdf$/))
const getDayAndMonth = () => `${new Date().getDate()}/${new Date().getMonth()}`;
const pdfPath = `merged-${getDayAndMonth()}.pdf`.toString()
const allPdfs = dirPdfs();

merge(allPdfs, 'merged-23.10.pdf', (err => {
  if (err) return console.error(err)
  console.log('success: Merged files successfully')
  console.log('cleaning up...')
  allPdfs.map(f => f.split('-')[0] !== 'merged' && fs.unlinkSync(f))
  //
}));


// execution of this script Merges all existing pdfs and then deletes all pdfs except merged ones.
