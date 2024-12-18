import React, { useState } from 'react';

function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">

                <div className="space-y-6">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="darkMode" className="text-lg font-medium">
                            Dark Mode
                        </label>
                        <button
                            id="darkMode"
                            onClick={toggleDarkMode}
                            className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200`}
                        >
                            <span
                                className={`${isDarkMode ? 'translate-x-5' : 'translate-x-0'
                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
                            ></span>
                        </button>
                    </div>

                    {/* Other settings options */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="notifications" className="text-lg font-medium">
                            Enable Notifications
                        </label>
                        <input
                            type="checkbox"
                            id="notifications"
                            className="form-checkbox h-5 w-5 text-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label htmlFor="privacy" className="text-lg font-medium">
                            Privacy Settings
                        </label>
                        <button className="text-blue-600">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
