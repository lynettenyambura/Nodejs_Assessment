const fs = require('fs');
const cheerio = require('cheerio');


function extractCasesFromHTML(html) {
    const cases = [];

    
    const $ = cheerio.load(html);

    
    $('.post').each((index, element) => {
        const caseData = {};

        caseData.title = $(element).find('h2').text().trim();
        caseData.case_number = $(element).find('.case-number').text().trim();
        caseData.judge = $(element).find('.bg:contains("Judge:")').text().replace('Judge:', '').trim();
        caseData.court = $(element).find('.bg:contains("Court:")').text().replace('Court:', '').trim();
        caseData.parties = $(element).find('.bg:contains("Parties:")').text().replace('Parties:', '').trim();
        caseData.plaintiff = extractPlaintiff(caseData.parties);
        caseData.defendant = extractDefendant(caseData.parties);
        caseData.advocates = $(element).find('.bg:contains("Advocates:")').text().replace('Advocates:', '').trim();
        caseData.citation = $(element).find('.bg:contains("Citation:")').text().replace('Citation:', '').trim();
        caseData.date_delivered = $(element).find('.date-delivered').text().replace('Date Delivered:', '').trim();
        caseData.date_delivered_formatted = formatDate(caseData.date_delivered);
        caseData.URI = $(element).find('.addthis_toolbox a').attr('href');

        
        cases.push(caseData);
    });

    return cases;
}


function extractPlaintiff(parties) {
    const separatorRegex = /\s+v\s+|\s+vs\s+|\s+versus\s+/i;
    const matches = parties.match(separatorRegex);
    return matches ? parties.split(matches[0])[0].trim() : null;
}


function extractDefendant(parties) {
    const separatorRegex = /\s+v\s+|\s+vs\s+|\s+versus\s+/i;
    const matches = parties.match(separatorRegex);
    return matches ? parties.split(matches[0])[1].trim() : null;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}


const htmlFiles = ['search_results_page_1.html', 'search_results_page_2.html', /* Add more file names as needed */];
const allCases = [];

htmlFiles.forEach(htmlFile => {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const cases = extractCasesFromHTML(html);
    allCases.push(...cases);
});


fs.writeFileSync('cases.json', JSON.stringify(allCases, null, 2));

console.log('Cases extracted and saved to cases.json');
