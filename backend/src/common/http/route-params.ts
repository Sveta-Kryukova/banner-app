import { Param, ParseIntPipe } from "@nestjs/common";

export const ROUTE_PARAM_ID = "id" as const;

export const ParamId = () => Param(ROUTE_PARAM_ID, ParseIntPipe);
