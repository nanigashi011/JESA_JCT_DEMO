import { createRoot } from "react-dom/client";
// Axios
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Apps
import { MetronicI18nProvider } from "./_metronic/i18n/Metronici18n";

// Performance optimizations: preload 3D viewer resources immediately on app startup
// These run in parallel without blocking the initial render
import { preloadToken } from "./app/pages/reality/3d/services/api";
import { preloadViewerSDK } from "./app/pages/reality/3d/services/viewerLoader";

// 1. Preload authentication token (eliminates 200-500ms delay when viewer initializes)
preloadToken();

// 2. Preload Autodesk Viewer SDK (~2MB) in the background
// This starts downloading while user navigates to the 3D viewer page
preloadViewerSDK();
// import "./_metronic/assets/sass/style.react.scss";
// import "./_metronic/assets/fonticon/fonticon.css";
// import "./_metronic/assets/keenicons/duotone/style.css";
// import "./_metronic/assets/keenicons/outline/style.css";
// import "./_metronic/assets/keenicons/solid/style.css";
// import "./_metronic/assets/sass/jesa.scss";
// /**
//  * TIP: Replace this style import with rtl styles to enable rtl mode
//  *
//  * import './_metronic/assets/css/style.rtl.css'
//  **/
// import "./_metronic/assets/sass/style.scss";
// import "./_metronic/assets/sass/plugins.scss";
import { AppRoutes } from "./app/routing/AppRoutes";
import { AuthProvider, setupAxios } from "./app/modules/auth";
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */

setupAxios(axios);
Chart.register(...registerables);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});
const container = document.getElementById("root");
if (container) {
	createRoot(container).render(
		<QueryClientProvider client={queryClient}>
			<MetronicI18nProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</MetronicI18nProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}
