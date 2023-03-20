const timeZoneData = [
  "Coordinated Universal Time",
  "Central Standard Time",
  "Eastern Standard Time",
  "Pacific Standard Time",
  "Atlantic Standard Time",
  "Chamorro Time Zone",
  "Mountain Standard Time",
];

const hoursArr = [];
const minutesArr = [];
for (let i = 1; i <= 24; i++) {
  hoursArr.push(i);
}
for (let i = 1; i <= 60; i++) {
  minutesArr.push(i);
}

export { hoursArr, minutesArr, timeZoneData };
