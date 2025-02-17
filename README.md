# Screaming Frog SEO Spider TextRazor Entity Extraction

## Overview

This project provides custom JavaScript code for use within [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/). The code integrates with the [TextRazor API](https://www.textrazor.com/) to extract entities and topics from webpage content.


## Features

- **Entity and Topic Extraction**: Utilizes TextRazor's API to identify entities and topics.
- **Rate-Limited Requests**: Includes a delay to adhere to TextRazor's free plan restrictions (max 2 concurrent requests).
- **Entity Filtering**: Excludes irrelevant entities like numbers, cookies, emails, and dates.
- **Performance-Optimized**: Processes webpage content in chunks to handle large text bodies efficiently.


## Requirements

- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
- TextRazor API Key (Sign up for a free plan at [TextRazor](https://www.textrazor.com/))


## Installation

1. Open Screaming Frog SEO Spider.
2. Navigate to **Configuration > Custom Extraction > Add Custom JavaScript**.
3. Paste the provided code.
4. Replace the `TEXTRAZOR_API_KEY` placeholder with your actual API key.


## Configuration

### Mandatory

- `TEXTRAZOR_API_KEY`: Add your TextRazor API key. Stored in plain text.

### Optional

- `languageOverride`: Specify the language for text analysis if needed. Refer to [supported languages](https://www.textrazor.com/languages).

## Usage

1. Run a crawl with Screaming Frog.
2. The script extracts entities from webpage content and returns them in JSON format.
3. Access the extracted data in the **Custom Extraction** results.

## Code Behavior Explained

### 1. Text Chunking

- The webpage's text content (`document.body.innerText`) is split into chunks of 5000 characters to handle large pages.

### 2. API Requests with Rate-Limiting

- Uses a delay to comply with TextRazor's limit of 2 concurrent requests.
- The `maxRequestsPerDay` variable ensures the script doesn't exceed the 500 requests/day limit of the free plan.

### 3. Entity Filtering

- Filters out entities with types like `Number`, `Cookie`, `Email`, and `Date`.
- Excludes numeric-only entities.

### 4. Entity Aggregation

- Entities are aggregated by name and freebase link.
- The output includes the entity name, count of occurrences, and associated Wikipedia/Freebase links if available.

## Example Output

```json
[
  {
    "entity": "screaming frog",
    "count": 3,
    "freebaseLink": "https://www.google.com/search?kgmid=/m/012345",
    "wikiLink": "https://en.wikipedia.org/wiki/Screaming_Frog"
  },
  {
    "entity": "seo",
    "count": 5,
    "freebaseLink": "",
    "wikiLink": "https://en.wikipedia.org/wiki/Search_engine_optimization"
  }
]
```


## Troubleshooting

- **No entities returned**: Ensure the API key is valid and the daily request limit hasn't been exceeded.
- **API error**: Check Screaming Frog logs and TextRazor API documentation for error details.
- **Performance issues**: Reduce the chunk size or increase the delay if requests are being throttled.


## Security Considerations

**Important**: The API key is stored in plain text within Screaming Frog's configuration. To protect your API key:

- **Avoid Sharing Configuration Files**: Do not share your Screaming Frog configuration files containing the API key.
- **Remove Sensitive Data Before Sharing**: If you need to share configuration files or JavaScript snippets, ensure you remove any sensitive data, such as API keys, beforehand. :contentReference[oaicite:0]{index=0}
- **Regularly Rotate API Keys**: Periodically update your API key to minimize potential misuse.

By following these practices, you can help ensure the security of your API key and prevent unauthorized access.
