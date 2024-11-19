// Example filename: tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
  } from '@opentelemetry/semantic-conventions';


import { DetermisticAndTraceIDSampler } from './DetermisticAndTraceIDSampler';
const samplePercentage = 0.1;
const sdk: NodeSDK = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  resource:  new Resource({
    [ATTR_SERVICE_NAME]: 'sampled-service',
    [ATTR_SERVICE_VERSION]: '1.0',
    "SampleRate": Math.round( 1 / samplePercentage)
  }),
  sampler: new DetermisticAndTraceIDSampler(samplePercentage, "SampleRate"),
  instrumentations: [    
    getNodeAutoInstrumentations({
      // We recommend disabling fs automatic instrumentation because 
      // it can be noisy and expensive during startup
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();
