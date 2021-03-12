# Ticketing Project - Based on Stephen Grider Course

## Architechture: Microservices

## Tools:

-   Docker
-   Kubernetes
-   Skaffold: [How to install](https://skaffold.dev/docs/install/)
-   NATS Streaming: [About](https://docs.nats.io/nats-streaming-concepts/intro)

## Features

-   [Error Handler Middleware](./auth/src/middlewares/error-handler.ts)
-   [Kubernetes Deployment](./infra/k8s)
-   [Skaffold Continues Deployment](./skaffold.yaml)
-   [Jest Testing](./auth/src/test/setup.ts)
-   [NATS Streaming for Event Bus](./infra/k8s/nats-depl.yaml)

## How to start

1. Run `skaffold dev`
