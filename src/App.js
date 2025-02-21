import React, { useEffect, useState } from'react';
import axios from 'axios';
import './App.css';

// 定义产品数据
const products = [
    { id: 1, name: 'Air Conditioner', price: 1499, thumbnail: require('./assets/thumbnail1.jpg'), description: 'Description for Prod1', category: 'Tools' },
    { id: 2, name: 'Clothes', price: 149, thumbnail: require('./assets/thumbnail2.jpg'), description: 'Description for Prod2', category: 'Fashion' },
    { id: 3, name: 'Ear Rings', price: 1.5, thumbnail: require('./assets/thumbnail3.jpg'), description: 'Description for Prod3', category: 'Fashion' },
    { id: 4, name: 'Television', price: 999, thumbnail: require('./assets/thumbnail4.jpg'), description: 'Description for Prod4', category: 'Tools' }
];

// 获取所有类别
const categories = [...new Set(products.map(product => product.category))];

function App() {
    const [shoppingList, setShoppingList] = useState([]);
    const [quantityInputs, setQuantityInputs] = useState({});
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isCartVisible, setIsCartVisible] = useState(false);

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/hello');
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    // 添加商品到购物车
    const addToCart = (product) => {
        const existingProduct = shoppingList.find(p => p.id === product.id);
        if (existingProduct) {
            setShoppingList(shoppingList.map(p =>
                p.id === product.id? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setShoppingList([...shoppingList, {...product, quantity: 1 }]);
        }
        setQuantityInputs(prevInputs => ({...prevInputs, [product.id]: (prevInputs[product.id] || 0) + 1 }));
    };

    // 处理数量输入框变化
    const handleQuantityChange = (e, productId) => {
        const value = parseInt(e.target.value, 10);
        if (value === 0) {
            // 当数量为 0 时，从购物车中移除该商品
            setShoppingList(shoppingList.filter(p => p.id!== productId));
            setQuantityInputs(prevInputs => {
                const newInputs = {...prevInputs };
                delete newInputs[productId];
                return newInputs;
            });
        } else {
            setQuantityInputs(prevInputs => ({...prevInputs, [productId]: value }));
            setShoppingList(shoppingList.map(p =>
                p.id === productId? { ...p, quantity: value } : p
            ));
        }
    };

    // 结账逻辑（这里只是模拟，实际需要与支付网关集成）
    const checkout = () => {
        console.log('Checkout clicked. Shopping List:', shoppingList);
    };

    // 处理类别点击事件
    const handleCategoryClick = (category) => {
        setCurrentCategory(category);
        setCurrentProduct(null);
    };

    // 处理产品点击事件
    const handleProductClick = (product) => {
        setCurrentProduct(product);
    };

    // 根据当前类别过滤产品
    const filteredProducts = currentCategory
      ? products.filter(product => product.category === currentCategory)
        : products;

    // 生成导航栏内容
    const breadcrumb = () => {
        if (currentProduct) {
            return (
                <span>
                    <button onClick={() => { setCurrentCategory(null); setCurrentProduct(null); }}>Home</button>
                    {' > '}
                    <button onClick={() => { setCurrentCategory(currentProduct.category); setCurrentProduct(null); }}>{currentProduct.category}</button>
                    {' > '}
                    {currentProduct.name}
                </span>
            );
        } else if (currentCategory) {
            return (
                <span>
                    <button onClick={() => { setCurrentCategory(null); setCurrentProduct(null); }}>Home</button>
                    {' > '}
                    {currentCategory}
                </span>
            );
        }
        return 'Home';
    };

    // 计算购物车总价
    const calculateTotalPrice = () => {
        return shoppingList.reduce((total, product) => {
            return total + product.price * (quantityInputs[product.id] || 1);
        }, 0);
    };

    // 计算购物车总数量
    const calculateTotalQuantity = () => {
        return shoppingList.reduce((total, product) => {
            return total + (quantityInputs[product.id] || 1);
        }, 0);
    };

    return (
        <div className="App">
            {/* 头部与导航栏整合 */}
            <header className="header">
                <h1>{message}</h1>
                <nav className="nav">
                    <ul>
                        <li>
                            <button onClick={() => { setCurrentCategory(null); setCurrentProduct(null); }}>Home</button>
                        </li>
                        {categories.map(category => (
                            <li key={category}>
                                <button onClick={() => handleCategoryClick(category)}>{category}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div
                    className="shopping-cart-icon"
                    onMouseEnter={() => setIsCartVisible(true)}
                    onMouseLeave={() => setIsCartVisible(false)}
                >
                    <span>🛒 ({calculateTotalQuantity()}) - ${calculateTotalPrice().toFixed(2)}</span>
                    {isCartVisible && (
                        <div className="shopping-list-dropdown">
                            <h2>Shopping List</h2>
                            <ul>
                                {shoppingList.map(product => {
                                    const itemTotal = product.price * (quantityInputs[product.id] || 1);
                                    return (
                                        <li key={product.id}>
                                            <img src={product.thumbnail} alt={product.name} width={50} />
                                            <div className="product-info">
                                                <span>{product.name}</span>
                                                <span>@ ${product.price}</span>
                                                <span>x {quantityInputs[product.id] || 1}</span>
                                                <span>= ${itemTotal.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={quantityInputs[product.id] || 1}
                                                onChange={(e) => handleQuantityChange(e, product.id)}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                            <p>Total: ${calculateTotalPrice().toFixed(2)}</p>
                            <button onClick={checkout}>Checkout</button>
                        </div>
                    )}
                </div>
            </header>
            {/* 面包屑导航 */}
            <div className="breadcrumb">{breadcrumb()}</div>
            {/* 主要内容区域 */}
            <section className="main-content">
                {currentProduct? (
                    <div className="product-detail">
                        <div className="product-detail-left">
                            <img src={currentProduct.thumbnail} alt={currentProduct.name} width={300} />
                        </div>
                        <div className="product-detail-right">
                            <h2>{currentProduct.name}</h2>
                            <p className="product-description">{currentProduct.description}</p>
                            <p className="product-price">Price: ${currentProduct.price}</p>
                            <button onClick={() => addToCart(currentProduct)}>Add to Cart</button>
                        </div>
                    </div>
                ) : (
                    <div className="product-list">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="product-item"
                                onClick={() => handleProductClick(product)}
                            >
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="product-thumbnail"
                                />
                                <h3>{product.name}</h3>
                                <p>${product.price}</p>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* 页脚 */}
            <footer className="footer">
                <p>&copy; 2024 Kasper's Shopping Net. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;