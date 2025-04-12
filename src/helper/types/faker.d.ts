// types/faker.d.ts
import '@faker-js/faker';

declare module '@faker-js/faker' {
  interface Faker {
    passport: {
      number: (countryCode?: string) => string;
    };
  }
}