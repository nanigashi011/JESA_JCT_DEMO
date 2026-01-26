import { FC } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

const HeaderNotificationsMenu: FC = () => {
	return (
		<div
			className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
			data-kt-menu="true"
		>
			<div
				className="d-flex flex-column bgi-no-repeat rounded-top"
			>
				<h3 className="text-white fw-semibold px-9 mt-10 mb-6">
					Notifications
				</h3>
			</div>

			<div className="tab-content">
				<div
					className="tab-pane fade show active"
					id="kt_topbar_notifications_1"
					role="tabpanel"
				>
					<div className="scroll-y mh-325px my-5 px-8">
						<div className="text-center py-10">
							<div className="text-gray-500 fs-6">No notifications</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export { HeaderNotificationsMenu };
