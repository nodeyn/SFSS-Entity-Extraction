// TextRazor Entity Extraction
//
// IMPORTANT:
// You will need to supply your API key below which will be stored
// as part of your SEO Spider configuration in plain text. 
// TextRazor's free plan is limited to 500 requests per day.
// TextRazor's free plan is capped to two concurrent requests, a delay is build in.

// Dennis Stopa / Nodeyn :: https://dennisstopa.com / https://nodeyn.nl

// API key and language override variables (keep your API key static in Screaming Frog)
const TEXTRAZOR_API_KEY = '';
const languageOverride = ''; // Leave blank if you don't want to override. Check https://www.textrazor.com/languages for supported languages


// No more modifications needed
const userContent = document.body.innerText; 

let requestCounter = 0; // Initialize request counter
const maxRequestsPerDay = 500; // Set the maximum requests per day, the free plan has a 500 requests per day

// The free plan has a limit of two concurrent requests, the delay will handle this
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractEntitiesWithDelay() {
    const entities = [];
    const chunkSize = 5000;
    const textChunks = [];

    for (let i = 0; i < userContent.length; i += chunkSize) {
        textChunks.push(userContent.substring(i, i + chunkSize));
    }

    for (let i = 0; i < textChunks.length; i++) {
        if (requestCounter >= maxRequestsPerDay) {
            console.log('Reached the maximum number of requests for the day.');
            break;
        }

        const text = textChunks[i];
        console.log('Sending text chunk to TextRazor:', text.slice(0, 200)); 

        const bodyParams = new URLSearchParams({
            text: text,
            extractors: 'entities,topics',
        });

        // Conditionally add the language override if it's provided
        if (languageOverride) {
            bodyParams.append('languageOverride', languageOverride);
        }

        const response = await fetch('https://api.textrazor.com/', {
            method: 'POST',
            headers: {
                'x-textrazor-key': TEXTRAZOR_API_KEY, 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams.toString()
        });

        if (response.ok) {
            const data = await response.json();
            console.log('TextRazor response:', data); // Log the response for debugging

            if (data.response.entities) {
                entities.push(...data.response.entities);
                requestCounter++;
            }
        } else {
            const errorText = await response.text();
            console.error('TextRazor API error:', errorText);
        }

        if (i < textChunks.length - 1) {
            await delay(1000);
        }
    }

    return entities;
}

// First version had a lot of invalid entities, this filters a bunch of them
function isValidEntity(entity) {
    const invalidTypes = ["Number", "Cookie", "Email", "Date"];
    const entityId = entity.entityId || entity.matchedText;

    if (entity.type && Array.isArray(entity.type) && entity.type.length > 0) {
        if (invalidTypes.includes(entity.type[0]) || /^[0-9]+$/.test(entityId)) {
            return false;
        }
    } else if (/^[0-9]+$/.test(entityId)) {
        return false;
    }

    return true;
}

function processEntities(entities) {
    const entitiesDict = {};

    entities.forEach(entity => {
        if (isValidEntity(entity)) {
            const entityId = entity.entityId || entity.matchedText;
            const entityName = entity.matchedText.toLowerCase(); // Convert entity name to lowercase
            const freebaseLink = entity.freebaseId ? `https://www.google.com/search?kgmid=${entity.freebaseId}` : '';
            const wikiLink = entity.wikiLink || ''; // Ensure we're capturing the Wikipedia link correctly

            if (entityId !== 'None' && isNaN(entityName)) {  // Filter out numeric-only entities
                const key = entityName + freebaseLink; // Unique key based on name and link
                if (!entitiesDict[key]) {
                    entitiesDict[key] = {
                        entity: entityName,
                        count: 1,
                        freebaseLink: freebaseLink,
                        wikiLink: wikiLink
                    };
                } else {
                    entitiesDict[key].count += 1;
                }
            }
        }
    });

    const result = Object.values(entitiesDict).filter(item => item.entity && item.entity !== 'None'); // Filter out empty or 'None' entities

    return JSON.stringify(result);
}

return extractEntitiesWithDelay()
    .then(entities => {
        if (entities.length === 0) {
            console.warn('No entities found in the response.');
        }
        return seoSpider.data(processEntities(entities));
    })
    .catch(error => seoSpider.error(error));