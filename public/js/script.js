const uploadFilePdf = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const blob = await response.blob();
    downloadFile(blob, 'images.zip');
  } catch (error) {
    console.error('Failed to upload and convert file:', error.message);
  }
};

const downloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.querySelector('#loading').innerText = 'Success...'
};

const fileInputPdf = document.getElementById('fileInputPdf');
const fileInputPdfBtn = document.querySelector('#fileUploaderInputPdf > #btnUpload')

fileInputPdfBtn.addEventListener('click', () => {
  const file = fileInputPdf.files[0];

  document.querySelector('#loading').innerText = "Loading..."
  document.querySelector('#loading').classList.add('active')

  if (file) {
    uploadFilePdf(file);
  }
})

fileInputPdf.addEventListener('change', () => {
  document.querySelector('#loading').classList.remove('active')
})