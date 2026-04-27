/**
 * LSB (Least Significant Bit) Steganography.
 * Hides a string payload inside the RGB channels of an ImageData object.
 */

/**
 * Encodes a string message into an image file using LSB steganography.
 * Modifies the least significant bits of the R, G, and B channels.
 * Returns a Data URL of the resulting PNG image.
 */
export async function encodeStego(imageFile: File, message: string): Promise<string> {
  const img = new Image();
  const objectUrl = URL.createObjectURL(imageFile);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = objectUrl;
  });
  URL.revokeObjectURL(objectUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D not supported');

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const textEncoder = new TextEncoder();
  const payloadBytes = textEncoder.encode(message);
  
  // Format: [4 bytes length header] + [payload]
  const totalLength = payloadBytes.length;
  const bitsNeeded = (4 + totalLength) * 8;
  
  // We use 3 channels (R, G, B) per pixel, skipping Alpha
  const availableBits = (data.length / 4) * 3;
  if (bitsNeeded > availableBits) {
    throw new Error(`Image too small. Need ${bitsNeeded} bits, but only have ${availableBits} bits available.`);
  }

  // Create a combined byte array: 4 bytes length + payload
  const combined = new Uint8Array(4 + totalLength);
  new DataView(combined.buffer).setUint32(0, totalLength, false);
  combined.set(payloadBytes, 4);

  let bitIndex = 0;
  for (let i = 0; i < data.length; i++) {
    // Skip Alpha channel (every 4th byte)
    if ((i + 1) % 4 === 0) continue;

    if (bitIndex < bitsNeeded) {
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = 7 - (bitIndex % 8); // Read MSB to LSB of each byte
      const bit = (combined[byteIndex] >> bitOffset) & 1;
      
      // Clear LSB and set to our bit
      data[i] = (data[i] & 0xFE) | bit;
      
      // Force alpha to 255 for this pixel to prevent browser premultiplied-alpha from destroying RGB data
      const alphaIndex = i + (3 - (i % 4));
      data[alphaIndex] = 255;
      
      bitIndex++;
    } else {
      break;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  // Must return as PNG to preserve exact pixel values!
  return canvas.toDataURL('image/png');
}

/**
 * Decodes a hidden string message from an image file.
 */
export async function decodeStego(imageFile: File): Promise<string> {
  const img = new Image();
  const objectUrl = URL.createObjectURL(imageFile);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = objectUrl;
  });
  URL.revokeObjectURL(objectUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D not supported');

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // First read 32 bits (4 bytes) to get the payload length
  const lengthBytes = new Uint8Array(4);
  let currentBitIndex = 0;
  
  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;
    
    if (currentBitIndex < 32) {
      const byteIndex = Math.floor(currentBitIndex / 8);
      const bitOffset = 7 - (currentBitIndex % 8);
      const bit = data[i] & 1;
      lengthBytes[byteIndex] |= (bit << bitOffset);
      currentBitIndex++;
    } else {
      break;
    }
  }

  const payloadLength = new DataView(lengthBytes.buffer).getUint32(0, false);
  
  // Sanity check on length to avoid massive allocations (e.g., max 50MB)
  if (payloadLength === 0 || payloadLength > 50 * 1024 * 1024) {
      throw new Error('No valid steganographic payload found in this image.');
  }

  const bitsNeeded = (4 + payloadLength) * 8;
  const availableBits = (data.length / 4) * 3;
  if (bitsNeeded > availableBits) {
      throw new Error('Payload length specified in image header exceeds image capacity. Image may be corrupted or not contain a valid payload.');
  }

  const payloadBytes = new Uint8Array(payloadLength);
  
  // Resume reading the payload
  currentBitIndex = 0;
  let payloadBitIndex = 0;

  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;

    if (currentBitIndex >= 32 && payloadBitIndex < payloadLength * 8) {
        const byteIndex = Math.floor(payloadBitIndex / 8);
        const bitOffset = 7 - (payloadBitIndex % 8);
        const bit = data[i] & 1;
        payloadBytes[byteIndex] |= (bit << bitOffset);
        payloadBitIndex++;
    }
    currentBitIndex++;
    if (payloadBitIndex >= payloadLength * 8) break;
  }

  return new TextDecoder().decode(payloadBytes);
}
