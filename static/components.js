const ComponentsPage = Vue.component('components-page', {
  computed: Vuex.mapState({
    components: state => state.components.list,
    componentCount: state => state.components.count,
  }),
  methods: {
    ...Vuex.mapActions([
      'getComponents',
    ]),
  },
  async mounted() {
    await this.getComponents();
  },
  template: `<div>
    <page-header />
    <div>
      Total components: <strong>{{componentCount}}</strong>
    </div>
    <div>
      <component-card v-for="component in components" :key="component._id" :component="component" />
    </div>

    <div>
      <component-create />
    </div>
  </div>`
});

const ComponentPage = Vue.component('component-page', {
  computed: Vuex.mapState({
    currentComponent: state => state.currentComponent,
  }),
  methods: {
    ...Vuex.mapActions([
      'getComponent',
    ]),
  },
  async mounted() {
    await this.getComponent({ id: this.$route.params.id });
  },
  template: `<div>
    <page-header />
    <div v-if="currentComponent._id">
      <h3>{{currentComponent.name}}</h3>
      <div>
        [ <router-link :to="'/components/' + currentComponent._id + '/edit'">Edit</router-link> ]
      </div>

      <component-icon :type="currentComponent.type" />{{currentComponent.type}}

      <div v-if="currentComponent.circurits.length">
        <h4>Used in</h4>

        <ul>
          <li v-for="circurit in currentComponent.circurits" :key="circurit._id">
            <router-link :to="'/circurits/' + circurit._id">{{circurit.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>`
});

const ComponentCard = Vue.component('component-card', {
  props: ['component'],
  template: `<div>
    <component-icon :type="component.type" />
    <router-link :to="'/components/' + component._id">{{component.name}} ({{component.type}})</router-link>
    [ <router-link :to="'/components/' + component._id + '/edit'">Edit</router-link> ]
  </div>`
});

const ComponentCreate = Vue.component('component-create', {
  data: () => ({
    form: {
      name: '',
      type: 'ic',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createComponent',
      'getComponents',
    ]),
    async handleCreate() {
      await this.createComponent({
        component: {
          name: this.form.name,
          type: this.form.type,
        },
      });

      this.form.name = '';
      await this.getComponents();
    },
  },
  template: `
    <div>
      <form @submit.prevent="handleCreate">
        <fieldset>
          <legend>New Component</legend>
          <label>Name</label>
          <input type="text" placeholder="name" v-model="form.name" />
          <label>Type</label>
          <select v-model="form.type">
            <option value="ic">IC</option>
            <option value="bjt_transistor">Transistor</option>
            <option value="mosfet">MOSFET</option>
            <option value="diode">Diode</option>
            <option value="module">Module</option>
            <option value="mcu">MCU</option>
            <option value="special">Special</option>
          </select>
          <input type="submit" value="Create component" />
        </fieldset>
      </form>
    </div>
  `,
});

const ComponentUpdate = Vue.component('component-update', {
  computed: Vuex.mapState({
    currentComponent: state => state.currentComponent,
  }),
  data: () => ({
    form: {
      name: '',
      type: 'ic',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'updateComponent',
      'getComponent',
    ]),
    async handleUpdate() {
      await this.updateComponent({
        _id: this.$route.params.id,
        component: {
          name: this.form.name,
          type: this.form.type,
        },
      });

      router.push(`/components/${this.$route.params.id}`);
    },
  },
  async mounted() {
    await this.getComponent({ id: this.$route.params.id });
    const copied = JSON.parse(JSON.stringify(this.currentComponent));
    this.form.name = copied.name;
    this.form.type = copied.type;
  },
  template: `
    <div>
      <page-header />
      <form @submit.prevent="handleUpdate">
        <fieldset>
          <legend>Update Component</legend>
          <label>Name</label>
          <input type="text" placeholder="name" v-model="form.name" />
          <label>Type</label>
          <select v-model="form.type">
            <option value="ic">IC</option>
            <option value="bjt_transistor">Transistor</option>
            <option value="mosfet">MOSFET</option>
            <option value="diode">Diode</option>
            <option value="module">Module</option>
            <option value="mcu">MCU</option>
            <option value="special">Special</option>
          </select>
          <input type="submit" value="Update Component" />
        </fieldset>
      </form>
    </div>
  `,
});

const ComponentIcon = Vue.component('component-icon', {
  props: ['type'],
  template: `<span>
    <img class="component-image" src="/static/img/transistor.jpg" v-if="type === 'bjt_transistor'" />
    <img class="component-image" src="/static/img/mcu.jpg" v-if="type === 'mcu'" />
    <img class="component-image" src="/static/img/ic.jpg" v-if="type === 'ic'" />
    <img class="component-image" src="/static/img/mosfet.png" v-if="type === 'mosfet'" />
  </span>`
});
