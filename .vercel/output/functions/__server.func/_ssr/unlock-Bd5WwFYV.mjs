import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as unlockWithPasscode, n as Route, s as setPasscode } from "./router-0FfQY5pb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unlock-Bd5WwFYV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UnlockForm({ initial }) {
	const navigate = useNavigate();
	const setting = !initial.hasPasscode;
	const [passcode, setPasscodeValue] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (setting && passcode !== confirm) {
			setError("The two passcodes do not match.");
			return;
		}
		setPending(true);
		try {
			if (setting) await setPasscode({ data: { passcode } });
			else await unlockWithPasscode({ data: { passcode } });
			await navigate({ to: "/" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not unlock.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs tracking-wide text-muted",
					children: "full-stack-skill-roadmap-en.md"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-2 text-xl font-medium tracking-tight",
					children: "Skill Roadmap"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-8 max-w-prose text-sm leading-normal text-muted",
					children: setting ? "Choose a passcode for this checklist. You will enter it on later visits. Unlock lasts seven days in this browser." : "Enter the passcode to open the checklist. Unlock lasts seven days in this browser."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void onSubmit(e),
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: setting ? "New passcode" : "Passcode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								name: "passcode",
								autoComplete: setting ? "new-password" : "current-password",
								value: passcode,
								onChange: (e) => setPasscodeValue(e.target.value),
								minLength: 4,
								required: true,
								className: "min-h-11 border border-rule bg-bg px-3 text-fg"
							})]
						}),
						setting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Confirm passcode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								name: "confirm",
								autoComplete: "new-password",
								value: confirm,
								onChange: (e) => setConfirm(e.target.value),
								minLength: 4,
								required: true,
								className: "min-h-11 border border-rule bg-bg px-3 text-fg"
							})]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending,
							className: "min-h-11 border border-fg bg-fg px-4 text-sm text-bg hover:opacity-90 disabled:opacity-50",
							children: pending ? "Working…" : setting ? "Set passcode" : "Unlock"
						})
					]
				})
			]
		})
	});
}
function UnlockPage() {
	const state = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnlockForm, { initial: state });
}
//#endregion
export { UnlockPage as component };
