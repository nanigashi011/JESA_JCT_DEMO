import { FC } from "react";
import { usePageData } from "../../../core/PageData";

const DefaultTitle: FC = () => {
	const { pageTitle } = usePageData();
	return (
		<div className="d-flex align-items-center">
			{/* begin::Sidebar toggle */}
			<div
				id="kt_app_sidebar_toggle"
				className="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary sidbadr-toggle h-30px w-30px active"
				data-kt-toggle="true"
				data-kt-toggle-state="active"
				data-kt-toggle-target="body"
				data-kt-toggle-name="app-sidebar-minimize"
			>
				<i className="ki-duotone ki-toggle-on-circle fs-1 me-5 rotate-180">
					<span className="path1"></span>
					<span className="path2"></span>
				</i>
			</div>
			{/* end::Sidebar toggle */}

			{/* begin::Sidebar mobile toggle */}
			<div className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2" title="Show sidebar menu">
				<div
					className="btn btn-icon btn-active-color-primary w-35px h-35px"
					id="kt_app_sidebar_mobile_toggle"
				>
					<i className="ki-outline ki-text-align-left fs-2 fs-md-1"></i>
				</div>
			</div>
			{/* end::Sidebar mobile toggle */}

			{/* begin::Title */}
			<h1 className="page-heading d-flex text-gray-900 fw-bold align-items-center fs-3 my-0">
				<span>{pageTitle || 'Landing Page'}</span>
			</h1>
			{/* end::Title */}
		</div>
	);
};

export { DefaultTitle };
