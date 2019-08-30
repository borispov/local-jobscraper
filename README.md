# Job Scraper

This is goal specific project, suited for personal needs. My wife was looking for a job as a Social Worker and I decided to assist by writing a scraper that would generate a list with relevant jobs in our city.


**I used puppeteer of course,** as it is quite simple to follow the docs along with their examples. Also used easy-pdf-merge which was bit frustrating a bit to figure out small errors since it's a small lib.


Goals achieved: 

- App used nodemailer's driver to send email with relevant Pdfs. 
- Fixed major code issue with opening too many browsers and causing memory leaks. 
- Merging files is now automatic after you scrape the web. 

## HOW TO:

1. Clone the git repo, run `npm i`
2. Run `node scraper.js 14 mail` to scraper 2 weeks back and mail it.
3. Provide arguments: the first one is the number of days you want to scrape back, i;E 1 equals 1 day back. Similarly
4. Second Argument: mail, if provided the app will mail the file, if not it will not. 
5. Lastly, is query=, you have to pass your query like that `query=QueryHere`.
6. Ultimately: `node scraper.js 20 mail query='ashkelon'`
