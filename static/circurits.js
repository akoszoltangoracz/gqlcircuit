const CircuritsPage = Vue.component('circurits-page', {
  computed: Vuex.mapState({
    circurits: state => state.circurits.list,
    circuritCount: state => state.circurits.count,
  }),
  methods: {
    ...Vuex.mapActions([
      'getCircurits',
    ]),
    async setSort(e) {
      await this.getCircurits({
        sort: {
          field: e?.field,
          dir: e?.dir,
        }
      });
    },
  },
  async mounted() {
    await this.getCircurits();
  },
  template: `
    <div>
      <page-header />
      <sort-bar :fields="['name', 'description']" @setSort="setSort" />
      <div>
        Total circurits: <strong>{{circuritCount}}</strong>
      </div>
      <div>
        <circurit-card v-for="circurit in circurits" :key="circurit._id" :circurit="circurit" />
      </div>

      <div>
        <circurit-create />
      </div>
    </div>`,
});

const CircuritCard = Vue.component('circurit-card', {
  props: ['circurit'],
  template: `<div class="circurit-card">
    <router-link :to="'/circurits/' + circurit._id"><h3>{{circurit.name}}</h3></router-link>
    [ <router-link :to="'/circurits/' + circurit._id + '/edit'">Edit</router-link> ]
    <div>{{circurit.description}}</div>
  </div>`
});

const CircuritPage = Vue.component('circurit-page', {
  computed: Vuex.mapState({
    currentCircurit: state => state.currentCircurit,
  }),
  methods: {
    ...Vuex.mapActions([
      'getCircurit',
    ]),
  },
  async mounted() {
    await this.getCircurit({ id: this.$route.params.id });
  },
  template: `
  <div>
    <page-header />
    <div v-if="currentCircurit._id">
      <h2>{{currentCircurit.name}}</h2>
      [ <router-link :to="'/circurits/' + currentCircurit._id + '/edit'">Edit</router-link> ]
      <br />

      <pre>{{currentCircurit.description}}</pre>

      <div v-if="currentCircurit.imageUrl">
        <img :src="currentCircurit.imageUrl" />
      </div>
      <h4>Components</h4>
      <component-item v-for="component in currentCircurit.components" :key="component._id" :component="component" />
    </div>
  </div>`
});

const ComponentItem = Vue.component('component-item', {
  props: ['component'],
  template: `<div>
    <component-icon :type="component.type" />
    <router-link :to="'/components/' + component._id">{{component.name}} ({{component.type}})</router-link>
  </div>`
});

const CircuritCreate = Vue.component('circurit-create', {
  computed: Vuex.mapState({
    components: state => state.components.list,
  }),
  data: () => ({
    form: {
      name: '',
      type: 'ic',
      componentIds: [],
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createCircurit',
      'getComponents',
      'getCircurits',
    ]),
    async handleCreate() {
      await this.createCircurit({
        circurit: {
          name: this.form.name,
          description: this.form.description,
          componentIds: this.form.componentIds,
        },
      });

      this.form.name = '';
      this.form.description = '';
      this.form.componentIds = [];

      await this.getCircurits();
    },
  },
  async mounted() {
    await this.getComponents();
  },
  template: `
    <div>
      <form @submit.prevent="handleCreate">
        <fieldset>
          <legend>New Circurit</legend>
          <label>Name</label>
          <input type="text" placeholder="name" v-model="form.name" />
          <label>Description</label>
          <textarea v-model="form.description" />
          <label>Components</label>
          <select multiple v-model="form.componentIds" class="component-select-box">
            <option v-for="component in components" :key="components._id" :value="component._id">
              {{component.name}}
            </option>
          </select>

          <input type="submit" value="Create component" />
        </fieldset>
      </form>
    </div>
  `,
});

const CircuritUpdate = Vue.component('circurit-update', {
  computed: Vuex.mapState({
    components: state => state.components.list,
    currentCircurit: state => state.currentCircurit,
  }),
  data: () => ({
    form: {
      name: '',
      type: 'ic',
      componentIds: [],
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'updateCircurit',
      'getComponents',
      'getCircurit',
    ]),
    async handleUpdate() {
      await this.updateCircurit({
        _id: this.$route.params.id,
        circurit: {
          name: this.form.name,
          description: this.form.description,
          componentIds: this.form.componentIds || [],
        },
      });

      router.push(`/circurits/${this.$route.params.id}`);
    },
    async uploadFile() {
      const { data } = await axios.get(`/uploadUrl/circurit/${this.$route.params.id}`);
      const { sasUrl } = data;

      console.log('upload file');
      const input = document.getElementById('file')
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const reader = new FileReader();
      reader.onload = async e => {
        const requestData = new Uint8Array(e.target.result);
        await axios({
          url: sasUrl,
          data: requestData,
          method: 'PUT',
          headers: {
            "x-ms-blob-type": "BlockBlob",
          },
        });
        console.log('finished upload');

        await axios.get(`/finalizeUrl/circurit/${this.$route.params.id}`);
      };

      reader.readAsArrayBuffer(file);
    },
  },
  async mounted() {
    await this.getComponents();
    await this.getCircurit({ id: this.$route.params.id });
    const copied = JSON.parse(JSON.stringify(this.currentCircurit));
    this.form.name = copied.name;
    this.form.description = copied.description;
    this.form.componentIds = copied.componentIds || [];
  },
  template: `
    <div>
      <page-header />
      <form @submit.prevent="handleUpdate">
        <fieldset>
          <legend>Update Circurit</legend>
          <label>Name</label>
          <input type="text" placeholder="name" v-model="form.name" />
          <label>Description</label>
          <textarea v-model="form.description" />
          <label>Components</label>
          <select multiple v-model="form.componentIds" class="component-select-box">
            <option v-for="component in components" :key="components._id" :value="component._id">
              {{component.name}}
            </option>
          </select>
          
          <div>
            <input type="file" id="file" />
            <button @click.prevent="uploadFile">upload</button>
          </div>

          <input type="submit" value="Update Circurit" />
        </fieldset>
      </form>
    </div>
  `,
});

const routes = [
  { path: '/', redirect: '/circurits' },
  { path: '/circurits', component: CircuritsPage},
  { path: '/circurits/:id', component: CircuritPage},
  { path: '/circurits/:id/edit', component: CircuritUpdate},
  { path: '/components', component: ComponentsPage},
  { path: '/components/:id', component: ComponentPage},
  { path: '/components/:id/edit', component: ComponentUpdate},
];

const router = new VueRouter({
  routes,
});

const app = new Vue({
  el: "#app",
  router,
  store,
  template: `
    <router-view/>
  `
})
