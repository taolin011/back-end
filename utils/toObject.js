const Faker = require("./Faker");



module.exports = function toObject(tree) {

  let obj = {};

  tree.forEach((item) => {

    if (item.attr) {

      if (item.attrValue) {

        if (item.typeValue === "string") obj[item.attr] = item.attrValue;

        else if (item.typeValue === "number")

          obj[item.attr] = Number(item.attrValue);

        else if (item.typeValue === "boolean")

          obj[item.attr] = Boolean(item.attrValue);

        else if (item.typeValue === "array")

          obj[item.attr] = item.attrValue.split(",");

      } else if (item.typeValue === "object" && item.children.length > 0)

        obj[item.attr] = toObject(item.children);

      else if (item.mock) {

        const func = item.mock.slice(1);

        obj[item.attr] = Faker[func]();

      } 

    }

  });

  return obj;

}



