import React from 'react'

const dashboard = () => {
    const checkUserStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/check_user_status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);  // Show user status
            } else {
                alert('Failed to check user status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);  // Show logout success message
            } else {
                alert('Failed to log out');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>User Actions</h1>

            {/* Check User Status Button */}
            <button onClick={checkUserStatus}>Check User Status</button>

            <br /><br />

            {/* Logout Button */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};


export default dashboard