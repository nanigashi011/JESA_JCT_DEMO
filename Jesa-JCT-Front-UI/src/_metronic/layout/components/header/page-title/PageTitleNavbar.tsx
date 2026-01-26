import { FC } from "react";
import { toAbsoluteUrl } from "../../../../helpers";
import { useAuth } from "@/app/modules/auth";
import {
	HeaderNotificationsMenu,
	HeaderUserMenu,
} from "../../../../partials";

const PageTitleNavbar: FC = () => {
	const { currentUser, auth } = useAuth();

	return (
		<div className="app-navbar flex-shrink-0">
			{/* begin::Programs/SP2M */}
			<div className="app-navbar-item ms-1 ms-lg-5">
				<div
					className="btn btn-icon btn-active-color-primary border btn-color-gray-700 px-15 h-35px"
					data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
					data-kt-menu-attach="parent"
					data-kt-menu-placement="bottom"
				>
					<span className="fw-bold fs-4 text-gray-900">SP2M</span>
				</div>
				{/* Program dropdown menu can be added here */}
			</div>
			{/* end::Programs */}

			{/* begin::Search */}
			<div className="app-navbar-item ms-1 ms-lg-5">
				<div
					className="btn btn-icon btn-active-color-primary border btn-color-gray-700 w-35px h-35px"
					data-kt-search-element="toggle"
				>
					<i className="flaticon-search-1 text-gray-900 fs-1"></i>
				</div>
			</div>
			{/* end::Search */}

			{/* begin::Notifications */}
			<div className="app-navbar-item ms-1 ms-lg-5">
				<div
					className="btn btn-icon btn-active-color-primary border btn-color-gray-700 w-35px h-35px"
					data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
					data-kt-menu-attach="parent"
					data-kt-menu-placement="bottom"
				>
					<i className="flaticon-notification text-gray-900 fs-1"></i>
				</div>
				<HeaderNotificationsMenu />
			</div>
			{/* end::Notifications */}

			{/* begin::User menu */}
			<div className="app-navbar-item ms-3 ms-lg-5" id="kt_header_user_menu_toggle">
				<div
					className="btn btn-flex align-items-center bg-hover-white bg-hover-opacity-10 py-2 px-2 px-md-3"
					data-kt-menu-trigger="click"
					data-kt-menu-attach="parent"
					data-kt-menu-placement="bottom-end"
				>
					{/* begin::Symbol */}
					<div className="symbol symbol-35px">
						<img
							src={toAbsoluteUrl("media/avatars/ProfilePhoto.jpg.webp")}
							alt="user"
						/>
					</div>
					{/* end::Symbol */}
					{/* begin::Name */}
					<div className="d-none d-md-flex flex-column align-items-start justify-content-center ms-2 ms-md-4">
						<span className="text-gray-900 fs-6 fw-semibold lh-1 mb-1">
							{currentUser?.firstName} {currentUser?.lastName}
						</span>
						<span className="text-muted fs-7 fw-medium lh-1">
							{auth?.selectedRole}
						</span>
					</div>
					{/* end::Name */}
				</div>
				<HeaderUserMenu />
			</div>
			{/* end::User menu */}
		</div>
	);
};

export { PageTitleNavbar };
