import { UserFilters } from 'src/shared/interfaces/user-filters.interface';

export function isMatch(clientFilters: UserFilters, partnerFilters: UserFilters): boolean {
  return (
    clientFilters.partnerGender === partnerFilters.yourGender &&
    clientFilters.yourGender === partnerFilters.partnerGender &&
    clientFilters.partnerAge === partnerFilters.yourAge &&
    clientFilters.yourAge === partnerFilters.partnerAge &&
    clientFilters.topic === partnerFilters.topic
  );
}
