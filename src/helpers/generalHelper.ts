// capitalize string
const capitalize = (val: string): string =>
  val.charAt(0).toUpperCase() + val.slice(1);

// Sort By most recent
const sortByDate = (array: Array<any>, dateField: string): Array<any> =>
  array.sort((a, b) => {
    a = new Date(a[dateField]);
    b = new Date(b[dateField]);
    return a > b ? -1 : a < b ? 1 : 0;
  });

const generateId = (): string => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const getDataDictionary = (data: any) => {
  let dataDictionary = {};

  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      dataDictionary = { ...dataDictionary, [key]: data[key] };
    }
  }

  return dataDictionary;
};

const convertDocToJSON = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};
export {
  capitalize,
  sortByDate,
  generateId,
  getDataDictionary,
  convertDocToJSON,
};
