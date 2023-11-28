# v3 Supergraph

## Overview

Just a sample application using the docs schema. We can build on this to add more features.

![image](https://github.com/robertjdominguez/v3-supergraph/assets/24390149/74f580f1-45c5-4cdd-9cbe-6768e6723a4b)

## Pre-requisites

1. The [Hasura3 CLI](https://hasura.io/docs/3.0/cli/overview/)
2. A [Hasura DDN](https://console.hasura.io) account

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/robertjdominguez/v3-supergraph.git
```

2. Create a new DDN project

Head to [Hasura DDN](https://console.hasura.io) and create a new project.

3. Update the project name in `hasura.yaml`

Replace `usable-stud-7576` with your project's name:

```yaml
version: 1
project: <YOUR_PROJECTS_NAME>

buildProfiles:
  - build-profile.yaml
  - build-profile-staging.yaml
  - build-profile-prod.yaml

defaultBuildProfile: build-profile.yaml
```

## Create your environments

Using the CLI, create your environments:

```bash
hasura3 env create --name staging -d "Staging environment"
hasura3 env create --name prod -d "Production environment"
```

## Create your subgraphs

We'll organize our API into two subgraphs that will compose our supergraph. Out of the box, we already have a subgraph
called `default` that will house our main application's schema. However, we'll create an additional subgraph called
`billing`:

```bash
hasura3 subgraph create -n billing
```

## Create a build

We'll create a build on staging:

```bash
hasura3 build create --profile build-profile-staging.yaml -d "Initial build on staging"
```

## Test it out

Head to the Console URL returned by the CLI, select the `staging` environment, and then run the following query:

```graphql
query PaymentQuery {
  users {
    id
    email
    orders {
      id
      status
    }
    billingUsers {
      invoices {
        invoice_id
        amount
        status
        payments {
          payment_id
          payment_date
          amount_paid
        }
      }
    }
  }
}
```

## To play with TS Connector

Checkout the `feat/add-ts-function` branch:

```bash
git checkout feat/add-ts-function
```

There's a deployed connector configured in the project already. You can try it by running:

```graphql
query PaymentQuery {
  users {
    id
    email
    orders {
      id
      status
    }
    billingUsers {
      invoices {
        invoice_id
        amount
        status
        payments {
          payment_id
          payment_date
          amount_paid
        }
      }
    }
  }
  isTShirtLover(userId: "82001336-65b7-11ed-b905-7fa26a16d198")
}
```

Which will return:

```json
{
  // ...other output
  "isTShirtLover": "User 82001336-65b7-11ed-b905-7fa26a16d198 is a T-Shirt lover!"
}
```

You can run the server locally using:

```bash
deno run -A --watch --check https://deno.land/x/hasura_typescript_connector/mod.ts serve --configuration ./config.json
```

And test using new tunnel to your local server:

```bash
hasura3 daemon start
```

Followed by:

```bash
hasura3 tunnel create localhost:8100
```

Replace the local tunnel present with your own in `/subgraphs/default/commands/commands.hml`:

```yaml
kind: DataConnector
version: v1
definition:
  name: commandconnector
  url:
    singleUrl: 'http://<WHATEVER_CONNECTOR_VALUE_IS_HERE>'
```

Finally, create a new build:

```bash
hasura3 build create --profile build-profile-staging.yaml -d "Playing with the TS connector"
```

As you query the connector, you'll see the logs comes through your running Deno server. You can make modifications here
and they'll be reflected in the API 🎉
