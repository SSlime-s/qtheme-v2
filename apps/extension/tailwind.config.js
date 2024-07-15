const plugin = require("tailwindcss/plugin");

const glassMorphismPlugin = plugin(({ addUtilities }) => {
	const newUtilities = {
		".glass-morphism": {
			"backdrop-filter": "blur(10px)",
			background:
				"radial-gradient(ellipse at 0% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%)",
			border: "1px solid rgba(255, 255, 255, 0.5)",
			"box-shadow": "0 0 20px rgba(0, 0, 0, 0.25)",
		},
	};
	addUtilities(newUtilities, ["responsive", "hover"]);
});

const rainbowBorderPlugin = plugin(({ addUtilities }) => {
	const newUtilities = {
		".rainbow-border": {
			position: "relative",
			display: "inline-block",

			"&::before": {
				content: "''",
				position: "absolute",
				inset: "0",
				border: "2px solid transparent",
				backgroundImage:
					"linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%)",
				mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box",
				"-webkit-mask-composite": "destination-out",
				maskComposite: "exclude",
				// backgroundSize: "400%",
				borderRadius: "inherit",
			},
		},
	};
	addUtilities(newUtilities, ["responsive", "hover"]);
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	darkMode: "class",
	content: [
		"./**/*.tsx",
		"./**/*.ts",
		"./**/*.js",
		"./**/*.jsx",
		"./**/*.html",
	],
	theme: {
		extend: {},
	},
	plugins: [glassMorphismPlugin, rainbowBorderPlugin],
};
