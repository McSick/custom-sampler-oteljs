# Custom OpenTelemetry Sampler Demo

This project demonstrates the implementation of a custom OpenTelemetry sampler in a TypeScript Express application. The sampler combines trace ID-based sampling with deterministic attribute-based sampling decisions.

## Features

- Custom OpenTelemetry sampler implementation
- Express.js REST API
- TypeScript support
- Automatic instrumentation using OpenTelemetry
- Configurable sampling rates

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- OpenTelemetry collector (for receiving traces)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Configuration

The application uses the following key configurations:

1. **Sampling Rate**: Configured in `tracing.ts` (currently set to 10% - 0.1)
2. **Service Name**: 'sampled-service'
3. **Port**: 4005

## Running the Application

Run the application using npm:

```bash
npm start
``` 

## API Endpoints

### GET /
Returns a simple hello message and demonstrates basic span creation.

### POST /api/data
Accepts JSON data and returns it with a confirmation message.

## Custom Sampler Implementation

The project includes a custom sampler (`DetermisticAndTraceIDSampler`) that combines two sampling strategies:

1. **Trace ID-based sampling**: Uses the trace ID to make consistent sampling decisions
2. **Attribute-based sampling**: Allows override of sampling decisions based on span attributes

## Environment Setup

Make sure to have an OpenTelemetry collector or Environment variables configured to receive traces. The application is configured to send traces using OTLP HTTP protocol.

## Dependencies

Key dependencies include:
- @opentelemetry/api
- @opentelemetry/auto-instrumentations-node
- @opentelemetry/sdk-trace-base
- express
- typescript

## License

ISC

## Contributing

Feel free to submit issues and pull requests.