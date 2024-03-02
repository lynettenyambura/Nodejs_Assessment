const axios = require('axios');
const { DateTime } = require('luxon');
const fs = require('fs');


const baseUrl = 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000';


const advancedSearchUrl = `${baseUrl}&search_type=advanced_search`;


const fromDate = DateTime.fromISO('2022-01-01').toFormat('yyyy-MM-dd');
const toDate = DateTime.fromISO('2022-01-31').toFormat('yyyy-MM-dd');


async function performSearch() {
    try {
        const searchUrl = `${advancedSearchUrl}&delivery_date_from=${fromDate}&delivery_date_to=${toDate}`;
        const response = await axios.get(searchUrl);
        const searchResultsHtml = response.data;

        
        for (let i = 1; i <= 5; i++) {
            const pageFileName = `search_results_page_${i}.html`;
            fs.writeFileSync(pageFileName, searchResultsHtml);
            console.log(`Page ${i} saved as ${pageFileName}`);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

performSearch();
