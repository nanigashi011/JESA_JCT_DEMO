import { useAuth } from "../core/Auth";
import { getUserByToken } from "../core/_requests";
import { useState } from "react";
import Swal from "sweetalert2";

export function Login() {
	const { saveAuth, setCurrentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setIsLoading(true);
			console.log("Authentication method needs to be implemented");
			Swal.fire({
				icon: "info",
				title: "Authentication unavailable",
				text: "Please implement an authentication method.",
				confirmButtonText: "OK",
			});
		} catch (error) {
			console.error("Login error:", error);
			const errorMessage = error instanceof Error ? error.message : "An error occurred during authentication. Please try again.";
			Swal.fire({
				icon: "error",
				title: "Access denied",
				text: errorMessage,
				confirmButtonText: "OK",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="form w-100">
			{/* Header */}
			<div className="text-center mb-11">
				<h1 className="text-gray-900 fw-bolder authentication mt-8 mb-20">Authentication</h1>
			</div>
			<div className="d-grid mb-10">
				<button
					type="button"
					onClick={handleLogin}
					disabled={isLoading}
					className="btn btn-pmp"
				>
					{isLoading ? (
						<span className="indicator-progress" style={{ display: "block" }}>
							Please wait...
							<span className="spinner-border spinner-border-sm align-middle ms-2"></span>
						</span>
					) : (
						<span className="btn-pmp-label">Login</span>
					)}
				</button>
			</div>
		</div>
	);
}
