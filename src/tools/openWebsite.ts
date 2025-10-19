export function openAPN(ds100: string): void {
  window.open(`https://trassenfinder.de/apn/${ds100}`, "_blank");
}

export function openOpenrailwaymaps(lat: number, lon: number) {
  window.open(
    `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=16`,
    "_blank"
  );
}

export function openGoogleMaps(lat: number, lon: number) {
  window.open(`https://www.google.com/maps/@${lat},${lon},17z`, "_blank");
}
