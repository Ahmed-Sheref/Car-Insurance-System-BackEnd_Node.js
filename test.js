import path from 'node:path';
import { fileURLToPath } from 'node:url';



console.log(path.join(path.basename(import.meta.dirname), 'data.env'))