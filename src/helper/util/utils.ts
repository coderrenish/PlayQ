// Utilities for Test Automation

function toCamelCase(input: string): string {
  // Remove all non-alphanumeric characters except spaces
  const cleaned = input.replace(/[^a-zA-Z0-9 ]/g, " ");

  // Split by whitespace, lowercase first word, capitalize others
  const words = cleaned.trim().split(/\s+/);

  if (words.length === 0) return "";

  let camelCase =
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");

  // Ensure it doesn't start with a digit
  if (/^[0-9]/.test(camelCase)) {
    camelCase = "_" + camelCase;
  }

  return camelCase;
}

/**
 * Function to generate a random NRIC number
 * @param prefix - Optional prefix (S, T, F, G)
 * @param year - Optional year of birth (default: random year between 1960 and 2019)
 * @param isForeigner - Optional boolean indicating if the NRIC is for a foreigner (default: false)
 * @returns
 * @example generateNRIC('S', 1985, false) // "S8512345A"
 *  */
function generateNRIC(
  prefix?: "S" | "T" | "F" | "G",
  year?: number,
  isForeigner?: boolean
): string {
  const randomYear = Math.floor(Math.random() * 60) + 1960;
  const resolvedYear = year ?? randomYear;
  const resolvedIsForeigner = isForeigner ?? false;

  let resolvedPrefix = prefix;
  if (!resolvedPrefix) {
    resolvedPrefix = resolvedIsForeigner
      ? resolvedYear >= 2000
        ? "G"
        : "F"
      : resolvedYear >= 2000
      ? "T"
      : "S";
  }

  const validPrefix =
    (!resolvedIsForeigner &&
      (resolvedPrefix === "S" || resolvedPrefix === "T")) ||
    (resolvedIsForeigner && (resolvedPrefix === "F" || resolvedPrefix === "G"));

  if (!validPrefix) {
    throw new Error(
      `❌ Invalid prefix "${resolvedPrefix}" for isForeigner=${resolvedIsForeigner}. Use S/T for citizens and F/G for foreigners.`
    );
  }

  const yearDigits = String(resolvedYear % 100).padStart(2, "0");
  const remainingDigits = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 10)
  );
  const fullDigits = [...yearDigits.split("").map(Number), ...remainingDigits];
  const weights = [2, 7, 6, 5, 4, 3, 2];

  let sum = fullDigits.reduce(
    (acc, digit, idx) => acc + digit * weights[idx],
    0
  );

  if (resolvedPrefix === "T" || resolvedPrefix === "G") {
    sum += 4;
  }

  const checksumChars: Record<string, string[]> = {
    S: ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"],
    T: ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"],
    F: ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"],
    G: ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"],
  };

  const remainder = sum % 11;
  const checksum = checksumChars[resolvedPrefix][remainder];

  return `${resolvedPrefix}${fullDigits.join("")}${checksum}`;
}

/**
    Function to extract the year from an NRIC number
    @param nric - The NRIC number as a string
    @returns The year of birth as a number, or null if the NRIC is invalid
 */
function getYearFromNRIC(nric: string): number | null {
  if (!/^[STFG]\d{7}[A-Z]$/.test(nric)) {
    console.warn(`❌ Invalid NRIC format: ${nric}`);
    return null;
  }

  const prefix = nric.charAt(0).toUpperCase();
  const yearDigits = parseInt(nric.slice(1, 3), 10);

  if (isNaN(yearDigits)) return null;

  switch (prefix) {
    case "S": // Born before 2000 (Singaporean)
    case "F": // Foreigner before 2000
      return 1900 + yearDigits;

    case "T": // Born in or after 2000 (Singaporean)
    case "G": // Foreigner in or after 2000
      return 2000 + yearDigits;

    default:
      return null;
  }
}

export { toCamelCase, generateNRIC, getYearFromNRIC };
