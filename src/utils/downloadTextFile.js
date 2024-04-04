// function to download any text/string as a text file
export function downloadTextFile(name, data) {
  const link = document.createElement("a");
  const file = new Blob([data], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = `${name}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
