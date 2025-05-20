const { Router } = require('express');
const Cart = require('../models/cartModels');
const router = Router();

// POST: Agregar producto al carrito o incrementar cantidad
router.post('/cart', async (req, res) => {
const { userId, productId, name, price, quantity } = req.body;

try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
    cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
    } else {
    cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
}
});

// PUT: Modificar cantidad de un artículo
router.put('/cart/item/:productId', async (req, res) => {
const { userId, quantity } = req.body;
const { productId } = req.params;

try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
    } else {
    cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({ error: 'Error al modificar cantidad' });
}
});

// PUT: Eliminar un artículo del carrito
router.put('/cart/item/:productId/remove', async (req, res) => {
const { userId } = req.body;
const { productId } = req.params;

try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);

    await cart.save();
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
}
});

// GET: Obtener estado del carrito
router.get('/cart/:userId', async (req, res) => {
const { userId } = req.params;

try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
}
});

// DELETE: Eliminar carrito completo
router.delete('/cart/:userId', async (req, res) => {
const { userId } = req.params;

try {
    const result = await Cart.deleteOne({ userId });

    if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito eliminado' });
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar el carrito' });
}
});

module.exports = router;