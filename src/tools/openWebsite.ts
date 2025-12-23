export function openAPN(ds100: string | undefined): void {
  if (!ds100) return;
  window.open(`https://trassenfinder.de/apn/${ds100}`, "_blank");
}

export function openOpenrailwaymaps(lat: number, lon: number) {
  window.open(
    `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=16`,
    "_blank"
  );
}

export function openGoogleMaps(
  lat: number | undefined,
  lon: number | undefined
) {
  if (!lat || !lon) return;
  // window.open(`https://www.google.com/maps/@${lat},${lon},17z`, "_blank");
  window.open(`https://maps.google.com/maps?q=${lat},${lon}`, "_blank");
}
