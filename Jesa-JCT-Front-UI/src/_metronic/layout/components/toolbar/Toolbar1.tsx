import clsx from "clsx";
import { useLayout } from "../../core";
import { DefaultTitle } from "../header/page-title/DefaultTitle";
import { PageTitleNavbar } from "../../components/header/page-title/PageTitleNavbar";

const Toolbar1 = () => {
	const { classes } = useLayout();

	return (
		<>
			{/* begin::Page title */}
			<div className="page-title d-flex justify-content-between flex-wrap">
				{/* begin::Left side - Toggle + Title */}
				<DefaultTitle />
				
				{/* begin::Right side - Navbar */}
				<PageTitleNavbar />
			</div>
			{/* end::Page title */}
		</>
	);
};

export { Toolbar1 };
