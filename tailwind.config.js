/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // We define 'primary' as that specific Teal from your image
                primary: {
                    50: '#f0fdfa',  // Very light background
                    100: '#ccfbf1',
                    400: '#2dd4bf', // Lighter accents
                    500: '#14b8a6', // Hover states
                    600: '#0d9488', // The MAIN Button/Footer color (Teal)
                    700: '#0f766e', // Darker text
                    900: '#134e4a', // Deepest text
                }
            }
        },
    },
    plugins: [],
}
