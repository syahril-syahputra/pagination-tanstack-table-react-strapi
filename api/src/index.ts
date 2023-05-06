import { faker } from "@faker-js/faker";
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    for (let i = 0; i < 100; i++) {
      await strapi.entityService.create("api::product.product", {
        data: {
          name: faker.vehicle.vehicle(),
          description: "Description example for " + faker.vehicle.vehicle(),
          price: faker.datatype.bigInt({ min: 1000, max: 10000 }),
          isActive: faker.datatype.boolean(),
        },
      });
    }
  },
};
