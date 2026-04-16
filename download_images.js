import fs from 'fs';
import https from 'https';
import path from 'path';

const urls = [
  { url: 'https://storage.googleapis.com/mfc-aistudio-jungle-prod/attachments/3b1b9e07-f705-403d-82d2-88137269389e/image.png', name: 'sample-girl.png' },
  { url: 'https://storage.googleapis.com/mfc-aistudio-jungle-prod/attachments/0c7c7247-4148-4384-814e-6e85e4e8992a/image.png', name: 'sample-boy.png' },
  { url: 'https://storage.googleapis.com/mfc-aistudio-jungle-prod/attachments/240b9d99-31e2-4f36-963d-4c3214b72740/image.png', name: 'sample-6-4.png' },
  { url: 'https://storage.googleapis.com/mfc-aistudio-jungle-prod/attachments/d2657d46-a511-447a-85b4-712398a6509f/image.png', name: 'sample-8.png' }
];

const dir = './public/images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

urls.forEach(({url, name}) => {
  const file = fs.createWriteStream(path.join(dir, name));
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log(`Downloaded ${name}`);
    });
  }).on('error', function(err) {
    fs.unlink(path.join(dir, name), () => {});
    console.error(`Error downloading ${name}: ${err.message}`);
  });
});
