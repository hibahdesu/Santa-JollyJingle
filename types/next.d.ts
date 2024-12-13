// types/next.d.ts or next.d.ts (if no types folder exists)
import { IncomingMessage } from 'http';

declare module 'next' {
  interface NextApiRequest extends IncomingMessage {
    file?: Express.Multer.File; // Add 'file' to the request type
  }
}
