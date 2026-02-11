const fs = require('fs');

// Parameters
const sampleRate = 44100;
const duration = 20.0; // seconds
const frequency = 440.0; // Hz
const volume = 0.5;
const numSamples = sampleRate * duration;
const bytesPerSample = 2; // 16-bit
const numChannels = 1;
const byteRate = sampleRate * numChannels * bytesPerSample;
const blockAlign = numChannels * bytesPerSample;
const dataSize = numSamples * numChannels * bytesPerSample;
const fileSize = 36 + dataSize;

const buffer = Buffer.alloc(44 + dataSize);

// RIFF chunk
buffer.write('RIFF', 0);
buffer.writeUInt32LE(fileSize, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate samples (Triangle Wave)
for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const period = 1 / frequency;
    const phase = (t % period) / period; // 0.0 to 1.0

    let value;
    if (phase < 0.25) {
        value = 4 * phase;
    } else if (phase < 0.75) {
        value = 2 - 4 * phase;
    } else {
        value = -4 + 4 * phase;
    }

    // Convert -1.0..1.0 to 16-bit signed integer
    const sample = Math.max(-32768, Math.min(32767, value * volume * 32767));

    buffer.writeInt16LE(sample, 44 + i * bytesPerSample);
}

fs.writeFileSync('assets/tone.wav', buffer);
console.log('Generated assets/tone.wav');
