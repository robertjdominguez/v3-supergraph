# v3 Supergraph

## Overview

Just a sample application using the docs schema. We can build on this to add more features.

## Pre-requisites

1. The Hasura3 CLI
2. A Hasura DDN account

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
query MyQuery {
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
