import { DefaultValuePipe, ParseIntPipe, Query } from "@nestjs/common";
import {
  BANNER_LIST_DEFAULT_LIMIT,
  BANNER_LIST_DEFAULT_OFFSET,
} from "./banners.constants";

export const QUERY_OFFSET = "offset" as const;
export const QUERY_LIMIT = "limit" as const;

export const QueryBannerOffset = () =>
  Query(
    QUERY_OFFSET,
    new DefaultValuePipe(BANNER_LIST_DEFAULT_OFFSET),
    ParseIntPipe,
  );

export const QueryBannerLimit = () =>
  Query(
    QUERY_LIMIT,
    new DefaultValuePipe(BANNER_LIST_DEFAULT_LIMIT),
    ParseIntPipe,
  );
