/**
 * とりあえずは semver のマイナーバージョンを上げるだけ
 */
export const bumpVersion = (old?: string) => {
	if (old === undefined) {
		return "0.1.0";
	}

	const [major, minor, patch] = old.split(".").map(Number);
	if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
		return null;
	}
	return `${major}.${minor + 1}.${patch}`;
};
