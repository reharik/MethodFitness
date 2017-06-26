// /**
//  * Created by johnteague on 10/28/16.
//  */
// if (!Object.values) {
//   require('object.values'); // eslint-disable-line
// }
//
// class EnumSymbol {
//   constructor (name, { value, description }) {
//     if (!name) throw new Error('cannot create Enum Type without a name');
//
//     this.name = name;
//     if (!Object.is(value, undefined)) this.value = value;
//
//     if (description) {
//       this.description = description;
//     } else {
//       this.description = name;
//     }
//   }
//
//   get display () {
//     return this.description || this.name;
//   }
//
//   toString () {
//     return this.name;
//   }
//   toJSON () {
//     return {
//       name: this.name,
//       value: this.value,
//       description: this.description,
//     };
//   }
//
//   // toJSON () {
//   //   return JSON.stringify({
//   //     name: this.name,
//   //     description: this.description,
//   //   });
//   // }
//
//   valueOf () {
//     return this.value;
//   }
//   equals (otherEnum) {
//     return this.value === otherEnum.value;
//   }
// }
//
// /* eslint-disable no-param-reassign */
// class Enum {
//   constructor (name, ...items) {
//     this.all = items;
//     items.forEach((item) => {
//       item.is = other => Enum.isSame(item, other);
//       const propertyAttrs = { configurable: false, enumerable: true, writable: false, value: item };
//       Object.defineProperty(this, item.name, propertyAttrs);
//       // this[item.name] = item;
//
//       Object.freeze(item);
//     });
//     this.name = name;
//     Object.freeze(this);
//   }
//   descriptions () {
//     return this.all.map(k => this[k].description);
//   }
//   values () {
//     return this.all.map(k => this[k].valueOf());
//   }
//   names () {
//     return this.all.map(k => this[k].name);
//   }
//   fromValue (value) {
//     return this.all.find(item => item.value === value);
//   }
//   static isSame (a, b) {
//     return a.name === b.name;
//   }
//   findByName (name) {
//     const key = Object.keys(this).find(e => e.toLowerCase() === name.toLowerCase());
//     if (key) return this[key];
//     return undefined;
//   }
//   toArray () {
//     return this.all;
//   }
// }
// module.exports = {
//   Enum,
//   EnumSymbol,
// };
