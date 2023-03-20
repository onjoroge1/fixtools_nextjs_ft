function timeZoneFunction(from, to, value) {
  if (from === "Coordinated Universal Time" && to === "Central Standard Time") {
    return Number(value) - 6;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Chamorro Time Zone"
  ) {
    return Number(value) + 10;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) - 8;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) - 9;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 10;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) - 4;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) - 5;
  } else if (
    from === "Coordinated Universal Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number(value) - 7;
  } else if (
    from === "Central Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 6;
  } else if (from === "Central Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 16;
  } else if (
    from === "Central Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) - 2;
  } else if (
    from === "Central Standard Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) - 3;
  } else if (
    from === "Central Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 4;
  } else if (
    from === "Central Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 2;
  } else if (
    from === "Central Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) + 1;
  } else if (
    from === "Central Standard Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number(value) - 1;
  } else if (
    from === "Chamorro Time Zone" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) - 10;
  } else if (from === "Chamorro Time Zone" && to === "Central Standard Time") {
    return Number(value) - 16;
  } else if (from === "Chamorro Time Zone" && to === "Pacific Standard Time") {
    return Number(value) - 18;
  } else if (from === "Chamorro Time Zone" && to === "Alaskan Standard Time") {
    return Number(value) - 19;
  } else if (from === "Chamorro Time Zone" && to === "Hawaii Standard Time") {
    return Number(value) - 20;
  } else if (from === "Chamorro Time Zone" && to === "Atlantic Standard Time") {
    return Number(value) - 14;
  } else if (from === "Chamorro Time Zone" && to === "Eastern Standard Time") {
    return Number(value) - 15;
  } else if (from === "Chamorro Time Zone" && to === "Mountain Standard Time") {
    return Number(value) - 17;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 8;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) + 2;
  } else if (from === "Pacific Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 18;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) - 1;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 2;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 4;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) + 3;
  } else if (
    from === "Pacific Standard Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number(value) + 1;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 9;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) + 3;
  } else if (from === "Alaskan Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 19;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 1;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) + 1;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 5;
  } else if (
    from === "Alaskan Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) + 4;
  } else if (from === "Alaskan Standard Time" && to === "Mountain Standard") {
    return Number(value) + 2;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 10;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) + 4;
  } else if (from === "Hawaii Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 20;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) + 2;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) + 1;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 6;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) + 5;
  } else if (
    from === "Hawaii Standard Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 4;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) - 2;
  } else if (from === "Atlantic Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 14;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) - 4;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "ALaskan Standard Time"
  ) {
    return Number(value) - 5;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 6;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) - 1;
  } else if (
    from === "Atlantic Standard Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number(value) - 3;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 5;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) - 1;
  } else if (from === "Eastern Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 15;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) - 3;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) - 4;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 5;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 1;
  } else if (
    from === "Eastern Standard Time" &&
    to === "Mountain Standard Time"
  ) {
    return Number(value) - 2;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Coordinated Universal Time"
  ) {
    return Number(value) + 7;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Central Standard Time"
  ) {
    return Number(value) + 1;
  } else if (from === "Mountain Standard Time" && to === "Chamorro Time Zone") {
    return Number(value) + 17;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Pacific Standard Time"
  ) {
    return Number(value) - 1;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Alaskan Standard Time"
  ) {
    return Number(value) - 2;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Hawaii Standard Time"
  ) {
    return Number(value) - 3;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Atlantic Standard Time"
  ) {
    return Number(value) + 3;
  } else if (
    from === "Mountain Standard Time" &&
    to === "Eastern Standard Time"
  ) {
    return Number(value) + 2;
  }
}

export default timeZoneFunction;
