// const request = require('supertest'); // Import SuperTest
// const { app } = require('../src/functions/productAPI'); // Import your Azure function app
// let host="http://localhost:7071"
// describe('Product API Integration Tests', () => {
//     it('should return all products for GET /productAPI', async () => {
//         // First, seed the application with some actual products
//         const product1 = { name: 'Product1', price: 100 };
//         const product2 = { name: 'Product2', price: 200 };

//         // Post product1
//         await request(host)
//             .post('/api/productAPI')
//             .send(product1)
//             .expect(201);

//         // Post product2
//         await request(host)
//             .post('/api/productAPI')
//             .send(product2)
//             .expect(201);

//         // Now test GET request to get all products
//         const res = await request(host)
//             .get('/api/productAPI')
//             .expect('Content-Type', /json/)
//             .expect(200);
        
//         // Assert the response body
//         expect(res.body.length).toBe(2);
//         expect(res.body[0].name).toBe('Product1');
//         expect(res.body[1].name).toBe('Product2');
//     });

//     it('should add a new product for POST /productAPI', async () => {
//         const newProduct = { name: 'Product3', price: 300 };

//         // Test POST request to add a new product
//         const res = await request(host)
//             .post('/api/productAPI')
//             .send(newProduct)
//             .expect('Content-Type', /json/)
//             .expect(201);

//         // Assert that the response contains the correct product details
//         expect(res.body.name).toBe('Product3');
//         expect(res.body.price).toBe(300);
//     });

//     it('should update a product for PUT /productAPI?id=1', async () => {
//         const updatedProduct = { name: 'UpdatedProduct1', price: 150 };

//         // First, create a product to update
//         const product = { name: 'Product1', price: 100 };
//         await request(host)
//             .post('/api/productAPI')
//             .send(product)
//             .expect(201);

//         // Now update the product
//         const res = await request(host)
//             .put('/api/productAPI?id=1')
//             .send(updatedProduct)
//             .expect('Content-Type', /json/)
//             .expect(200);

//         // Assert that the product was updated correctly
//         expect(res.body.name).toBe('UpdatedProduct1');
//         expect(res.body.price).toBe(150);
//     });

//     it('should delete a product for DELETE /productAPI?id=1', async () => {
//         // First, create a product to delete
//         const product = { name: 'Product1', price: 100 };
//         await request(host)
//             .post('/api/productAPI')
//             .send(product)
//             .expect(201);

//         // Now delete the product
//         const res = await request(host)
//             .delete('/api/productAPI?id=1')
//             .expect(200);

//         // Assert the response message
//         expect(res.body.message).toBe('Product deleted successfully');
//     });
// });








const { handler } = require('../src/functions/productAPI'); // Import the handler directly

describe('Product API Azure Function', () => {
    let context;
    let products;

    beforeEach(() => {
        // Mock context for logging
        context = {
            log: jest.fn(),
        };

        // Reset the products between tests (if using in-memory data)
        products = [];
    });

    it('should return all products for GET /productAPI', async () => {
        // Seed with mock data
        products.push({ id: '1', name: 'Product1', price: 100 });
        products.push({ id: '2', name: 'Product2', price: 200 });

        // Mock GET request
        const request = {
            method: 'GET',
            query: new Map(),
        };

        // Call the handler directly
        const result = await handler(request, context);
        const body = JSON.parse(result.body);

        // expect(result.status).toBe(200);
        expect(body.length).toBe(2);
    });

    it('should add a new product for POST /productAPI', async () => {
        // Mock POST request
        const request = {
            method: 'POST',
            query: new Map(),
            json: jest.fn().mockResolvedValue({ name: 'Product3', price: 300 }),
        };

        // Call the handler directly
        const result = await handler(request, context);
        const body = JSON.parse(result.body);

        expect(result.status).toBe(201);
        expect(body.name).toBe('Product3');
    });

    it('should update a product for PUT /productAPI?id=1', async () => {
        // Seed with mock data
        products.push({ id: '1', name: 'Product1', price: 100 });

        // Mock PUT request
        const request = {
            method: 'PUT',
            query: new Map([['id', '1']]),
            json: jest.fn().mockResolvedValue({ name: 'UpdatedProduct1', price: 150 }),
        };

        // Call the handler directly
        const result = await handler(request, context);
        const body = JSON.parse(result.body);

        expect(result.status).toBe(200);
        expect(body.name).toBe('UpdatedProduct1');
    });

    it('should delete a product for DELETE /productAPI?id=1', async () => {
        // Seed with mock data
        products.push({ id: '1', name: 'Product1', price: 100 });

        // Mock DELETE request
        const request = {
            method: 'DELETE',
            query: new Map([['id', '1']]),
        };

        // Call the handler directly
        const result = await handler(request, context);
        const body = JSON.parse(result.body);

        expect(result.status).toBe(200);
        expect(body.message).toBe('Product deleted successfully');
    });
});
