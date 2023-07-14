#!/bin/sh

mkdir -p ./static/lib/vue/2.6.10
mkdir -p ./static/lib/vue-router/3.1.3
mkdir -p ./static/lib/vuex/3.1.1
mkdir -p ./static/lib/axios/0.19.0
mkdir -p ./static/lib/milligram/1.3.0
mkdir -p ./static/lib/lodash/4.17.21/


wget https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.js -O ./static/lib/vue/2.6.10/vue.js
wget https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3/vue-router.js -O ./static/lib/vue-router/3.1.3/vue-router.js
wget https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.js -O ./static/lib/vuex/3.1.1/vuex.js
wget https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.js -O ./static/lib/axios/0.19.0/axios.js
wget https://cdnjs.cloudflare.com/ajax/libs/milligram/1.3.0/milligram.css -O ./static/lib/milligram/1.3.0/milligram.css
wget https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js -O ./static/lib/lodash/4.17.21/lodash.min.js
