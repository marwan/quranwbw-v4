export function downloadVerseImage(key) {
  html2canvas(document.getElementById(key), {
    letterRendering: 1,
    allowTaint: true,
    useCORS: true,
  })
    .then(function (canvas) {
      download(canvas, key);
    })
    .catch((e) => {
      alert(e);
    });
}

function download(canvas, key) {
  let downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", `Verse ${key} - ${Date.now()}.png`);
  canvas.toBlob(function (blob) {
    let url = URL.createObjectURL(blob);
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  });
}
