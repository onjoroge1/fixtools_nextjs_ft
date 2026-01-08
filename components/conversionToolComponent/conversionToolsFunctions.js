export const massConversion = (from, to, value) => {
  if (from === 'gram' && to === 'kilogram') {
    return value / 1000;
  } else if (from === 'gram' && to === 'milligram') {
    return value * 1000;
  } else if (from === 'gram' && to === 'pounds') {
    return value / 453.6;
  } else if (from === 'kilogram' && to === 'gram') {
    return value * 1000;
  } else if (from === 'kilogram' && to === 'milligram') {
    return value * 1000000;
  } else if (from === 'kilogram' && to === 'pounds') {
    return value * 2.205;
  } else if (from === 'pounds' && to === 'gram') {
    return value * 453.6;
  } else if (from === 'pounds' && to === 'kilogram') {
    return value / 2.205;
  } else if (from === 'pounds' && to === 'milligram') {
    return value * 453600;
  } else if (from === 'milligram' && to === 'kilogram') {
    return value / 1000000;
  } else if (from === 'milligram' && to === 'pounds') {
    return value / 453600;
  } else if (from === 'milligram' && to === 'gram') {
    return value / 1000;
  }
};
export const volumeConversion = (from, to, value) => {
  // Convert everything to liters first, then to target unit
  let liters;
  
  // Convert from source unit to liters
  switch (from) {
    // Metric SI units
    case 'cubicMeter':
    case 'cubic meter':
      liters = value * 1000;
      break;
    case 'liter':
    case 'litre':
      liters = value;
      break;
    case 'milliliter':
    case 'millilitre':
    case 'ml':
      liters = value / 1000;
      break;
    case 'cubicCentimeter':
    case 'cubic centimeter':
    case 'cc':
    case 'cm3':
      liters = value / 1000; // 1 cc = 1 ml = 0.001 L
      break;
    case 'cubicDecimeter':
    case 'cubic decimeter':
    case 'dm3':
      liters = value; // 1 dm³ = 1 L
      break;
    case 'cubicKilometer':
    case 'cubic kilometer':
    case 'km3':
      liters = value * 1000000000000; // 1 km³ = 10¹² L
      break;
    
    // Imperial/US Cubic units
    case 'cubicInch':
    case 'cubic inch':
    case 'in3':
      liters = value * 0.0163871;
      break;
    case 'cubicFoot':
    case 'cubic foot':
    case 'ft3':
      liters = value * 28.3168;
      break;
    case 'cubicYard':
    case 'cubic yard':
    case 'yd3':
      liters = value * 764.555;
      break;
    
    // US Customary units
    case 'usFluidOunce':
    case 'US fluid ounce':
    case 'fl oz US':
      liters = value * 0.0295735;
      break;
    case 'usCup':
    case 'US cup':
    case 'cup US':
      liters = value * 0.236588;
      break;
    case 'usPint':
    case 'US pint':
    case 'pt US':
      liters = value * 0.473176;
      break;
    case 'usQuart':
    case 'US quart':
    case 'qt US':
      liters = value * 0.946353;
      break;
    case 'usGallon':
    case 'US gallon':
    case 'gallon':
    case 'gal US':
      liters = value * 3.78541;
      break;
    case 'usBarrel':
    case 'US barrel':
    case 'bbl':
      liters = value * 119.24; // US fluid barrel
      break;
    
    // US Cooking units
    case 'teaspoon':
    case 'tsp':
      liters = value * 0.00492892;
      break;
    case 'tablespoon':
    case 'tbsp':
      liters = value * 0.0147868;
      break;
    
    // Imperial units (UK)
    case 'imperialFluidOunce':
    case 'Imperial fluid ounce':
    case 'fl oz UK':
      liters = value * 0.0284131;
      break;
    case 'imperialCup':
    case 'Imperial cup':
    case 'cup UK':
      liters = value * 0.284131;
      break;
    case 'imperialPint':
    case 'Imperial pint':
    case 'pt UK':
      liters = value * 0.568261;
      break;
    case 'imperialQuart':
    case 'Imperial quart':
    case 'qt UK':
      liters = value * 1.13652;
      break;
    case 'imperialGallon':
    case 'Imperial gallon':
    case 'gal UK':
      liters = value * 4.54609;
      break;
    
    default:
      return undefined;
  }
  
  // Convert from liters to target unit
  switch (to) {
    // Metric SI units
    case 'cubicMeter':
    case 'cubic meter':
      return liters / 1000;
    case 'liter':
    case 'litre':
      return liters;
    case 'milliliter':
    case 'millilitre':
    case 'ml':
      return liters * 1000;
    case 'cubicCentimeter':
    case 'cubic centimeter':
    case 'cc':
    case 'cm3':
      return liters * 1000;
    case 'cubicDecimeter':
    case 'cubic decimeter':
    case 'dm3':
      return liters;
    case 'cubicKilometer':
    case 'cubic kilometer':
    case 'km3':
      return liters / 1000000000000;
    
    // Imperial/US Cubic units
    case 'cubicInch':
    case 'cubic inch':
    case 'in3':
      return liters / 0.0163871;
    case 'cubicFoot':
    case 'cubic foot':
    case 'ft3':
      return liters / 28.3168;
    case 'cubicYard':
    case 'cubic yard':
    case 'yd3':
      return liters / 764.555;
    
    // US Customary units
    case 'usFluidOunce':
    case 'US fluid ounce':
    case 'fl oz US':
      return liters / 0.0295735;
    case 'usCup':
    case 'US cup':
    case 'cup US':
      return liters / 0.236588;
    case 'usPint':
    case 'US pint':
    case 'pt US':
      return liters / 0.473176;
    case 'usQuart':
    case 'US quart':
    case 'qt US':
      return liters / 0.946353;
    case 'usGallon':
    case 'US gallon':
    case 'gallon':
    case 'gal US':
      return liters / 3.78541;
    case 'usBarrel':
    case 'US barrel':
    case 'bbl':
      return liters / 119.24;
    
    // US Cooking units
    case 'teaspoon':
    case 'tsp':
      return liters / 0.00492892;
    case 'tablespoon':
    case 'tbsp':
      return liters / 0.0147868;
    
    // Imperial units (UK)
    case 'imperialFluidOunce':
    case 'Imperial fluid ounce':
    case 'fl oz UK':
      return liters / 0.0284131;
    case 'imperialCup':
    case 'Imperial cup':
    case 'cup UK':
      return liters / 0.284131;
    case 'imperialPint':
    case 'Imperial pint':
    case 'pt UK':
      return liters / 0.568261;
    case 'imperialQuart':
    case 'Imperial quart':
    case 'qt UK':
      return liters / 1.13652;
    case 'imperialGallon':
    case 'Imperial gallon':
    case 'gal UK':
      return liters / 4.54609;
    
    default:
      return undefined;
  }
};
export const areaConversion = (from, to, value) => {
  // Convert everything to square meters first, then to target unit
  let squareMeters;
  
  // Convert from source unit to square meters
  switch (from) {
    // Metric SI units
    case 'squareMillimeter':
    case 'square millimeter':
    case 'mm2':
    case 'mm²':
      squareMeters = value / 1000000; // 1 mm² = 0.000001 m²
      break;
    case 'squareCentimeter':
    case 'square centimeter':
    case 'cm2':
    case 'cm²':
      squareMeters = value / 10000; // 1 cm² = 0.0001 m²
      break;
    case 'squareMeter':
    case 'square meter':
    case 'meter':
    case 'm2':
    case 'm²':
      squareMeters = value;
      break;
    case 'squareKilometer':
    case 'square kilometer':
    case 'kilometer':
    case 'km2':
    case 'km²':
      squareMeters = value * 1000000; // 1 km² = 1,000,000 m²
      break;
    case 'hectare':
    case 'ha':
      squareMeters = value * 10000; // 1 hectare = 10,000 m²
      break;
    case 'are':
    case 'a':
      squareMeters = value * 100; // 1 are = 100 m²
      break;
    
    // US/Imperial units
    case 'squareInch':
    case 'square inch':
    case 'in2':
    case 'in²':
      squareMeters = value * 0.00064516; // 1 in² = 0.00064516 m²
      break;
    case 'squareFoot':
    case 'square foot':
    case 'foot':
    case 'ft2':
    case 'ft²':
      squareMeters = value * 0.092903; // 1 ft² = 0.092903 m²
      break;
    case 'squareYard':
    case 'square yard':
    case 'yard':
    case 'yd2':
    case 'yd²':
      squareMeters = value * 0.836127; // 1 yd² = 0.836127 m²
      break;
    case 'acre':
      squareMeters = value * 4046.86; // 1 acre = 4,046.86 m²
      break;
    case 'squareMile':
    case 'square mile':
    case 'mile':
    case 'mi2':
    case 'mi²':
      squareMeters = value * 2589988.11; // 1 mi² = 2,589,988.11 m²
      break;
    
    default:
      return undefined;
  }
  
  // Convert from square meters to target unit
  switch (to) {
    // Metric SI units
    case 'squareMillimeter':
    case 'square millimeter':
    case 'mm2':
    case 'mm²':
      return squareMeters * 1000000;
    case 'squareCentimeter':
    case 'square centimeter':
    case 'cm2':
    case 'cm²':
      return squareMeters * 10000;
    case 'squareMeter':
    case 'square meter':
    case 'meter':
    case 'm2':
    case 'm²':
      return squareMeters;
    case 'squareKilometer':
    case 'square kilometer':
    case 'kilometer':
    case 'km2':
    case 'km²':
      return squareMeters / 1000000;
    case 'hectare':
    case 'ha':
      return squareMeters / 10000;
    case 'are':
    case 'a':
      return squareMeters / 100;
    
    // US/Imperial units
    case 'squareInch':
    case 'square inch':
    case 'in2':
    case 'in²':
      return squareMeters / 0.00064516;
    case 'squareFoot':
    case 'square foot':
    case 'foot':
    case 'ft2':
    case 'ft²':
      return squareMeters / 0.092903;
    case 'squareYard':
    case 'square yard':
    case 'yard':
    case 'yd2':
    case 'yd²':
      return squareMeters / 0.836127;
    case 'acre':
      return squareMeters / 4046.86;
    case 'squareMile':
    case 'square mile':
    case 'mile':
    case 'mi2':
    case 'mi²':
      return squareMeters / 2589988.11;
    
    default:
      return undefined;
  }
};

