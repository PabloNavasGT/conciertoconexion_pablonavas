const DB = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    deleteItem: (key, index) => {
        const data = DB.get(key);
        data.splice(index, 1);
        DB.set(key, data);
        return data;
    }
};