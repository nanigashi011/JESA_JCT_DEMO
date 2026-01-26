import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import {
  useUserWidgets,
  type WidgetId,
} from "../../../../app/pages/home/hooks/useUserWidgets";
import { Languages } from "./Languages";
import { toAbsoluteUrl } from "../../../helpers";

const WIDGET_CONFIG: { id: WidgetId; label: string }[] = [
  { id: "myActions", label: "My Actions" },
  { id: "supportRequest", label: "Support Request" },
  { id: "alertsByType", label: "Alerts by Type" },
  { id: "alertsByCategory", label: "Alerts by Category" },
  { id: "applications", label: "Applications" },
  { id: "reality", label: "Reality" },
];

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const { visibleWidgets, setWidgetVisible } = useUserWidgets();
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-semibold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/avatars/ProfilePhoto.jpg.webp")}
            />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bold d-flex align-items-center fs-5">
              {currentUser?.firstName} {currentUser?.lastName}
              {/* <span className='badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2'>Pro</span> */}
            </div>
            <a
              href="#"
              className="fw-semibold text-muted text-hover-primary fs-7"
            >
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>
      
      <div className='menu-item px-5'>
        <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
          My Profile
        </Link>
      </div>

      <div
        className="menu-item px-5"
        data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
        data-kt-menu-placement="left-start"
        data-kt-menu-offset="-15px, 0"
      >
        <a href="#0" className="menu-link px-5">
          <span className="menu-title">My Widgets</span>
          <span className="menu-arrow"></span>
        </a>
        <div className="menu-sub menu-sub-dropdown w-175px py-4">
          {WIDGET_CONFIG.map(({ id, label }) => (
            <div key={id} className="menu-item px-3">
              <div className="menu-content px-3">
                <label className="form-check form-switch form-check-custom form-check-solid">
                  <input
                    className="form-check-input w-30px h-20px"
                    type="checkbox"
                    checked={visibleWidgets[id]}
                    onChange={(e) => setWidgetVisible(id, e.target.checked)}
                  />
                  <span className="form-check-label text-muted fs-7">{label}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className='menu-item px-5'
        data-kt-menu-trigger='{default: "click", lg: "hover"}'
        data-kt-menu-placement='left-end'
        data-kt-menu-offset='-15px, 0'
      >
        <a href='#' className='menu-link px-5'>
          <span className='menu-title position-relative'>
            My Mode
            <span className='ms-5 position-absolute translate-middle-y top-50 end-0'>
              <i className='ki-outline ki-night-day theme-light-show fs-2'></i>
              <i className='ki-outline ki-moon theme-dark-show fs-2'></i>
            </span>
          </span>
        </a>
        {/*begin::Menu*/}
        <div
          className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px'
          data-kt-menu='true'
          data-kt-element='theme-mode-menu'
        >
          {/*begin::Menu item*/}
          <div className='menu-item px-3 my-0'>
            <a
              href='#'
              className='menu-link px-3 py-2'
              data-kt-element='mode'
              data-kt-value='light'
            >
              <span className='menu-icon' data-kt-element='icon'>
                <i className='ki-outline ki-night-day fs-2'></i>
              </span>
              <span className='menu-title'>Light</span>
            </a>
          </div>
          {/*end::Menu item*/}
          {/*begin::Menu item*/}
          <div className='menu-item px-3 my-0'>
            <a
              href='#'
              className='menu-link px-3 py-2'
              data-kt-element='mode'
              data-kt-value='dark'
            >
              <span className='menu-icon' data-kt-element='icon'>
                <i className='ki-outline ki-moon fs-2'></i>
              </span>
              <span className='menu-title'>Dark Black</span>
            </a>
          </div>
          {/*end::Menu item*/}

          {/*begin::Menu item*/}
          <div className='menu-item px-3 my-0'>
            <a
              href='#'
              className='menu-link px-3 py-2'
              data-kt-element='mode'
              data-kt-value='dark_blue'
            >
              <span className='menu-icon' data-kt-element='icon'>
                <i className='ki-outline ki-moon fs-2'></i>
              </span>
              <span className='menu-title'>Dark Blue</span>
            </a>
          </div>
          {/*end::Menu item*/}

          {/*begin::Menu item*/}
          <div className='menu-item px-3 my-0'>
            <a
              href='#'
              className='menu-link px-3 py-2'
              data-kt-element='mode'
              data-kt-value='dark_gradient'
            >
              <span className='menu-icon' data-kt-element='icon'>
                <i className='ki-outline ki-moon fs-2'></i>
              </span>
              <span className='menu-title'>Dark Gradient</span>
            </a>
          </div>
          {/*end::Menu item*/}
        </div>
        {/*end::Menu*/}
      </div>

      <div className='separator my-2'></div>

      {/* <Languages /> */}

      <div className='menu-item px-5 my-1'>
        <Link to='/crafted/account/settings' className='menu-link px-5'>
          Account Settings
        </Link>
      </div>
      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
