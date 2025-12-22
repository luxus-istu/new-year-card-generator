import Sharp from "sharp";

export async function convertBufferToWebP(
  inputBuffer: Buffer,
  options?: Sharp.WebpOptions
): Promise<Buffer> {
  return await Sharp(inputBuffer)
    .webp(options)
    .toBuffer();
}
