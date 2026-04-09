const API_BASE_URL = "http://localhost:5000/api/v1/admin/analytics";

export const getGlobalAnalytics = async ({ search = '', sortBy = 'totalRevenue', order = 'desc', page = 1, limit = 10 }) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ search, sortBy, order, page, limit });
    
    const res = await fetch(`${API_BASE_URL}/packages?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
};

export const getPackageStats = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
};
