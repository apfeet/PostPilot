export const checkUserStatus = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/check_user_status", {
            method: "GET",
            credentials: "include",
        });

        const json = await response.json();
        const loggedIn = json.logged_in;
        return loggedIn;
    } catch (error) {
        console.error("Error checking user status:", error);
        return false; 
    }
};
