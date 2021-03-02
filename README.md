# Ticketing Project - Based on Stephen Grider Course

## Architechture: Microservices

## Tools:

-   Docker
-   Kubernetes
-   Skaffold: [How to install](https://skaffold.dev/docs/install/)

## Features

-   [Error Handler Middleware](./auth/src/middlewares/error-handler.ts)
-   [Kubernetes Deployment](./infra/k8s)
-   [Skaffold Continues Deployment](./skaffold.yaml)
-   [Jest Testing](./auth/src/test/setup.ts)

## How to start

1. Run `skaffold dev`
