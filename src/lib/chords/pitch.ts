/**
 * Autocorrelation-based pitch detection for guitar tuner use.
 * Returns frequency in Hz, or -1 when no clear pitch is found.
 */
export function detectPitchAutocorrelation(
  buffer: Float32Array,
  sampleRate: number,
): number {
  const SIZE = buffer.length;
  if (SIZE < 32) return -1;

  // RMS gate — ignore silence / noise floor
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  // Guitar range roughly 70–400 Hz for open strings (+ some headroom)
  const minPeriod = Math.floor(sampleRate / 420);
  const maxPeriod = Math.floor(sampleRate / 70);
  if (maxPeriod >= SIZE) return -1;

  let bestOffset = -1;
  let bestCorrelation = 0;
  let lastCorrelation = 1;

  for (let offset = minPeriod; offset <= maxPeriod; offset++) {
    let correlation = 0;
    for (let i = 0; i < SIZE - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation = correlation / (SIZE - offset);

    // Peak after declining slope
    if (correlation > bestCorrelation && correlation > 0.01 && lastCorrelation > correlation) {
      // found a peak on previous offset — keep scanning for global max
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
    lastCorrelation = correlation;
  }

  if (bestOffset === -1 || bestCorrelation < 0.01) return -1;

  // Parabolic interpolation around the best lag for finer resolution
  const y0 = correlateAt(buffer, bestOffset - 1);
  const y1 = bestCorrelation;
  const y2 = correlateAt(buffer, bestOffset + 1);
  const denom = 2 * (2 * y1 - y0 - y2);
  const shift = denom !== 0 ? (y2 - y0) / denom : 0;
  const refined = bestOffset + shift;

  if (refined <= 0) return -1;
  return sampleRate / refined;
}

function correlateAt(buffer: Float32Array, offset: number): number {
  if (offset < 1 || offset >= buffer.length) return 0;
  let correlation = 0;
  const limit = buffer.length - offset;
  for (let i = 0; i < limit; i++) {
    correlation += buffer[i] * buffer[i + offset];
  }
  return correlation / limit;
}

export function frequencyToCents(freq: number, targetFreq: number): number {
  if (freq <= 0 || targetFreq <= 0) return 0;
  return 1200 * Math.log2(freq / targetFreq);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
