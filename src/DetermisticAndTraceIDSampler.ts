/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AttributeValue, isValidTraceId } from '@opentelemetry/api';
import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { SpanKind, Attributes, Link, Context } from '@opentelemetry/api';

/** Sampler that samples a given fraction of traces based of trace id deterministically. */
export class DetermisticAndTraceIDSampler implements Sampler {
  private _upperBound: number;
  private _deterministicOverrideAttributeName: string;

  constructor(private readonly _ratio: number = 0, deterministicOverrideAttributeName: string = "SampleRate") {
    this._ratio = this._normalize(_ratio);
    this._upperBound = Math.floor(this._ratio * 0xffffffff);
    this._deterministicOverrideAttributeName = deterministicOverrideAttributeName;
  }

  shouldSample(
    context: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[]
  ): SamplingResult {
    // Check if the _deterministicOverrideAttributeName is set in the attributes and use that to make a decision to override the traceId based sampling
    const sampleRate = attributes?.[this._deterministicOverrideAttributeName];
    if (sampleRate && this._isValidSampleRate(sampleRate)) {
        // Sample rate is 1 in N, so do a math random operation to make a decision
        const randomValue = Math.floor(Math.random() * (sampleRate as number));
        return {
            decision: randomValue === 0 ? SamplingDecision.RECORD_AND_SAMPLED : SamplingDecision.NOT_RECORD,
        };
    }
    return {
      decision:
        isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound
          ? SamplingDecision.RECORD_AND_SAMPLED
          : SamplingDecision.NOT_RECORD,
    };
  }

  toString(): string {
    return `DetermisticAndTraceIDSampler{${this._ratio}}{${this._deterministicOverrideAttributeName}}`;
  }
  private _isValidSampleRate(sampleRate: AttributeValue): boolean {
    if (typeof sampleRate !== 'number' || isNaN(sampleRate)) return false;
    return sampleRate >= 0;
  }
  private _normalize(ratio: number): number {
    if (typeof ratio !== 'number' || isNaN(ratio)) return 0;
    return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
  }

  private _accumulate(traceId: string): number {
    let accumulation = 0;
    for (let i = 0; i < traceId.length / 8; i++) {
      const pos = i * 8;
      const part = parseInt(traceId.slice(pos, pos + 8), 16);
      accumulation = (accumulation ^ part) >>> 0;
    }
    return accumulation;
  }
}
