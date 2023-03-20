export const massConversion = (from, to, value) => {
  if (from === "gram" && to === "kilogram") {
    return value / 1000;
  } else if (from === "gram" && to === "milligram") {
    return value * 1000;
  } else if (from === "gram" && to === "pounds") {
    return value / 453.6;
  } else if (from === "kilogram" && to === "gram") {
    return value * 1000;
  } else if (from === "kilogram" && to === "milligram") {
    return value * 1000000;
  } else if (from === "kilogram" && to === "pounds") {
    return value * 2.205;
  } else if (from === "pounds" && to === "gram") {
    return value * 453.6;
  } else if (from === "pounds" && to === "kilogram") {
    return value / 2.205;
  } else if (from === "pounds" && to === "milligram") {
    return value * 453600;
  } else if (from === "milligram" && to === "kilogram") {
    return value / 1000000;
  } else if (from === "milligram" && to === "pounds") {
    return value / 453600;
  } else if (from === "milligram" && to === "gram") {
    return value / 1000;
  }
};
export const volumeConversion = (from, to, value) => {
  if (from === "cubic meter" && to === "liter") {
    return value * 1000;
  } else if (from === "cubic meter" && to === "milliliter") {
    return value * 1000000;
  } else if (from === "cubic meter" && to === "cubic foot") {
    return value * 35.315;
  } else if (from === "cubic meter" && to === "gallon") {
    return value * 264.3;
  } else if (from === "liter" && to === "milliliter") {
    return value * 1000;
  } else if (from === "liter" && to === "cubic meter") {
    return value / 1000;
  } else if (from === "liter" && to === "cubic foot") {
    return value / 28.317;
  } else if (from === "liter" && to === "gallon") {
    return value / 3.785;
  } else if (from === "milliliter" && to === "liter") {
    return value / 1000;
  } else if (from === "milliliter" && to === "cubic meter") {
    return value / 1000000;
  } else if (from === "milliliter" && to === "cubic foot") {
    return value * 0.000035315;
  } else if (from === "milliliter" && to === "gallon") {
    return value / 3785;
  } else if (from === "gallon" && to === "cubic meter") {
    return value / 264.2;
  } else if (from === "gallon" && to === "liter") {
    return value * 3.785;
  } else if (from === "gallon" && to === "milliliter") {
    return value * 3785;
  } else if (from === "gallon" && to === "cubic foot") {
    return value / 7.48;
  } else if (from === "cubic foot" && to === "cubic meter") {
    return value / 35.315;
  } else if (from === "cubic foot" && to === "liter") {
    return value * 28.317;
  } else if (from === "cubic foot" && to === "milliliter") {
    return value * 28320;
  } else if (from === "cubic foot" && to === "gallon") {
    return value * 7.48;
  }
};
export const areaConversion = (from, to, value) => {
  if (from === "acre" && to === "kilometer") {
    return value / 247.1;
  } else if (from === "acre" && to === "meter") {
    return value * 4047;
  } else if (from === "acre" && to === "foot") {
    return value * 43560;
  } else if (from === "acre" && to === "mile") {
    return value / 640;
  } else if (from === "acre" && to === "yard") {
    return value * 4840;
  } else if (from === "kilometer" && to === "mile") {
    return value / 2.59;
  } else if (from === "kilometer" && to === "meter") {
    return value * 1000;
  } else if (from === "kilometer" && to === "foot") {
    return value * 3281;
  } else if (from === "kilometer" && to === "yard") {
    return value * 1094;
  } else if (from === "kilometer" && to === "acre") {
    return value * 247.1;
  } else if (from === "mile" && to === "kilometer") {
    return value * 2.59;
  } else if (from === "mile" && to === "meter") {
    return value * 1609.34;
  } else if (from === "mile" && to === "foot") {
    return value * 5280;
  } else if (from === "mile" && to === "yard") {
    return value * 1760;
  } else if (from === "mile" && to === "acre") {
    return value * 640;
  } else if (from === "meter" && to === "kilometer") {
    return value / 1000;
  } else if (from === "meter" && to === "mile") {
    return value / 1609;
  } else if (from === "meter" && to === "foot") {
    return value * 3.281;
  } else if (from === "meter" && to === "acre") {
    return value / 4047;
  } else if (from === "meter" && to === "yard") {
    return value * 1.196;
  } else if (from === "foot" && to === "kilometer") {
    return value / 3281;
  } else if (from === "foot" && to === "meter") {
    return value / 3.281;
  } else if (from === "foot" && to === "mile") {
    return value / 5280;
  } else if (from === "foot" && to === "yard") {
    return value / 3;
  } else if (from === "foot" && to === "acre") {
    return value / 43560;
  } else if (from === "yard" && to === "acre") {
    return value / 4840;
  } else if (from === "yard" && to === "kilometer") {
    return value / 1094;
  } else if (from === "yard" && to === "meter") {
    return value / 1.094;
  } else if (from === "yard" && to === "mile") {
    return value / 1760;
  } else if (from === "yard" && to === "foot") {
    return value * 1760;
  }
};

