# Eve Metro API

## Overview

The Eve Metro API is a RESTful API designed for the Eden Navigator project, which provides access to various data related to the EVE Online universe. This server facilitates the retrieval of information about solar systems, connections, and access levels for characters, corporations, and alliances.

## Features

- **API Key Validation**: Ensures that only authorized users can access the API by validating API keys against a predefined list.
- **Access Check**: Allows users to check access levels for characters, corporations, and alliances.
- **Database Integration**: Utilizes PostgreSQL for data storage and retrieval, managed through Knex.js.
- **Environment Configuration**: Uses environment variables for sensitive configurations, such as database credentials and server port.

## Endpoints

### POST /check-access

This endpoint checks the access level for a given character, corporation, or alliance.

#### Request Headers

- **x-api-key**: Your API key for authentication. This header is required for accessing the endpoint.

#### Request Body

```json
{
  "character_id": "123456",
  "corporation_id": "654321",
  "alliance_id": "789012"
}
```

#### Response

- **200 OK**: Access level information and connections if access is granted.
- **400 Bad Request**: If none of the IDs are provided.
- **403 Forbidden**: If the API key is invalid.
- **500 Internal Server Error**: If there is an error processing the request.

## Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```plaintext
   PORT=3000
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Configuration

The API uses a `config.json` file to store API keys. This file should be located in the root directory of the project and should be structured as follows:

```json
{
    "apiKeys": [
        "your-api-key-1",
        "your-api-key-2",
        "your-api-key-3"
    ]
}
```

Make sure to replace the placeholder values with your actual API keys. The API will validate incoming requests against the keys listed in this file.

## Dependencies

- **Express**: Web framework for Node.js.
- **Knex**: SQL query builder for Node.js.
- **Zod**: TypeScript-first schema declaration and validation library.
- **dotenv**: Module to load environment variables from a `.env` file.

## License

This project is licensed under the MIT License.
