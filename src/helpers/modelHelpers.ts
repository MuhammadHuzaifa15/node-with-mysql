import { getDataDictionary } from "./generalHelper";

interface IRecord {
  model: any;
  name: string;
  id: string;
  field: string;
}
// check if record exists
const ifNotExist = async (records: Array<IRecord>) => {
  for (const record of records) {
    const { model, id, name, field } = record;

    if (id) {
      if (Array.isArray(id)) {
        for (const elem of id) {
          if (
            typeof elem === "object" &&
            elem instanceof Object &&
            !Array.isArray(elem)
          ) {
            let exists = await model
              .findById(elem[field])
              .and({ isDeleted: false });
            if (!exists) {
              return name;
            }
          } else {
            let exists = await model.findById(elem).and({ isDeleted: false });
            if (!exists) {
              return name;
            }
          }
        }
      } else {
        let exists = await model.findById(id).and({ isDeleted: false });
        if (!exists) {
          return name;
        }
      }
    }
  }
};

// check if record is new
const ifExists = async (model: any, fields: any) => {
  for (const field in getDataDictionary(fields)) {
    let exists = await model.findOne().and([
      {
        [field]: { $exists: true },
      },
      { [field]: fields[field] },
      { isDeleted: false },
    ]);
    if (exists) {
      return field;
    }
  }
  return;
};

export { ifNotExist, ifExists };
