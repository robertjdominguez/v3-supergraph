# Overview

You can create products and customers inside of a Stripe account using the Stripe CLI.

## Create an account

Head to [Stripe](https://stripe.com) and create an account.

## Install the CLI

Download the CLI from [Stripe](https://stripe.com/docs/stripe-cli#install).

## Login to the CLI

From the root of this project, run:

```bash
stripe login
```

So long as you're logged into Stripe on your browser, you should be able to login to the CLI. It will ask you to verify
a passphrase and then you're golden.

## Create your products

After logging in, from the root of this project, run:

```bash
stripe fixtures stripe-data/products/create-fixtures.json
```

## Create your customers

Then, run:

```bash
stripe fixtures stripe-data/customers/create-fixtures.json
```

At this point, Stripe is ready 💰

## Create a .env in the root of this project

```bash
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
```

You can find your secret key in the Stripe dashboard. Head to the Developers section and then click on API keys. Copy
the secret key and paste it into your .env file.

## Run the connector

You can now follow the instructions in the README.md in the root of this project to run the connector locally. You'll
need to add a flag for the `.env` file.

## Deploy the connector

```
hasura3 connector create stripe-supergraph-connector:v1 \
  --github-repo-url https://github.com/hasura/ndc-typescript-deno/tree/main \
  --config-file <(echo '{}') \
  --volume ./functions:/functions \
  --env STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
```
