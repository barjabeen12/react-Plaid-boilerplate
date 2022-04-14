require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 4090;
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
var cors = require('cors');
app.use(cors());

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});
const client = new PlaidApi(configuration);

app.use(express.json());

app.post('/exchange_public_token', async (request, res, next) => {
  try {
    const response = await client.exchangePublicToken(request.body.public_token).catch((err) => {
      console.log(err);
    });
    const accessToken = response.access_token;
    const itemId = response.item_id;
    res.json({
      access_token: accessToken,
      item_id: itemId,
    });
    console.log('access token below');
    console.log(accessToken);
  } catch (e) {
    console.log(e);
  }
});

app.post('/create_link_token', async (request, res, next) => {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: '123-test-user-id',
      },
      client_name: 'Plaid Test App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    let token = response.data.link_token;
    res.send(token);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
