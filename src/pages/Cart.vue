<template>
    <div class="q-pa-md">
        <div v-if="products.length > 0">
            <q-list bordered padding class="rounded-borders" style="width: 100%;">
                <q-item-label header>All Items in your cart</q-item-label>

                <q-item clickable v-ripple v-for="(p, id) in products" :key="id">
                    <q-item-section avatar top>
                        <q-avatar color="primary" text-color="white">
                            <img :src="p.image" alt="">
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label lines="1">{{ p.name }}</q-item-label>
                        <q-item-label caption>Price: Rs.<b>{{ p.price }}</b></q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="delete" color="red" @click="deleteP(p.id)" />
                    </q-item-section>
                </q-item>
                <q-separator spaced />
                <div class="text-h6 text-center"><b>Total Price: {{ totalPrice }}</b></div>
            </q-list>
            <div class="q-mt-lg" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                <q-card class="my-card" @click="modal = !modal; o = true">
                    <q-card-section>
                        <div class="text-h6">Pay Online</div>
                        <div class="text-subtitle2">EasyPaisa/JazzCash</div>
                    </q-card-section>
                </q-card>
                <q-card class="my-card" @click="modal = !modal; o = false">
                    <q-card-section>
                        <div class="text-h6">Pay by cash</div>
                        <div class="text-subtitle2">Cash on delivery</div>
                    </q-card-section>
                </q-card>
            </div>
            <q-dialog v-model="modal" persistent>
                <q-card style="width: 100%;">
                    <q-card-section>
                        <q-input v-model="num" type="number" class="q-mb-md" label="Phone Number" />
                        <q-input v-model="name" type="text" label="Your Name" />
                    </q-card-section>
                    <q-card-section>
                            <q-input v-model="add" type="text" label="Address" class="q-mb-md" />
                            <span v-if="!o">Your medicines will be delivered in 3 days by COD method.</span>
                            <span v-else>Your medicines will be delivered in 3 days</span>
                        </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn :loading="loading" flat label="Confirm/Pay" color="primary" @click="orderPlaced" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div v-if="products.length < 1" class="text-center text-h6">
            Nothing to show here!
        </div>
        <div v-if="products.length < 1" class="text-center" @click="$router.push({path: '/'})">Shop Now!</div>
    </div>
</template>

<script>
import { app } from 'src/boot/firebase';
export default {
    data() {
        return {
            o: false,
            num: null,
            name: null,
            add: null,
            modal: false,
            products: [],
            cart: [],
            totalPrice: null,
            loading: false
        }
    },
    methods: {
        deleteP(id){
            this.products = this.products.filter(p => p.id != id)
            this.totalPrice = this.products.reduce((sum, item) => sum + Number(item.price), 0);
            this.cart =  this.cart.filter(cartId => cartId !== id)
            // localStorage.setItem('cart', JSON.stringify(this.cart));
            console.log(this.cart);
        },
        async initializeData() {
            const storedCart = localStorage.getItem('cart');
            console.log(storedCart);

            // If 'cart' exists in local storage, parse and assign it to this.cart
            if (storedCart !== null) {
                // Parse and assign it to this.cart
                this.cart = JSON.parse(storedCart);
                console.log(this.cart);
                // Use Promise.all to wait for all asynchronous operations to complete
                await Promise.all(this.cart.map(async (p) => {
                    const doc = await app.firestore().collection("inventory").doc(p).get();
                    console.log(doc);
                    this.products.push({ id: doc.id, ...doc.data() });
                }));

                console.log(this.products);

                // Calculate the total price after fetching the products
                this.totalPrice = this.products.reduce((sum, item) => sum + Number(item.price), 0);
            }
        },
        orderPlaced(){
            this.loading = true
            console.log(this.products);
            app.firestore().collection("orders").add({
                cart: this.cart,
                products : this.products,
                total_price: this.totalPrice,
                number : this.num,
                address: this.add,
                name: this.name,
                online: this.o
            }).then(() => {
                const updates = {};
                 // Count occurrences of each product ID in the array
                const productCountMap = this.products.reduce((map, p) => {
                    const id = p.id;
                    map[id] = (map[id] || 0) + 1;
                    return map;
                }, {});
                console.log(productCountMap);
                this.products.forEach(p => {
                    const id = p.id;
                    const i = Number(p.i);
                    const s = Number(p.sales);
                    const pr = Number(p.price);
                    const s_i = Number(p.sold_items);
                    const occurrences = productCountMap[id] || 1; // Default to 1 if not found

                    if (!updates[id]) {
                        updates[id] = {
                            i: 0,
                            sales: 0,
                            sold_items: 0,
                        };
                    }

                    updates[id].i = i - occurrences;
                    updates[id].sales = s > 0 ? occurrences * pr + s : occurrences * pr;
                    updates[id].sold_items = s == 0 ? + occurrences : s_i + occurrences;
                });

                // Apply updates to Firestore
                Object.keys(updates).forEach(id => {
                    app.firestore().collection("inventory").doc(id).update(updates[id]);
                });
            }).then(() => {
                setTimeout(() => {
                    this.loading = false
                    this.$q.notify({
                        message: 'Order Placed',
                        color: 'black'
                    })
                    this.modal = false
                    this.cart = []
                    localStorage.setItem('cart', JSON.stringify(this.cart));
                    this.$router.push({path: '/'})
                }, 2500);
            })
        }
    },
    created() {
        this.initializeData();
    },
}
</script>

<style></style>