import { faker } from '@faker-js/faker';

// export function getValidPostCode(countryCode: string = "AU", stateCode?: string): string {

// export function generatePersonFullName(maxLength: number, excludeChars?: string[]): string {

export function generatePersonFullName(maxLength?: number, excludeChars?: string[]): string {
  let name: string;
  maxLength = maxLength ?? Infinity;
  excludeChars = excludeChars ?? [];

  do {
    name = faker.person.fullName();
  } while (
    name.length > maxLength ||
    excludeChars.some(char => name.includes(char))
  );
  return name;
}
