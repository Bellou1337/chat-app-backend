import { UserFilters } from 'src/shared/interfaces/user-filters.interface';

function isPairMatch(a: UserFilters, b: UserFilters): boolean {
  const genderMatch =
    (a.partnerGender === 'any' || b.yourGender === a.partnerGender) &&
    (b.partnerGender === 'any' || a.yourGender === b.partnerGender);

  const ageMatch = a.partnerAge === b.yourAge && b.partnerAge === a.yourAge;

  const topicMatch = a.topic === b.topic;

  return genderMatch && ageMatch && topicMatch;
}

export function isMatch(a: UserFilters, b: UserFilters): boolean {
  return isPairMatch(a, b) || isPairMatch(b, a);
}
