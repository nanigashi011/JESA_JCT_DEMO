import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100%";
    }
    return () => {
      if (root) {
        root.style.height = "auto";
      }
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100">
      {/* begin::Aside */}
      <div className="d-flex flex-lg-row-fluid">
        {/* begin::Content */}
        <div className="d-flex flex-column flex-center pb-0 pb-lg-10 p-10 w-100">
          {/* begin::Image */}
          <img
            className="theme-light-show w-100 mb-10 mb-lg-20"
            style={{ height: "20%" }}
            src={toAbsoluteUrl("media/logos/logo-jesa-pmp.svg")}
            alt=""
          />
          <img
            className="theme-dark-show w-100 mb-10 mb-lg-20"
            style={{ height: "20%" }}
            src={toAbsoluteUrl("media/logos/logo-jesa-pmp.svg")}
            alt=""
          />
          {/* end::Image */}
        </div>
        {/* end::Content */}
      </div>
      {/* begin::Aside */}

      {/* begin::Body */}
      <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12">
        <div className="pattern">
          <img
            src={toAbsoluteUrl("media/auth/pattern-1.svg")}
            alt=""
            style={{ width: "140px" }}
          />
        </div>
        <div className="bg-body-glassmod d-flex flex-column flex-center rounded-4 w-100 w-md-500px p-6">
          {/* begin::Wrapper */}
          <div className="bg-body d-flex flex-column flex-center rounded-4 p-10">
            {/* begin::Content */}
            <div className="d-flex flex-center flex-column align-items-stretch h-lg-100 w-400px">
              <Outlet />
            </div>
            {/* end::Content */}
          </div>
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { AuthLayout };
