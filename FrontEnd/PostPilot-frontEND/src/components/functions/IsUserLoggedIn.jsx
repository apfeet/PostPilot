export const checkUserStatus = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/check_user_status", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        if (typeof json.logged_in === 'boolean') {
            return json.logged_in;
        } else {
            console.error("Unexpected response format:", json);
            return false; 
        }
    } catch (error) {
        console.error("Error checking user status:", error);
        return 'Error';
    }
};
