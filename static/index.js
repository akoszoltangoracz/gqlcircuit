const PageHeader = Vue.component('page-header', {
  template: `
    <div>
      <router-link to="/circurits"><h1>Circurits</h1></router-link>
      <div>
        [ <router-link to="/circurits">circurits</router-link> ]
        [ <router-link to="/components">components</router-link> ]
      </div>
    </div>
  `
});

const SortBar = Vue.component('sort-bar', {
  props: ['fields'],
  data: () => ({
    form: {
      field: '',
      dir: 'asc'
    },
  }),
  methods: {
    setSort() {
      this.$emit('setSort', this.form);
    },
  },
  mounted() {
    this.form.field = this.fields[0];
  },
  template: `<div>
    <fieldset>
      <legend>Sort</legend>
      <form @submit.prevent="setSort">
        <select v-model="form.field">
          <option v-for="field in fields" :key="field" :value="field">
            {{field}}
          </option>
        </select>

        <select v-model="form.dir">
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>

        <input type="submit" value="Sort" />
      </form>
    </fieldset>
  </div>`
});
