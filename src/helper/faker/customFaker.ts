// src/helper/faker/customFaker.ts
import { faker as baseFaker } from '@faker-js/faker';
import { generatePassportNumber } from './modules/passport';
import { generateMobileNumber } from './modules/mobile';
import { getValidPostCode } from './modules/postcode';
import { generatePersonFullName } from './modules/person';

// (baseFaker as any).passport = {
//   number: generatePassportNumber,
// };

// (baseFaker as any).mobile = {
//   number: generateMobileNumber,
// };

// (baseFaker as any).postcode = {
//   valid: {
//     get: getValidPostCode
//   }, 
// };

(baseFaker as any).custom = {
  passport: generatePassportNumber,
  mobile: {
    number: generateMobileNumber
  },
  postcode: {
    get: getValidPostCode
  },
  person: {
    fullName: generatePersonFullName
  }
};

export const faker = baseFaker as typeof baseFaker & {
  custom: {
    passport: (options?: {countryCode?: string}) => string;

    mobile: {
      number: (options?: {countryCode?: string, dialCodePrefix?: boolean}) => string;
    } 
    postcode: {
      get: (countryCode?: string,stateCode?: string) => string;
    };
    person: {
      fullName: (maxLength?: number, excludeChars?: string[]) => string;
    };
  };
  // mobile: {
  //   number: (countryCode?: string, withCountryCode?: boolean) => string;
  // };

  // postcode: {
  //   valid: {
  //     get: (countryCode?: string,stateCode?: string) => string;
  //   };
  // };
};


// // src/helper/faker/customFaker.ts
// import { faker as baseFaker } from '@faker-js/faker';
// import { generatePassportNumber } from './modules/passport';
// import { generateMobileNumber } from './modules/mobile';


// (baseFaker as any).passport = {
//   number: generatePassportNumber
// };

// export const faker = baseFaker as typeof baseFaker & {
//   passport: {
//     number: (countryCode?: string) => string;
//   };
// };