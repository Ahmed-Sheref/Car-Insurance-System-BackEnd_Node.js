import multer from 'multer';
import path from 'path'

const __dirname = new URL('.', import.meta.url).pathname;

console.log(path.join(__dirname , '../images'));



// Multer storage setup
const storage = multer.diskStorage(
{
    destination: (req, file, cb) => 
    {
        cb(null, 'D:\\Programming\\Back_end\\MyProject\\images');
    },
    filename: (req, file, cb) => 
    {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


export const upload = multer({storage:storage});
