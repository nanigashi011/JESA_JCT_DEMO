import { FC } from "react";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  QuickLinks,
  ThemeModeSwitcher,
} from "../../../partials";
import { useAuth } from "@/app/modules/auth";

const toolbarButtonMarginClass = "ms-1 ms-lg-3",
  toolbarButtonHeightClass =
    "btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40p",
  toolbarUserAvatarHeightClass = "symbol-30px symbol-md-40px",
  toolbarButtonIconSizeClass = "fs-1";

const Topbar: FC = () => {
  const { currentUser, auth } = useAuth();

  return (
    <div className="d-flex align-items-stretch flex-shrink-0">
      <div className="topbar d-flex align-items-stretch flex-shrink-0">
        {/* begin::Project Selector */}
        <div className={clsx("d-flex align-items-center", toolbarButtonMarginClass)}>
          <div
            className="btn btn-icon btn-active-color-primary border btn-color-gray-700 px-15 h-35px"
            data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom"
          >
            <span className="fw-bold fs-4 text-gray-900">SP2M</span>
          </div>
        </div>
        {/* end::Project Selector */}

        {/* begin::Search */}
        <div className={clsx("d-flex align-items-center", toolbarButtonMarginClass)}>
          <div
            className={clsx(
              "btn btn-icon btn-active-light-primary btn-custom",
              toolbarButtonHeightClass
            )}
          >
            <KTIcon iconName="magnifier" iconType="outline" className={toolbarButtonIconSizeClass} />
          </div>
        </div>
        {/* end::Search */}

        {/* NOTIFICATIONS */}
        <div
          className={clsx(
            "d-flex align-items-center",
            toolbarButtonMarginClass
          )}
        >
          {/* begin::Menu wrapper */}
          <div
            className={clsx(
              "btn btn-icon btn-active-light-primary btn-custom position-relative",
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger="click"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="bottom"
          >
            <KTIcon
              iconName="notification-on"
              iconType="outline"
              className={toolbarButtonIconSizeClass}
            />
          </div>
          <HeaderNotificationsMenu />
          {/* end::Menu wrapper */}
        </div>

        {/* Quick links */}
        {/* <div
          className={clsx(
            "d-flex align-items-center",
            toolbarButtonMarginClass
          )}
        > */}
          {/* begin::Menu wrapper */}
          {/* <div
            className={clsx(
              "btn btn-icon btn-active-light-primary btn-custom",
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger="hover"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="bottom"
          >
            <KTIcon
              iconName="abstract-26"
              iconType="outline"
              className={toolbarButtonIconSizeClass}
            />
          </div> */}
          {/* <QuickLinks /> */}
          {/* end::Menu wrapper */}
        {/* </div> */}

        {/* begin::Theme mode */}
        {/* <div className={clsx("d-flex align-items-center", toolbarButtonMarginClass)}>
					<ThemeModeSwitcher toggleBtnClass={toolbarButtonHeightClass} />
				</div> */}
        {/* end::Theme mode */}

        {/* begin::User */}
        <div
          className={clsx(
            "d-flex align-items-center",
            toolbarButtonMarginClass
          )}
          id="kt_header_user_menu_toggle"
        >
          {/* begin::Toggle */}
          <div className="d-none d-md-flex flex-column align-items-end justify-content-center me-2 me-md-4">
            <span className="text-muted fs-6 fw-semibold lh-1 mb-1">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <span className="text-black fs-6 fw-bold lh-1">{auth?.selectedRole.toUpperCase()}</span>
          </div>

          <div
            className={clsx(
              "cursor-pointer symbol",
              toolbarUserAvatarHeightClass
            )}
            data-kt-menu-trigger="click"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="bottom"
          >
            <img
              className="h-30px w-30px rounded"
              src={toAbsoluteUrl("media/avatars/ProfilePhoto.jpg.webp")}
              alt="metronic"
            />
          </div>
          <HeaderUserMenu />
          {/* end::Toggle */}
        </div>
        {/* end::User */}
      </div>
    </div>
  );
};

export { Topbar };
