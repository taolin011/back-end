const { faker } = require('@faker-js/faker/locale/zh_CN');

class Faker {
  static cname = faker.person.fullName
  static image = faker.image.url
  static int = faker.number.int
  static float = faker.number.float
  static phone = faker.phone.number
  static sentence = faker.lorem.sentences
  static paragraph = faker.lorem.paragraphs
  static date = faker.date.anytime
  static email = faker.internet.email
}

module.exports = Faker



