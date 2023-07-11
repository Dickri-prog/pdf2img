const express = require('express');
const path = require('path');
const AdmZip = require('adm-zip');
const fileUpload = require('express-fileupload');
const pdf2img = require('pdf-img-convert');


const app = express();

app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', (req, res) => {
  try {
    const pdfBuffer = req.files.pdf.data
    const outputImages = pdf2img.convert(pdfBuffer);
    const outputZip = new AdmZip();

    outputImages.then(function(outputImages) {
      for (i = 0; i < outputImages.length; i++) {
        outputZip.addFile(`image-${i + 1}.png`, outputImages[i]);
      }
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename="images.zip"');

      res.status(200).send(outputZip.toBuffer());

    });
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Type error occurred:', error.message);
    } else {
      console.error('An error occurred:', error);
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
