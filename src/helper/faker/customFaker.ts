// src/helper/faker/customFaker.ts
import { faker as baseFaker } from '@faker-js/faker';
import { generatePassportNumber } from './modules/passport';

(baseFaker as any).passport = {
  number: generatePassportNumber
};

export const faker = baseFaker as typeof baseFaker & {
  passport: {
    number: (countryCode?: string) => string;
  };
};