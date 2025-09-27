import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';

// Sample products for initial seeding
const sampleProducts = [
	{
		_id: 'prod_1',
		name: 'Wireless Headphones Pro',
		description: 'Premium noise-canceling wireless headphones with superior sound quality and 30-hour battery life.',
		price: 199.99,
		category: 'Electronics',
		stock: 50,
		image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxlbGVjdHJvbmljc3xlbnwwfHx8fDE3NTg5NTAyODB8MA&ixlib=rb-4.1.0&q=85',
		featured: true,
		rating: 4.8,
		reviews: 124,
		createdAt: new Date(),
	},
	{
		_id: 'prod_2',
		name: 'Smart Tech Bundle',
		description: 'Complete workspace setup including laptop stand, wireless mouse, and premium accessories.',
		price: 299.99,
		category: 'Electronics',
		stock: 25,
		image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljc3xlbnwwfHx8fDE3NTg5NTAyODB8MA&ixlib=rb-4.1.0&q=85',
		featured: true,
		rating: 4.6,
		reviews: 89,
		createdAt: new Date(),
	},
	{
		_id: 'prod_3',
		name: 'Premium Fashion Collection',
		description: 'Curated collection of stylish clothing including designer tops, accessories, and seasonal wear.',
		price: 149.99,
		category: 'Fashion',
		stock: 30,
		image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjbG90aGluZ3xlbnwwfHx8fDE3NTg5ODE0NzV8MA&ixlib=rb-4.1.0&q=85',
		featured: false,
		rating: 4.7,
		reviews: 156,
		createdAt: new Date(),
	},
	{
		_id: 'prod_4',
		name: 'Casual Wear Set',
		description: 'Comfortable and stylish casual clothing set perfect for everyday wear and weekend outings.',
		price: 89.99,
		category: 'Fashion',
		stock: 40,
		image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxjbG90aGluZ3xlbnwwfHx8fDE3NTg5ODE0NzV8MA&ixlib=rb-4.1.0&q=85',
		featured: true,
		rating: 4.5,
		reviews: 93,
		createdAt: new Date(),
	},
	{
		_id: 'prod_5',
		name: 'Professional Electronics Kit',
		description: 'High-end electronics and gadgets for professionals including latest tech accessories.',
		price: 449.99,
		category: 'Electronics',
		stock: 15,
		image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
		featured: false,
		rating: 4.9,
		reviews: 67,
		createdAt: new Date(),
	},
	{
		_id: 'prod_6',
		name: 'Lifestyle Accessories',
		description: 'Complete lifestyle package with fashionable accessories, bags, and everyday essentials.',
		price: 129.99,
		category: 'Fashion',
		stock: 35,
		image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
		featured: false,
		rating: 4.4,
		reviews: 112,
		createdAt: new Date(),
	},
	{
		_id: 'prod_7',
		name: 'Fitness Smartwatch',
		description: 'Track your workouts, heart rate, and sleep with this stylish fitness smartwatch.',
		price: 179.99,
		category: 'Electronics',
		stock: 60,
		image: 'https://images.unsplash.com/photo-1722153768985-9286321b8769',
		featured: true,
		rating: 4.6,
		reviews: 210,
		createdAt: new Date(),
	},
	{
		_id: 'prod_8',
		name: 'Ergonomic Office Chair',
		description: 'High-quality ergonomic chair with lumbar support and adjustable height for maximum comfort.',
		price: 249.99,
		category: 'Furniture',
		stock: 18,
		image: 'https://hbada.com/cdn/shop/files/P501--AI_2.jpg',
		featured: false,
		rating: 4.7,
		reviews: 134,
		createdAt: new Date(),
	},
	{
		_id: 'prod_9',
		name: 'Gaming Laptop',
		description: 'Powerful gaming laptop with NVIDIA RTX graphics, 16GB RAM, and 1TB SSD storage.',
		price: 1299.99,
		category: 'Electronics',
		stock: 10,
		image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
		featured: true,
		rating: 4.9,
		reviews: 87,
		createdAt: new Date(),
	},
	{
		_id: 'prod_10',
		name: 'Minimalist Sneakers',
		description: 'Lightweight, durable, and comfortable sneakers for everyday wear.',
		price: 79.99,
		category: 'Fashion',
		stock: 70,
		image: 'https://images.unsplash.com/photo-1695073621086-aa692bc32a3d',
		featured: false,
		rating: 4.4,
		reviews: 95,
		createdAt: new Date(),
	},
	{
		_id: 'prod_11',
		name: 'Home Coffee Maker',
		description: 'Compact and easy-to-use coffee maker with multiple brew settings and a sleek design.',
		price: 99.99,
		category: 'Home Appliances',
		stock: 25,
		image: 'https://images.unsplash.com/photo-1707241358597-bafcc8a8e73d',
		featured: true,
		rating: 4.5,
		reviews: 178,
		createdAt: new Date(),
	},

];

