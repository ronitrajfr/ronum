export function openTabletViewWithData(url: string, item: any) {
  const width = 800;
  const height = 1100;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const newWindow = window.open(
    url,
    "tabletWindow",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  );

  // Wait for the new window to load, then send data
  newWindow?.addEventListener("load", () => {
    newWindow.postMessage({ type: "PDF_DATA", item }, window.location.origin);
  });
}
