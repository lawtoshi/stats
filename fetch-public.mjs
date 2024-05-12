import cron from 'node-cron';
import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = ''; // Use your actual OpenSea API key
const COLLECTION_SLUG = 'thememes6529'; // Adjust based on your collection
const STATIC_DATA_PATH = '/MemesTDHData.json'; // Path to your static data file

// Helper function to convert price
function convertToReadablePrice(weiPrice, decimals = 18) {
    return (weiPrice / Math.pow(10, decimals)).toFixed(3);
}

// Delay Function that returns a promise that resolves after aspecified number of milliseconds.
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to Calculate Price per TDH (PPTDH)
function calculatePPTDH(bestPrice, tdhRate) {
    return bestPrice / tdhRate;
}

// Function to fetch and process data
async function fetchAndProcessData() {
    try {
        const staticData = JSON.parse(fs.readFileSync(STATIC_DATA_PATH, 'utf-8'));
        const results = [];

        for (const item of staticData) {
            const apiURL = `https://api.opensea.io/api/v2/listings/collection/${COLLECTION_SLUG}/nfts/${item.Identifier}/best`;
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: { 'accept': 'application/json', 'X-API-KEY': API_KEY }
            });
            if (!response.ok) {
                console.error(`Failed to fetch for ${item.Identifier}: ${response.statusText}`);
                continue; // Skip this item on failure
            }
            const apiData = await response.json();

            const bestPriceStr = apiData.price?.current?.value || '0';
            const bestPriceReadable = convertToReadablePrice(bestPriceStr);
            const bestPrice = parseFloat(bestPriceReadable);
            const pptdh = calculatePPTDH(bestPrice, parseFloat(item['TDH Rate']));

            results.push({ ...item, 'Floor Price': bestPrice, PPTDH: pptdh });

            // Wait for a specified delay before making the next request
            await delay(5000); // Adjust delay as needed to respect OpenSea's rate limit
        }

        // Save the merged data to a new JSON file
        fs.writeFileSync('/UpdatedData.json', JSON.stringify(results, null, 2));
        console.log('Data fetched, processed, and saved successfully.');
    } catch (error) {
        console.error('Error fetching and processing data:', error);
    }
}

// Schedule the task to run every 15 minutes
cron.schedule('*/15 * * * *', fetchAndProcessData);

// Optionally, run it once immediately on start
fetchAndProcessData();
