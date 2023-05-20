# Football Score Updates Scraper and API
The Football Score Updates API is a Node.js application that provides real-time updates for the latest football matches happening in various countries and leagues. It scrapes the Flash Score website to retrieve match information and delivers it in a convenient JSON format. This README will guide you through the installation, usage, and customization of the API.

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Installation
To install and run the Football Score Updates API, follow these steps:

1. Clone the repository to your local machine:
```bash
git clone https://github.com/codevardhan/football-live-api
```
2. Navigate to the project directory:
```bash
cd football-live-api
```
3. Install the dependencies:
```bash
npm install
```
4. Start the API server:
```bash
node index.js
```
Congratulations! The API is now up and running on http://localhost:3000.

## Usage
The API provides match updates based on the country and league specified in the query. To use the API, send a GET request to the appropriate endpoint.

Here's an example using cURL to retrieve match updates for a specific country and league:

```bash
curl http://127.0.0.1:3000/argentina/liga-profesional
```

The response will be a JSON object containing the latest matches happening in the specified country and league.

## API Endpoints
The Football Score Updates API provides the following endpoints:

### GET /matches
Retrieves the latest match updates based on the country and league specified in the query parameters.

#### Query Parameters
- country (required): The name of the country for which match updates are requested.
- comp (required): The name of the league within the country for which match updates are requested.

Example
``` bash
GET /?country=argentina&comp=liga-profesional
```
Response:

```json
[
    {
        "status": "Finished",
        "time": "NaN",
        "team_1": "Central Cordoba",
        "team_2": "Union de Santa Fe",
        "score_1": "0",
        "score_2": "1",
        "fh_score": "0 - 0"
    },
    {
        "status": "Postponed",
        "time": "NaN",
        "team_1": "Racing Club",
        "team_2": "Velez Sarsfield",
        "score_1": "NaN",
        "score_2": "NaN",
        "fh_score": "NaN"
    },
    {
        "status": "Upcoming",
        "time": "22:30",
        "team_1": "San Lorenzo",
        "team_2": "Instituto",
        "score_1": "NaN",
        "score_2": "NaN",
        "fh_score": "NaN"
    }
]
```
## Customization
You can customize the API to suit your specific needs. Here are a few possible customizations:

1. User Interface: Create a frontend application that consumes the API and displays the match updates in a user-friendly way.
2. Additional Endpoints: Expand the API to provide more functionality, such as retrieving match details for a specific team or player.
3. Data Sources: Modify the scraping logic to retrieve match updates from a different website or API.
4. Error Handling: Improve the error handling and response messages to provide clearer feedback to API consumers.

Feel free to explore the codebase and make changes according to your requirements.

## Contributing
Contributions to the Football Score Updates API are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.

If you'd like to contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit your code.
4. Push your branch to your forked repository.
5. Open a pull request on the main repository.

Please ensure that your code adheres to the existing code style and includes appropriate tests.

## License
The Football Score Updates API is open-source software released under the MIT License. See the LICENSE file for more details.