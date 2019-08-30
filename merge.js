const merge = require('easy-pdf-merge');
const fs = require('fs');
const mailer = require('./send');


module.exports = async (toMail) => {
  console.log(`toMail option: ${toMail}`)
  const dict = fs.readFileSync('./dict.txt', 'utf-8').split('\n');
  const dirPdfs = () => fs.readdirSync('./').filter(s => s.split('-')[0] !== 'merged' && s.match(/.+\.pdf$/))
  const getDayAndMonth = () => `${new Date().getDate()}/${new Date().getMonth()}`;
  const pdfPath = `merged-${getDayAndMonth()}.pdf`.toString()
  const allPdfs = dirPdfs();

  const d = new Date()
  const ddmm = 'merged-' + d.getDate() + '.' + d.getMonth() + '.pdf';
  merge(allPdfs, ddmm, (err => {
    if (err) return console.error(err)
    console.log(`OK: Merged files into: ${ddmm}`)
    console.log('cleaning up...')
    allPdfs.map(f => f.split('-')[0] !== 'merged' && fs.unlinkSync(f))
    console.log(`
      \t ||||||||||||||||||||||||||||||
      \t ||                          ||
      \t || ---   SENDING MAIL  ---  ||
      \t ||                          ||
      \t ||||||||||||||||||||||||||||||
    `)
    toMail && mailer(ddmm)
  }));
};



// execution of this script Merges all existing pdfs and then deletes all pdfs except merged ones.
