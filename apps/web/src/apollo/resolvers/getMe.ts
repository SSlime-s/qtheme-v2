import type { ContextValue } from ".";
import type { QueryResolvers } from "../generated/resolvers";

export const getMe: QueryResolvers<ContextValue>["getMe"] = async (
	_,
	__,
	{ userId },
) => {
	return userId === undefined ? null : userId;
};