async function GET(request) {
	const { searchParams } = new URL(request.url);
	const path = new URL(request.url).pathname.replace('/api/', '');

	try {
		const client = await clientPromise;
		const db = client.db(process.env.DB_NAME);

		// Products endpoints
		if (path === 'products') {
			const category = searchParams.get('category');
			const featured = searchParams.get('featured');
			const limit = parseInt(searchParams.get('limit')) || 20;

			let query = {};
			if (category) query.category = category;
			if (featured === 'true') query.featured = true;

			const products = await db.collection('products')
				.find(query)
				.limit(limit)
				.sort({ createdAt: -1 })
				.toArray();

			return NextResponse.json({ products });
		}

		// Single product endpoint
		if (path.startsWith('products/')) {
			const productId = path.split('/')[1];
			const product = await db.collection('products').findOne({ _id: productId });

			if (!product) {
				return NextResponse.json({ error: 'Product not found' }, { status: 404 });
			}

			return NextResponse.json({ product });
		}

		// Cart endpoints (require authentication)
		if (path === 'cart') {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const cartItems = await db.collection('cart')
				.find({ userId: session.user.id })
				.toArray();

			// Populate with product details
			const cartWithProducts = [];
			for (const item of cartItems) {
				const product = await db.collection('products').findOne({ _id: item.productId });
				if (product) {
					cartWithProducts.push({
						...item,
						product,
					});
				}
			}

			return NextResponse.json({ cartItems: cartWithProducts });
		}

		// Orders endpoints (require authentication)
		if (path === 'orders') {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const orders = await db.collection('orders')
				.find({ userId: session.user.id })
				.sort({ createdAt: -1 })
				.toArray();

			return NextResponse.json({ orders });
		}

		// Seed database endpoint
		if (path === 'seed') {
			for (const product of sampleProducts) {
				await db.collection('products').updateOne(
					{ _id: product._id },
					{ $set: product },
					{ upsert: true }
				);
			}

			const total = await db.collection('products').countDocuments();
			return NextResponse.json({ message: 'Database seeded/updated successfully', count: total });
		}




		return NextResponse.json({ message: 'QuickCart API - E-commerce Backend' });
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

async function POST(request) {
	const path = new URL(request.url).pathname.replace('/api/', '');

	try {
		const client = await clientPromise;
		const db = client.db(process.env.DB_NAME);

		// Add to cart endpoint
		if (path === 'cart') {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const { productId, quantity = 1 } = await request.json();

			if (!productId) {
				return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
			}

			// Check if product exists and has sufficient stock
			const product = await db.collection('products').findOne({ _id: productId });
			if (!product) {
				return NextResponse.json({ error: 'Product not found' }, { status: 404 });
			}

			if (product.stock < quantity) {
				return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
			}

			// Check if item already exists in cart
			const existingCartItem = await db.collection('cart').findOne({
				userId: session.user.id,
				productId,
			});

			if (existingCartItem) {
				// Update quantity
				await db.collection('cart').updateOne(
					{ _id: existingCartItem._id },
					{ $inc: { quantity: quantity } }
				);
			} else {
				// Add new item
				await db.collection('cart').insertOne({
					_id: uuidv4(),
					userId: session.user.id,
					productId,
					quantity,
					addedAt: new Date(),
				});
			}

			return NextResponse.json({ message: 'Item added to cart' });
		}

		// Create order endpoint
		if (path === 'orders') {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const { items, total, shippingAddress } = await request.json();

			if (!items?.length || !total || !shippingAddress) {
				return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
			}

			const orderId = uuidv4();
			const order = {
				_id: orderId,
				userId: session.user.id,
				items,
				total,
				shippingAddress,
				status: 'pending',
				paymentStatus: 'completed', // Mock payment
				createdAt: new Date(),
			};

			await db.collection('orders').insertOne(order);

			// Clear cart after order
			await db.collection('cart').deleteMany({ userId: session.user.id });

			// Update product stock
			for (const item of items) {
				await db.collection('products').updateOne(
					{ _id: item.productId },
					{ $inc: { stock: -item.quantity } }
				);
			}

			return NextResponse.json({ message: 'Order created successfully', orderId });
		}

		return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
	} catch (error) {
		console.error('POST API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

async function PUT(request) {
	const path = new URL(request.url).pathname.replace('/api/', '');

	try {
		const client = await clientPromise;
		const db = client.db(process.env.DB_NAME);

		// Update cart item quantity
		if (path === 'cart') {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const { productId, quantity } = await request.json();

			if (!productId || quantity < 0) {
				return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
			}

			if (quantity === 0) {
				// Remove item from cart
				await db.collection('cart').deleteOne({
					userId: session.user.id,
					productId,
				});
			} else {
				// Update quantity
				await db.collection('cart').updateOne(
					{ userId: session.user.id, productId },
					{ $set: { quantity } }
				);
			}

			return NextResponse.json({ message: 'Cart updated successfully' });
		}

		return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
	} catch (error) {
		console.error('PUT API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

async function DELETE(request) {
	const path = new URL(request.url).pathname.replace('/api/', '');

	try {
		const client = await clientPromise;
		const db = client.db(process.env.DB_NAME);

		// Remove item from cart
		if (path.startsWith('cart/')) {
			const session = await getServerSession(authOptions);
			if (!session) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			const productId = path.split('/')[1];

			await db.collection('cart').deleteOne({
				userId: session.user.id,
				productId,
			});

			return NextResponse.json({ message: 'Item removed from cart' });
		}

		return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
	} catch (error) {
		console.error('DELETE API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export { GET, POST, PUT, DELETE };