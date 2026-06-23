
import { useQueryStates, parseAsInteger, parseAsStringEnum } from 'nuqs';

export default function useHomeParams() {
 const params = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      status: parseAsStringEnum(["all", "active", "inactive"]).withDefault("all"),
      sortBY: parseAsStringEnum(["name", "createdAt", "startAt", "endAt"]).withDefault("createdAt"),
      sortDir: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    },
    {
      shallow: false,
      history: "replace",
    }
  );
  return params
}