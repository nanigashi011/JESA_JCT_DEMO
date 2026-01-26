import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { ThemeModeProvider } from "../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import { UserWidgetsProvider } from "./pages/home/hooks/useUserWidgets";

import "../_metronic/assets/sass/style.react.scss";
import "../_metronic/assets/sass/style.react.scss";
import "../_metronic/assets/keenicons/duotone/style.css";
import "../_metronic/assets/keenicons/outline/style.css";
import "../_metronic/assets/keenicons/solid/style.css";
import "../_metronic/assets/sass/jesa.scss";
import "../_metronic/assets/sass/style.scss";
import "../_metronic/assets/sass/plugins.scss";

const App = () => {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<I18nProvider>
				<LayoutProvider>
					<ThemeModeProvider>
						<UserWidgetsProvider>
							<Outlet />
							<MasterInit />
						</UserWidgetsProvider>
					</ThemeModeProvider>
				</LayoutProvider>
			</I18nProvider>
		</Suspense>
	);
};

export { App };
