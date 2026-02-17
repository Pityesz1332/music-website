import "./AdminConnect.scss";
import { useAdminAuth } from "../../../hooks/admin/useAdminAuth";

export const AdminConnect = () => {
    
    const {
        credentials,
        isLoading,
        handleChange,
        handleSubmit
    } = useAdminAuth();

    return (
        <div className="admin-connect-wrapper">
            <form onSubmit={handleSubmit} className="admin-connect">
                <h2 className="admin-connect__title">Admin Login</h2>
                
                <input
                    className="admin-connect__input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    />

                <input
                    className="admin-connect__input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    />

                <button
                    className="admin-connect__button"
                    type="submit"
                    disabled={isLoading}
                >
                    Login as Admin
                </button>
            </form>
        </div>
    );
}