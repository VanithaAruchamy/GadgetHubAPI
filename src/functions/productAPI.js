const { app } = require('@azure/functions');

let products = []; 
const handler = async (request, context) => {
// app.http('productAPI', {
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
        context.log(`HTTP function processed request for URL "${request.url}"`);
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow all origins
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        const method = request.method;
        const productId = request.query.get('id');
        
        switch (method) {
            case 'GET':
                if (productId) {
                    // Fetch specific product by ID
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        return { body: JSON.stringify(product), headers };
                    } else {
                        return { body: JSON.stringify({ error: 'Product not found' }), status: 404, headers };
                    }
                } else {
                    // Return all products
                    return { body: JSON.stringify(products), headers };
                }

            case 'POST':
                try {
                    const data = await request.json();
                    const newProduct = {
                        id: (products.length + 1).toString(), // Basic ID generation
                        name: data.name,
                        price: data.price,
                    };
                    products.push(newProduct);
                    return { body: JSON.stringify(newProduct), status: 201, headers };
                } catch (error) {
                    return { body: JSON.stringify({ error: 'Invalid request data' }), status: 400, headers };
                }

            case 'PUT':
                if (!productId) {
                    return { body: JSON.stringify({ error: 'Product ID is required for update' }), status: 400, headers };
                }
                try {
                    const data = await request.json();
                    let product = products.find(p => p.id === productId);
                    if (product) {
                        product.name = data.name || product.name;
                        product.price = data.price || product.price;
                        return { body: JSON.stringify(product), status: 200, headers };
                    } else {
                        return { body: JSON.stringify({ error: 'Product not found' }), status: 404, headers };
                    }
                } catch (error) {
                    return { body: JSON.stringify({ error: 'Invalid request data' }), status: 400, headers };
                }

            case 'DELETE':
                if (!productId) {
                    return { body: JSON.stringify({ error: 'Product ID is required for delete' }), status: 400, headers };
                }
                const initialLength = products.length;
                products = products.filter(p => p.id !== productId);
                if (products.length < initialLength) {
                    return { body: JSON.stringify({ message: 'Product deleted successfully' }), status: 200, headers };
                } else {
                    return { body: JSON.stringify({ error: 'Product not found' }), status: 404, headers };
                }

            case 'OPTIONS':
                return { status: 204, headers }; // Handle preflight CORS requests
            
            default:
                return { body: JSON.stringify({ error: 'Method not allowed' }), status: 405, headers };
        }
    }
// });

// Register the HTTP function
app.http('productAPI', {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: handler
});

// Export for testing
module.exports = { app, handler };
// module.exports = app;