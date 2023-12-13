<template>
  <div class="body">
    <header>
      <h1 class="brand">Gourmet Cafe</h1>
      <img class="tech" src="favicon.ico" alt="user picture" />
    </header>
    <div class="products">
      <div
        class="product"
        :title="product.description"
        v-for="(product, index) in products"
        :item="product"
        :index="index"
        :key="product._id"
      >
        <img src="../assets/coffee1.jpg" :alt="product.description" />
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <h2>{{ product.order }}</h2>
          <div class="price-spot">
            <h2>${{ product.price }}</h2>
            <button @click="addToCart(product._id, product.price)" class="add">
              +
            </button>
            <button
              @click="subToCart(product._id, product.price, product.order)"
              class="sub"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="confirm-buy" :class="{ active: isActive }">
      <div class="confirm-buy-header">
        <h1>Orders</h1>
        <button @click="closeBuy" class="close-btn">&times;</button>
      </div>
      <div class="confirm-buy-body">
        <div
          class="order-list"
          v-for="(order, index) in orders"
          :item="order"
          :index="index"
          :key="order._id"
        >
          <h4>{{ order.order }} {{ order.name }} ${{ order.price }}</h4>
        </div>
        <div
          v-for="(price, index) in finalPrice"
          :item="price"
          :index="index"
          :key="price._id"
          class="final-price"
        >
          <h2>Final Price:</h2>
          <h2>${{ price.final_price }}</h2>
        </div>
        <input v-model="name" placeholder="Receiver name" />
        <input v-model="address" placeholder="Address" />
        <div class="pay-box">
          <label for="payment">Choose a payment method:</label>
          <select v-model="payment" name="payment" id="payment">
            <option value="pix">Pix</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="bitcoin">Bitcoin</option>
          </select>
        </div>
        <button
          v-for="(price, index) in finalPrice"
          :item="price"
          :index="index"
          :key="price._id"
          @click="confirmBuy(price.final_price)"
          class="confirm-buy-btn"
        >
          Confirm Purchase
        </button>
      </div>
    </div>
    <div :class="{ active: isActive }" id="overlay"></div>
    <footer>
      <button @click="finishBuy()">Finish Buy</button>
    </footer>
  </div>
</template>

<script>
import ShopService from "../ShopService";

export default {
  name: "ShopComponent",
  data() {
    return {
      products: [],
      orders: [],
      finalPrice: 0.0,
      isActive: false,
      error: "",
      name: "",
      address: "",
      payment: "",
      orderCount: 0,
    };
  },
  async created() {
    try {
      this.products = await ShopService.getProducts();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async addToCart(id, price) {
      await ShopService.updateOrder(id, 1);
      await ShopService.updateFinalPrice(price);
      this.products = await ShopService.getProducts();
      this.finalPrice = await ShopService.getFinalPrice();
      this.orderCount++;
    },
    async subToCart(id, price, order) {
      if (order > 0) {
        await ShopService.updateOrder(id, -1);
        await ShopService.updateFinalPrice(-price);
        this.products = await ShopService.getProducts();
        this.finalPrice = await ShopService.getFinalPrice();
        this.orderCount--;
      }
    },
    async finishBuy() {
      if (this.orderCount) {
        this.orders = await ShopService.getOrder();
        this.finalPrice = await ShopService.getFinalPrice();
        this.isActive = true;
      } else {
        alert("Pick at least 1 coffee");
      }
    },
    closeBuy() {
      this.isActive = false;
    },
    async confirmBuy(price) {
      if (this.name && this.address && this.payment) {
        alert(`
        Receiver: ${this.name}\n
        Address: ${this.address}\n
        Payment Method: ${this.payment}\n
        Price: ${price}`);
        this.isActive = false;
        this.name = "";
        this.address = "";
        this.payment = "";
        this.orderCount = 0;
        await ShopService.resetOrder();
        await ShopService.resetFinalPrice(-price);
        this.products = await ShopService.getProducts();
        this.finalPrice = await ShopService.getFinalPrice();
        this.orders = await ShopService.getOrder();
        this.error = "";
      } else {
        alert("All fields are necessary");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  justify-items: space-between;
  align-content: space-between;
  align-items: space;
  height: 100vh;
  width: 968px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0 10px 0;
}

.brand {
  padding: 10px;
  background: transparent;
  border: 1.5px solid green;
  border-radius: 10px;
}

.tech {
  padding: 20px;
  background: transparent;
  border: 1.5px solid green;
  border-radius: 10px;
}

.products {
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
}

.product {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1.5px solid green;
}

.product > h2 {
  padding: 20px;
  background: transparent;
  border-radius: 10px;
  font-size: 24pt;
}

.product > img {
  background: transparent;
  border-radius: 10px 10px 0 0;
  height: 100%;
  max-height: 20vh;
  width: 100%;
}

.product-info {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: transparent;
  border-radius: 10px;
}

.price-spot {
  display: flex;
  justify-content: center;
  align-content: center;
}

.price-spot * {
  margin: 0 10px;
}

button {
  cursor: pointer;
}

.add,
.sub {
  padding: 10px;
  background: transparent;
  border-radius: 10px;
  font-size: 16pt;
  font-weight: bold;
}
.add {
  color: green;
  border: 1.5px solid green;
}

.sub {
  border: 1.5px solid red;
  color: red;
}

footer {
  padding: 20px 0 20px 0;
}

footer button {
  width: 100%;
  font-size: 36pt;
  padding: 20px;
  border: 1.5px solid green;
  border-radius: 10px;
  background: transparent;
  color: green;
}

.confirm-buy {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: 200ms ease-in-out;
  border-radius: 12px;
  border: 1.5px solid green;
  z-index: 10;
  background: white;
  width: 500px;
  max-width: 80%;
}

.confirm-buy.active {
  transform: translate(-50%, -50%) scale(1);
}

.confirm-buy-header {
  display: flex;
  padding: 15px 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px solid green;
}

.confirm-buy-header > h1 {
  font-weight: bold;
}

.confirm-buy-header > button {
  border: none;
  outline: none;
  background: none;
  font-size: 2rem;
  font-weight: bold;
  color: red;
}

.confirm-buy-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-list {
  border-bottom: 1.5px solid green;
}
.order-list > h4 {
  font-weight: lighter;
}

.final-price {
  display: flex;
  justify-content: space-between;
  border-bottom: 1.5px solid green;
}

.final-price > h2 {
  font-size: 18pt;
  font-weight: lighter;
  text-align: end;
  color: green;
  padding: 0 10px 0 10px;
}

.confirm-buy-body > input {
  margin: 5px;
  padding: 10px;
  border-bottom: 1.5px solid green;
}

.pay-box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1.5px solid green;
  padding: 10px;
}

.pay-box > label {
  font-size: 16pt;
}

.pay-box > select {
  text-align: center;
}

.confirm-buy-btn {
  padding: 10px;
  font-size: 18pt;
  font-weight: bold;
  color: white;
  background: green;
  border-radius: 0 0 10px 10px;
}

#overlay {
  position: fixed;
  opacity: 0;
  transition: 200ms ease-in-out;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

#overlay.active {
  opacity: 1;
  pointer-events: all;
}
</style>
