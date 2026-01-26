import { FC, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Toolbar } from "./components/toolbar/Toolbar";
import { ScrollTop } from "./components/ScrollTop";
import { Content } from "./components/Content";
import { AsideDefault } from "./components/aside/AsideDefault";
import { PageDataProvider, useLayout } from "./core";
import {
	themeModeSwitchHelper,
	useThemeMode,
} from "../partials/layout/theme-mode/ThemeModeProvider";
import { MenuComponent } from "../assets/ts/components";
import clsx from "clsx";
import { WithChildren } from "../helpers";

const MasterLayout: FC<WithChildren> = ({ children }) => {
	const { classes } = useLayout();
	const { mode } = useThemeMode();
	const location = useLocation();

	useEffect(() => {
		setTimeout(() => {
			MenuComponent.reinitialization();
		}, 500);
	}, [location.key]);

	useEffect(() => {
		themeModeSwitchHelper(mode);
		
		// Add app-sidebar layout classes to body
		document.body.setAttribute('data-kt-app-layout', 'dark-sidebar');
		document.body.setAttribute('data-kt-app-sidebar-enabled', 'true');
		document.body.setAttribute('data-kt-app-sidebar-fixed', 'true');
		document.body.setAttribute('data-kt-app-sidebar-hoverable', 'false');
		document.body.classList.add('app-default');
	}, [mode]);

	return (
		<PageDataProvider>
			<div className="d-flex flex-column flex-root app-root" id="kt_app_root">
				<div className="app-page flex-column flex-column-fluid" id="kt_app_page">
					<AsideDefault />
					<div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
						
						<div
							id="kt_app_content"
							className="app-content flex-column-fluid"
						>
							<Toolbar />
							<div
								className={clsx(
									"app-container"
								)}
								id="kt_app_content_container"
							>
								<Content>
									<Outlet />
								</Content>
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</div>
			<ScrollTop />
		</PageDataProvider>
	);
};

export { MasterLayout };
