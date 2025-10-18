// async function openOpenrailwaymaps(RL100Code: string, RL100Lang: string) {
//   const query = `
// [out:json][timeout:25];
// nwr["railway"]["ref:de:ds100"="${RL100Code}"];
// nwr["railway"]["name"="${RL100Lang}"];
// out center;
// `;
//   try {
//     const request = await fetch(`https://overpass-api.de/api/interpreter`, {
//       method: "POST",
//       body: query,
//     });
//     const data = await request.json();

//     if (data.elements.length === 0) {
//       alert("Es konnte keine Betriebsstelle gefunden werden.");
//       return;
//     }

//     const { lat, lon } = data.elements[0];
//     window.open(
//       `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=15`,
//       "_blank"
//     );
//   } catch (e) {
//     console.error(e);
//   }
// }

export async function checkOpenrailwaymaps(
  RL100Lang: string
): Promise<boolean> {
  try {
    const request = await fetch(
      `https://api.openrailwaymap.org/v2/facility?q=${RL100Lang}&limit=1`
    );
    const data = await request.json();
    return data[0] ? true : false;
  } catch {
    return false;
  }
}

export async function openOpenrailwaymaps(RL100Lang: string) {
  try {
    const request = await fetch(
      `https://api.openrailwaymap.org/v2/facility?q=${RL100Lang}&limit=1`
    );
    const data = await request.json();
    const { latitude, longitude } = data[0];

    window.open(
      `https://www.openrailwaymap.org/?lat=${longitude}&lon=${latitude}&zoom=15`,
      "_blank"
    );
  } catch (e) {
    alert("Keinen Eintrag in openrailway.org gefunden.");
    console.log(e);
  }
}
