import { createLoader, parseAsInteger, parseAsStringEnum } from 'nuqs/server'


export const homeSearchParams = {
    page: parseAsInteger.withDefault(1),
    status: parseAsStringEnum(["all", "active", "inactive"]),
    sortBY: parseAsStringEnum(["name", "createdAt", "startAt", "endAt"]),
    sortDir: parseAsStringEnum(["asc", "desc"]),
}


export const loadSearchParams = createLoader(homeSearchParams)