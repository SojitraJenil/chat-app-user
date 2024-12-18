import { useState } from 'react';

const FindUser = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]); // Simulating a list of users
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // Simulating a fetch request
        setTimeout(() => {
            const filteredUsers: any = [
                { id: 1, name: 'John Doe', username: 'johndoe' },
                { id: 2, name: 'Jane Smith', username: 'janesmith' }
            ].filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

            setUsers(filteredUsers);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex-1 justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-2 bg-white shadow-md rounded-lg">
                <form onSubmit={handleSearch} className="flex items-center mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                </form>

                {loading && <p className="text-center text-gray-500">Searching...</p>}

                {users.length > 0 && (
                    <div>
                        <ul className="space-y-4">
                            {users.map((user: any) => (
                                <li key={user.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                                    <span className="font-semibold">{user.name}</span>
                                    <button
                                        onClick={() => alert(`Selected ${user.name}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {users.length === 0 && !loading && searchQuery && (
                    <p className="text-center text-gray-500">No users found</p>
                )}
            </div>
        </div>
    );
};

export default FindUser;