export const bitByteConversion = (from, to, value) => {
  if (from === 'bit' && to === 'byte') {
    return value / 8;
  } else if (from === 'byte' && to === 'bit') {
    return value * 8;
  }
};
export const powerConversion = (from, to, value) => {
  // Convert everything to watts first, then to target unit
  let watts;
  
  // Convert from source unit to watts
  switch (from) {
    case 'milliwatt':
      watts = value / 1000;
      break;
    case 'watt':
      watts = value;
      break;
    case 'kilowatt':
      watts = value * 1000;
      break;
    case 'megawatt':
      watts = value * 1000000;
      break;
    case 'gigawatt':
      watts = value * 1000000000;
      break;
    case 'horsepower': // Mechanical/Imperial horsepower
      watts = value * 745.699872;
      break;
    case 'metricHorsepower': // PS (Pferdestärke)
      watts = value * 735.49875;
      break;
    case 'btuPerHour':
      watts = value * 0.29307107;
      break;
    case 'footPoundPerSecond':
      watts = value * 1.355817948;
      break;
    case 'caloriePerSecond':
      watts = value * 4.184;
      break;
    default:
      return undefined;
  }
  
  // Convert from watts to target unit
  switch (to) {
    case 'milliwatt':
      return watts * 1000;
    case 'watt':
      return watts;
    case 'kilowatt':
      return watts / 1000;
    case 'megawatt':
      return watts / 1000000;
    case 'gigawatt':
      return watts / 1000000000;
    case 'horsepower':
      return watts / 745.699872;
    case 'metricHorsepower':
      return watts / 735.49875;
    case 'btuPerHour':
      return watts / 0.29307107;
    case 'footPoundPerSecond':
      return watts / 1.355817948;
    case 'caloriePerSecond':
      return watts / 4.184;
    default:
      return undefined;
  }
};
export const timeConversion = (from, to, value) => {
  if (from === 'hour' && to === 'minute') {
    return value * 60;
  } else if (from === 'hour' && to === 'second') {
    return value * 3600;
  } else if (from === 'minute' && to === 'hour') {
    return value / 60;
  } else if (from === 'minute' && to === 'second') {
    return value * 60;
  } else if (from === 'second' && to === 'minute') {
    return value / 60;
  } else if (from === 'second' && to === 'hour') {
    return value / 3600;
  }
};
export const temperatureConversion = (from, to, value) => {
  if (from === 'celcius' && to === 'farenheit') {
    return (value * 9) / 5 + 32;
  } else if (from === 'celcius' && to === 'kelvin') {
    return value + 273.15;
  } else if (from === 'celcius' && to === 'rankine') {
    return value * (9 / 5) + 491.67;
  } else if (from === 'farenheit' && to === 'celcius') {
    return ((value - 32) * 5) / 9;
  } else if (from === 'farenheit' && to === 'kelvin') {
    return ((value - 32) * 5) / 9 + 273.15;
  } else if (from === 'farenheit' && to === 'rankine') {
    return value + 459.67;
  } else if (from === 'kelvin' && to === 'celcius') {
    return value - 273.15;
  } else if (from === 'kelvin' && to === 'farenheit') {
    return ((value - 273.15) * 9) / 5 + 32;
  } else if (from === 'kelvin' && to === 'rankine') {
    return value + 459.67;
  } else if (from === 'rankine' && to === 'farenheit') {
    return value - 459.67;
  } else if (from === 'rankine' && to === 'celcius') {
    return (value - 491.67) * (5 / 9);
  } else if (from === 'rankine' && to === 'kelvin') {
    return value - 5 / 9;
  }
};
export const presurreConversion = (from, to, value) => {
  // Convert everything to pascals first, then to target unit
  let pascals;
  
  // Convert from source unit to pascals
  switch (from) {
    case 'pascal':
      pascals = value;
      break;
    case 'kilopascal':
      pascals = value * 1000;
      break;
    case 'megapascal':
      pascals = value * 1000000;
      break;
    case 'bar':
      pascals = value * 100000;
      break;
    case 'millibar':
      pascals = value * 100;
      break;
    case 'hectopascal':
      pascals = value * 100;
      break;
    case 'atm':
    case 'atmosphere':
      pascals = value * 101325;
      break;
    case 'torr':
    case 'millimeterOfMercury':
      pascals = value * 133.322;
      break;
    case 'psi':
    case 'poundPerSquareInch':
      pascals = value * 6894.76;
      break;
    case 'psf':
    case 'poundPerSquareFoot':
      pascals = value * 47.8803;
      break;
    case 'inchOfMercury':
      pascals = value * 3386.39;
      break;
    case 'inchOfWater':
      pascals = value * 249.089;
      break;
    case 'millimeterOfWater':
    case 'mmH2O':
      pascals = value * 9.80665;
      break;
    case 'technicalAtmosphere':
    case 'at':
      pascals = value * 98066.5;
      break;
    default:
      return undefined;
  }
  
  // Convert from pascals to target unit
  switch (to) {
    case 'pascal':
      return pascals;
    case 'kilopascal':
      return pascals / 1000;
    case 'megapascal':
      return pascals / 1000000;
    case 'bar':
      return pascals / 100000;
    case 'millibar':
      return pascals / 100;
    case 'hectopascal':
      return pascals / 100;
    case 'atm':
    case 'atmosphere':
      return pascals / 101325;
    case 'torr':
    case 'millimeterOfMercury':
      return pascals / 133.322;
    case 'psi':
    case 'poundPerSquareInch':
      return pascals / 6894.76;
    case 'psf':
    case 'poundPerSquareFoot':
      return pascals / 47.8803;
    case 'inchOfMercury':
      return pascals / 3386.39;
    case 'inchOfWater':
      return pascals / 249.089;
    case 'millimeterOfWater':
    case 'mmH2O':
      return pascals / 9.80665;
    case 'technicalAtmosphere':
    case 'at':
      return pascals / 98066.5;
    default:
      return undefined;
  }
};
export const lengthConversion = (from, to, value) => {
  if (from === 'centimeter' && to === 'meter') {
    return value / 1000;
  } else if (from === 'centimeter' && to === 'millimeter') {
    return value * 10;
  } else if (from === 'centimeter' && to === 'kilometer') {
    return value / 100000;
  } else if (from === 'centimeter' && to === 'inch') {
    return value / 2.54;
  } else if (from === 'meter' && to === 'inch') {
    return value * 39.37;
  } else if (from === 'meter' && to === 'centimeter') {
    return value * 100;
  } else if (from === 'meter' && to === 'millimeter') {
    return value * 1000;
  } else if (from === 'meter' && to === 'kilometer') {
    return value / 1000;
  } else if (from === 'inch' && to === 'meter') {
    return value / 39.37;
  } else if (from === 'inch' && to === 'millimeter') {
    return value * 25.4;
  } else if (from === 'inch' && to === 'centimeter') {
    return value * 2.54;
  } else if (from === 'inch' && to === 'kilometer') {
    return value / 39370;
  } else if (from === 'kilometer' && to === 'meter') {
    return value * 1000;
  } else if (from === 'kilometer' && to === 'millimeter') {
    return value * 1000000;
  } else if (from === 'kilometer' && to === 'inch') {
    return value * 39370;
  } else if (from === 'kilometer' && to === 'centimeter') {
    return value * 100000;
  } else if (from === 'millimeter' && to === 'centimeter') {
    return value / 10;
  } else if (from === 'millimeter' && to === 'meter') {
    return value / 1000;
  } else if (from === 'millimeter' && to === 'inch') {
    return value / 25.4;
  } else if (from === 'millimeter' && to === 'kilometer') {
    return value / 1000000;
  }
};
export const energyConversion = (from, to, value) => {
  if (from === 'joule' && to === 'kilojoule') {
    return value / 1000;
  } else if (from === 'joule' && to === 'kilocalorie') {
    return value / 4184;
  } else if (from === 'joule' && to === 'gramcalorie') {
    return value / 4.184;
  } else if (from === 'joule' && to === 'footpound') {
    return value / 1.356;
  } else if (from === 'kilojoule' && to === 'joule') {
    return value * 1000;
  } else if (from === 'kilojoule' && to === 'gramcalorie') {
    return value * 239;
  } else if (from === 'kilojoule' && to === 'kilocalorie') {
    return value / 4.184;
  } else if (from === 'kilojoule' && to === 'footpound') {
    return value * 737.6;
  } else if (from === 'gramcalorie' && to === 'joule') {
    return value * 4.184;
  } else if (from === 'gramcalorie' && to === 'kilocalorie') {
    return value / 1000;
  } else if (from === 'gramcalorie' && to === 'kilojoule') {
    return value / 239;
  } else if (from === 'gramcalorie' && to === 'footpound') {
    return value * 3.086;
  } else if (from === 'footpound' && to === 'joule') {
    return value * 1.356;
  } else if (from === 'footpound' && to === 'kilojoule') {
    return value / 737.6;
  } else if (from === 'footpound' && to === 'gramcalorie') {
    return value / 3.086;
  } else if (from === 'footpound' && to === 'kilocalorie') {
    return value / 3086;
  } else if (from === 'kilocalorie' && to === 'joule') {
    return value * 4184;
  } else if (from === 'kilocalorie' && to === 'kilojoule') {
    return value * 4.184;
  } else if (from === 'kilocalorie' && to === 'gramcalorie') {
    return value * 1000;
  } else if (from === 'kilocalorie' && to === 'footpound') {
    return value * 3085.96;
  }
};
export const speedConversion = (from, to, value) => {
  if (from === 'meter per second' && to === 'kilometer per hour') {
    return value * 3.6;
  } else if (from === 'meter per second' && to === 'miles per hour') {
    return value * 2.237;
  } else if (from === 'meter per second' && to === 'foot per second') {
    return value * 3.281;
  } else if (from === 'miles per hour' && to === 'meter per second') {
    return value / 2.237;
  } else if (from === 'miles per hour' && to === 'kilometer per hour') {
    return value / 1.609;
  } else if (from === 'miles per hour' && to === 'foot per second') {
    return value / 1.467;
  } else if (from === 'foot per second' && to === 'meter per second') {
    return value / 3.281;
  } else if (from === 'foot per second' && to === 'miles per hour') {
    return value / 1.467;
  } else if (from === 'foot per second' && to === 'kilometer per hour') {
    return value * 1.097;
  } else if (from === 'kilometer per hour' && to === 'foot per second') {
    return value / 1.097;
  } else if (from === 'kilometer per hour' && to === 'miles per hour') {
    return value / 1.609;
  } else if (from === 'kilometer per hour' && to === 'meter per second') {
    return value / 3.6;
  }
};
export const fuelEconomyConversion = (from, to, value) => {
  if (from === 'kilometer per liter' && to === 'miles per gallon') {
    return value * 2.352;
  } else if (
    from === 'kilometer per liter' &&
    to === 'liter per 100 kilometer'
  ) {
    return 100 / value;
  } else if (
    from === 'kilometer per liter' &&
    to === 'miles per gallon (imperial)'
  ) {
    return value * 2.82481;
  } else if (from === 'miles per gallon' && to === 'kilometer per liter') {
    return value / 2.352;
  } else if (from === 'miles per gallon' && to === 'liter per 100 kilometer') {
    return 235.215 / value;
  } else if (
    from === 'miles per gallon' &&
    to === 'miles per gallon (imperial)'
  ) {
    return value / 1.201;
  } else if (
    from === 'liter per 100 kilometer' &&
    to === 'kilometer per liter'
  ) {
    return 100 / value;
  } else if (from === 'liter per 100 kilometer' && to === 'miles per gallon') {
    return 235.215 / value;
  } else if (
    from === 'liter per 100 kilometer' &&
    to === 'miles per gallon (imperial)'
  ) {
    return 282.481 / (value / 100);
  } else if (
    from === 'miles per gallon (imperial)' &&
    to === 'miles per gallon'
  ) {
    return value / 1.201;
    return;
  } else if (
    from === 'miles per gallon (imperial)' &&
    to === 'kilometer per liter'
  ) {
    return value * 0.354006;
  } else if (
    from === 'miles per gallon (imperial)' &&
    to === 'miles per gallon'
  ) {
    return value;
  } else if (
    from === 'miles per gallon (imperial)' &&
    to === 'liter per 100 kilometer'
  ) {
    return 282.481 / value;
  }
};
export const planeAngleConversion = (from, to, value) => {
  // Convert everything to radians first, then to target unit
  const PI = Math.PI;
  let radians;
  
  // Convert from source unit to radians
  switch (from) {
    case 'radian':
    case 'rad':
      radians = value;
      break;
    case 'degree':
    case 'deg':
      radians = value * (PI / 180);
      break;
    case 'gradian':
    case 'grad':
      radians = value * (PI / 200);
      break;
    case 'milliradian':
    case 'mrad':
      radians = value / 1000;
      break;
    case 'minuteOfArc':
    case 'minute of arc':
    case 'arcmin':
    case "'":
      radians = value * (PI / (180 * 60));
      break;
    case 'secondOfArc':
    case 'second of arc':
    case 'arcsec':
    case '"':
      radians = value * (PI / (180 * 3600));
      break;
    case 'turn':
    case 'revolution':
    case 'rev':
      radians = value * (2 * PI);
      break;
    case 'quadrant':
      radians = value * (PI / 2);
      break;
    case 'sextant':
      radians = value * (PI / 3);
      break;
    case 'octant':
      radians = value * (PI / 4);
      break;
    default:
      return undefined;
  }
  
  // Convert from radians to target unit
  switch (to) {
    case 'radian':
    case 'rad':
      return radians;
    case 'degree':
    case 'deg':
      return radians * (180 / PI);
    case 'gradian':
    case 'grad':
      return radians * (200 / PI);
    case 'milliradian':
    case 'mrad':
      return radians * 1000;
    case 'minuteOfArc':
    case 'minute of arc':
    case 'arcmin':
    case "'":
      return radians * (180 * 60 / PI);
    case 'secondOfArc':
    case 'second of arc':
    case 'arcsec':
    case '"':
      return radians * (180 * 3600 / PI);
    case 'turn':
    case 'revolution':
    case 'rev':
      return radians / (2 * PI);
    case 'quadrant':
      return radians / (PI / 2);
    case 'sextant':
      return radians / (PI / 3);
    case 'octant':
      return radians / (PI / 4);
    default:
      return undefined;
  }
};