export const bitByteConversion = (from, to, value) => {
  if (from === "bit" && to === "byte") {
    return value / 8;
  } else if (from === "byte" && to === "bit") {
    return value * 8;
  }
};
export const powerConversion = (from, to, value) => {
  if (from === "watt" && to === "kilowatt") {
    return value / 1000;
  } else if (from === "watt" && to === "megawatt") {
    return value / 1000000;
  } else if (from === "kilowatt" && to === "watt") {
    return value * 1000;
  } else if (from === "kilowatt" && to === "megawatt") {
    return value / 1000;
  } else if (from === "megawatt" && to === "watt") {
    return value * 1000000;
  } else if (from === "megawatt" && to === "kilowatt") {
    return value * 1000;
  }
};
export const timeConversion = (from, to, value) => {
  if (from === "hour" && to === "minute") {
    return value * 60;
  } else if (from === "hour" && to === "second") {
    return value * 3600;
  } else if (from === "minute" && to === "hour") {
    return value / 60;
  } else if (from === "minute" && to === "second") {
    return value * 60;
  } else if (from === "second" && to === "minute") {
    return value / 60;
  } else if (from === "second" && to === "hour") {
    return value / 3600;
  }
};
export const temperatureConversion = (from, to, value) => {
  if (from === "celcius" && to === "farenheit") {
    return (value * 9) / 5 + 32;
  } else if (from === "celcius" && to === "kelvin") {
    return value + 273.15;
  } else if(from ==="celcius" && to==="rankine"){
    return (value*(9/5)+491.67);
  } else if (from === "farenheit" && to === "celcius") {
    return ((value - 32) * 5) / 9;
  } else if (from === "farenheit" && to === "kelvin") {
    return ((value - 32) * 5) / 9 + 273.15;
  } else if(from==="farenheit" && to==="rankine"){
    return value+459.67
  } else if (from === "kelvin" && to === "celcius") {
    return value - 273.15;
  } else if (from === "kelvin" && to === "farenheit") {
    return ((value - 273.15) * 9) / 5 + 32;
  } else if(from==="kelvin" && to==="rankine"){
    return value+459.67;
  } else if(from==="rankine" && to==="farenheit"){
    return value - 459.67;
  } else if(from==="rankine" && to==="celcius"){
    return (value-491.67)*(5/9)
  } else if(from==="rankine" && to==="kelvin"){
    return value-(5/9)
  }
};
export const presurreConversion = (from, to, value) => {
  if (from === "atm" && to === "bar") {
    return value * 1.013;
  } else if (from === "atm" && to === "pascal") {
    return value * 101325;
  } else if (from === "atm" && to === "torr") {
    return value * 760;
  } else if (from === "atm" && to === "ppsi") {
    return value * 14.696;
  } else if (from === "bar" && to === "ppsi") {
    return value * 14.504;
  } else if (from === "bar" && to === "pascal") {
    return value * 100000;
  } else if (from === "bar" && to === "atm") {
    return value / 1.013;
  } else if (from === "bar" && to === "torr") {
    return value * 750.1;
  } else if (from === "pascal" && to === "bar") {
    return value / 100000;
  } else if (from === "pascal" && to === "ppsi") {
    return value / 6895;
  } else if (from === "pascal" && to === "atm") {
    return value / 101300;
  } else if (from === "pascal" && to === "torr") {
    return value / 133.3;
  } else if (from === "ppsi" && to === "torr") {
    return value * 51.715;
  } else if (from === "ppsi" && to === "bar") {
    return value / 14.504;
  } else if (from === "ppsi" && to === "pascal") {
    return value * 6895;
  } else if (from === "ppsi" && to === "atm") {
    return value / 14.696;
  } else if (from === "torr" && to === "atm") {
    return value / 760;
  } else if (from === "torr" && to === "pascal") {
    return value * 133.3;
  } else if (from === "torr" && to === "ppsi") {
    return value / 51.715;
  } else if (from === "torr" && to === "bar") {
    return value / 750.1;
  }
};
export const lengthConversion = (from, to, value) => {
  if (from === "centimeter" && to === "meter") {
    return value / 1000;
  } else if (from === "centimeter" && to === "millimeter") {
    return value * 10;
  } else if (from === "centimeter" && to === "kilometer") {
    return value / 100000;
  } else if (from === "centimeter" && to === "inch") {
    return value / 2.54;
  } else if (from === "meter" && to === "inch") {
    return value * 39.37;
  } else if (from === "meter" && to === "centimeter") {
    return value * 100;
  } else if (from === "meter" && to === "millimeter") {
    return value * 1000;
  } else if (from === "meter" && to === "kilometer") {
    return value / 1000;
  } else if (from === "inch" && to === "meter") {
    return value / 39.37;
  } else if (from === "inch" && to === "millimeter") {
    return value * 25.4;
  } else if (from === "inch" && to === "centimeter") {
    return value * 2.54;
  } else if (from === "inch" && to === "kilometer") {
    return value / 39370;
  } else if (from === "kilometer" && to === "meter") {
    return value * 1000;
  } else if (from === "kilometer" && to === "millimeter") {
    return value * 1000000;
  } else if (from === "kilometer" && to === "inch") {
    return value * 39370;
  } else if (from === "kilometer" && to === "centimeter") {
    return value * 100000;
  } else if (from === "millimeter" && to === "centimeter") {
    return value / 10;
  } else if (from === "millimeter" && to === "meter") {
    return value / 1000;
  } else if (from === "millimeter" && to === "inch") {
    return value / 25.4;
  } else if (from === "millimeter" && to === "kilometer") {
    return value / 1000000;
  }
};
export const energyConversion = (from, to, value) => {
  if (from === "joule" && to === "kilojoule") {
    return value / 1000;
  } else if (from === "joule" && to === "kilocalorie") {
    return value / 4184;
  } else if (from === "joule" && to === "gramcalorie") {
    return value / 4.184;
  } else if (from === "joule" && to === "footpound") {
    return value / 1.356;
  } else if (from === "kilojoule" && to === "joule") {
    return value * 1000;
  } else if (from === "kilojoule" && to === "gramcalorie") {
    return value * 239;
  } else if (from === "kilojoule" && to === "kilocalorie") {
    return value / 4.184;
  } else if (from === "kilojoule" && to === "footpound") {
    return value * 737.6;
  } else if (from === "gramcalorie" && to === "joule") {
    return value * 4.184;
  } else if (from === "gramcalorie" && to === "kilocalorie") {
    return value / 1000;
  } else if (from === "gramcalorie" && to === "kilojoule") {
    return value / 239;
  } else if (from === "gramcalorie" && to === "footpound") {
    return value * 3.086;
  } else if (from === "footpound" && to === "joule") {
    return value * 1.356;
  } else if (from === "footpound" && to === "kilojoule") {
    return value / 737.6;
  } else if (from === "footpound" && to === "gramcalorie") {
    return value / 3.086;
  } else if (from === "footpound" && to === "kilocalorie") {
    return value / 3086;
  }
else if (from === "kilocalorie" && to === "joule") {
    return value * 4184;
  } else if (from === "kilocalorie" && to === "kilojoule") {
    return value * 4.184;
  }else if (from === "kilocalorie" && to === "gramcalorie") {
    return value * 1000;
  }else if (from === "kilocalorie" && to === "footpound") {
    return value * 3085.96;
  }
};
export const speedConversion = (from, to, value) => {
  if (from === "meter per second" && to === "kilometer per hour") {
    return value * 3.6;
  } else if (from === "meter per second" && to === "miles per hour") {
    return value * 2.237;
  } else if (from === "meter per second" && to === "foot per second") {
    return value * 3.281;
  } else if (from === "miles per hour" && to === "meter per second") {
    return value / 2.237;
  } else if (from === "miles per hour" && to === "kilometer per hour") {
    return value / 1.609;
  } else if (from === "miles per hour" && to === "foot per second") {
    return value / 1.467;
  } else if (from === "foot per second" && to === "meter per second") {
    return value / 3.281;
  } else if (from === "foot per second" && to === "miles per hour") {
    return value / 1.467;
  } else if (from === "foot per second" && to === "kilometer per hour") {
    return value * 1.097;
  } else if (from === "kilometer per hour" && to === "foot per second") {
    return value / 1.097;
  } else if (from === "kilometer per hour" && to === "miles per hour") {
    return value / 1.609;
  } else if (from === "kilometer per hour" && to === "meter per second") {
    return value / 3.6;
  }
};
export const fuelEconomyConversion = (from, to, value) => {
  if (from === "kilometer per liter" && to === "miles per gallon") {
    return value * 2.352;
  } else if (
    from === "kilometer per liter" &&
    to === "liter per 100 kilometer"
  ) {
    return 100 / value;
  } else if(from==="kilometer per liter" && to==="miles per gallon (imperial)"){
    return value * 2.82481;
  } else if (from === "miles per gallon" && to === "kilometer per liter") {
    return value / 2.352;
  } else if (from === "miles per gallon" && to === "liter per 100 kilometer") {
    return 235.215 / value;
  } else if(from==="miles per gallon" && to==="miles per gallon (imperial)"){
    return value / 1.201;
  } else if (
    from === "liter per 100 kilometer" &&
    to === "kilometer per liter"
  ) {
    return 100 / value;
  } else if (from === "liter per 100 kilometer" && to === "miles per gallon") {
    return 235.215 / value;
  } else if(from==="liter per 100 kilometer" && to==="miles per gallon (imperial)"){
    return (282.481/(value/100))
  } else if(from==="miles per gallon (imperial)" && to==="miles per gallon"){
    return value/1.201
    return 
  } else if(from==="miles per gallon (imperial)" && to==="kilometer per liter"){
    return value * 0.354006
  } else if(from==="miles per gallon (imperial)" && to==="miles per gallon"){
    return value
  } else if(from==="miles per gallon (imperial)" && to==="liter per 100 kilometer"){
    return 282.481/value;
  }
};
export const planeAngleConversion = (from, to, value) => {
  if (from === "degree" && to === "radian") {
    return (value * 3.14159) / 180;
  } else if(from==="degree" && to==="minute of arc"){
    return value*60
  } else if(from==="degree" && to==="milliradian"){
    return value * (1000*(3.14159/180));
  } else if (from === "degree" && to === "gradian") {
    return (value * 200) / 180;
  } else if(from==="degree" && to==="second of arc"){
    return value*3600
  } else if(from==="radian" && to==="second of arc"){
    return value*(3600*180)/3.14159
  } else if (from === "radian" && to === "degree") {
    return value * (180 / 3.14159);
  } else if(from==="radian" && to==="milliradian"){
    return value*1000;
  } else if (from === "radian" && to === "gradian") {
    return (value * 200) / 3.14159;
  } else if(from==="radian" && to==="minute of arc"){
    return (value * (60*180)/3.14159)
  } else if (from === "gradian" && to === "radian") {
    return (value * 3.14159) / 200;
  } else if(from==="gradian" && to==="second of arc"){
    return value*3240;
  } else if (from === "gradian" && to === "degree") {
    return (value * 180) / 200;
  } else if(from==="gradian" && to==="milliradian"){
    return value*(1000(3.14159/200));
  } else if(from==="gradian" && to==="minute of arc"){
    return value * 54;
  } else if(from==="milliradian" && to==="radian" ){
    return value/1000
  } else if(from==="milliradian" && to==="gradian" ){
   return  value * (200/(100*3.14159))
  } else if(from==="milliradian" && to==="degree" ){
    return value*(180/(100*3.14159));
  } else if(from==="milliradian" && to==="minute of arc"){
    return value * (60*180)/(1000*3.14159)
  } else if(from==="milliradian" && to==="second of arc"){
    return value*(3600*180)/1000*3.14159
  } else if(from==="second of arc" && to==="degree"){
    return value/3600;
  } else if(from==="second of arc" && to==="gradian"){
    return value/3240;
  } else if(from==="second of arc" && to==="milliradian"){
    return value*(1000*3.14159)/(180*3600)
  } else if(from==="second of arc" && to==="minute of arc"){
    return value/60
  } else if(from==="second of arc" && to==="radian"){
    return value*(3.14159)/(180*3600)
  } else if(from==="second of arc" && to==="minute of arc"){
    return value/60;
  } else if(from==="minute of arc" && to==="second of arc"){
    return value*60
  } else if(from==="minute of arc" && to==="radian"){
    return value*3.14159/(60*180)
  } else if(from==="minute of arc" && to==="milliradian"){
    return value*1000*3.14159/(60*180)
  } else if(from==="minute of arc" && to==="gradian"){
    return value/54
  } else if(from==="minute of arc" && to==="degree"){
    return value/60;
  }
};
