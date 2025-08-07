const config = {
    development: {
        BACKEND_URL: 'http://localhost:3000'
    },
    production: {
        BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://your-backend-app.onrender.com'
    }
};

const environment = import.meta.env.MODE || 'development';
export default config[environment];