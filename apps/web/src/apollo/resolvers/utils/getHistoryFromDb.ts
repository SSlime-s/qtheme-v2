import type { Version } from "@/apollo/generated/resolvers";
import type { PrismaClient } from "@repo/database";

interface IHistory extends Version {
  id: string;
  themeId: string;
  version: string;
  theme: string;
  createdAt: Date;
}
interface HistoryRow {
  id: string;
  theme_id: string;
  version: string;
  theme: string;
  created_at: Date;
}

const convertRowToI = (history: HistoryRow): IHistory => {
  const { theme_id, created_at, ...restHistory } = history;

  return {
    ...restHistory,
    themeId: theme_id,
    createdAt: created_at,
  };
};

/**
 * **WARNING**: この関数では閲覧権限の確認は行わない
 */

export const getHistoryFromDb = async (
  prisma: Pick<PrismaClient, "theme_versions">,
  id: string,
) => {
  try {
    const history = await prisma.theme_versions.findMany({
      select: {
        id: true,
        theme_id: true,
        version: true,
        theme: true,
        created_at: true,
      },
      where: {
        theme_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return history.map(convertRowToI) satisfies IHistory[];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * **WARNING**: この関数では閲覧権限の確認は行わない
 */
export const getLatestHistoryFromDb = async (
  prisma: Pick<PrismaClient, "theme_versions">,
  id: string,
) => {
  try {
    const history = await prisma.theme_versions.findFirst({
      select: {
        id: true,
        theme_id: true,
        version: true,
        theme: true,
        created_at: true,
      },
      where: {
        theme_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (history === null) {
      return null;
    }
    return convertRowToI(history);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
