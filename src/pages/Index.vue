<template>
  <q-page>
    <q-carousel animated v-model="slide" height="250px" arrows navigation infinite>
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
    </q-carousel>
    <div>
      <div class="flex flex-center">
        <p class="text-h6 q-mt-md">Shop from PMS</p>
      </div>
      <div class="shop-grid">
        <div v-for="(p, id) in products" :key="id">
          <q-card class="my-card" v-if="p.i > 0">
            <img :src="p.image">
            <q-card-section>
              <div class="text-h6">{{ p.name }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat>Rs {{ p.price }}</q-btn>
              <q-btn flat @click="addToCart(p.id)" >Add to cart</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { app } from 'src/boot/firebase';

export default {
  name: 'PageIndex',
  data() {
    return {
      slide: 1,
      products: [{
        title: 'sdsad',
        price: 21
      },
      {
        title: 'sdsad',
        price: 21
      },
      {
        title: 'sdsad',
        price: 21
      }, {
        title: 'sdsad',
        price: 21
      }],
      cart: []
    }
  },
  methods: {
    addToCart(id){
      console.log(id);
      this.cart.push(id)
      console.log(this.cart);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.$q.notify({
        message: 'Added to cart',
        color: 'black'
      })
    }
  },
  created(){
    app.firestore().collection("inventory").onSnapshot(sn => {
      this.products = []
      sn.docs.forEach(doc =>{
        console.log(doc.data());
        this.products.push({id: doc.id, ...doc.data()}) 
      })
    })
  }
}
</script>
<style>
.shop-grid {
  display: grid;
  gap: 20px;
  padding: 10px;
  grid-template-columns: repeat(1, 1fr);
}
</style>
