const store = new Vuex.Store({
  state: {
    circurits: {
      list: [],
      count: 0,
    },
    currentCircurit: {},
    components: {
      list: [],
      count: 0,
    },
    currentComponent: {},
  },
  mutations: {
    setComponents(state, components) {
      state.components.list = components;
    },
    setCircurits(state, circurits) {
      state.circurits.list = circurits;
    },
    setCurrentCircurit(state, currentCircurit) {
      state.currentCircurit = currentCircurit;
    },
    setCurrentComponent(state, currentComponent) {
      state.currentComponent = currentComponent;
    },
    setComponentCount(state, componentCount) {
      state.components.count = componentCount;
    },
    setCircuritCount(state, circuritCount) {
      state.circurits.count = circuritCount;
    },
  },
  actions: {
    getComponents: async ({ commit }) => {
      const { data } = await axios.post('/graphql', {
        query: `
          query {
            components { _id, name, type }
            countComponents
          }
        `,
      });

      commit('setComponents', data.data.components);
      commit('setComponentCount', data.data.countComponents);
    },
    getCircurits: async ({ commit }, { sort = {} } = {}) => {
      const { data } = await axios.post('/graphql', {
        query: `
          query($sort: SortInput) {
            circurits(sort: $sort) { _id, name, description, hasImage, imageUrl }
            countCircurits
          }
        `,
        variables: {
          sort: {
            field: sort?.field,
            dir: sort?.dir,
          },
        },
      });
      commit('setCircurits', data.data.circurits);
      commit('setCircuritCount', data.data.countCircurits);
    },
    getCircurit: async ({ commit }, { id }) => {
      const { data } = await axios.post('/graphql', {
        query: `query ($circuritId: String!) {
          circurit(id: $circuritId) {
            _id
            name
            description
            imageUrl
            hasImage
            componentIds
            components { _id type name }
          }
        }`,
        variables: {
          circuritId: id,
        },
      });
      commit('setCurrentCircurit', data.data.circurit);
    },
    getComponent: async ({ commit }, { id }) => {
      const { data } = await axios.post('/graphql', {
        query: `query ($componentId: String!) {
          component(id: $componentId) {
            _id
            name
            type
            circurits { _id name }
          }
        }`,
        variables: {
          componentId: id,
        },
      });
      commit('setCurrentComponent', data.data.component);
    },
    createCircurit: async ({ commit }, { circurit }) => {
      const { data } = await axios.post('/graphql', {
        query: `mutation ($circurit: CircuritInput) {
          createCircurit(circurit: $circurit) { _id name description }
        }`,
        variables: {
          circurit: {
            name: circurit.name,
            description: circurit.description,
            componentIds: circurit.componentIds,
          },
        },
      });
    },
    createComponent: async ({ commit }, { component }) => {
      const { data } = await axios.post('/graphql', {
        query: `mutation ($component: ComponentInput) {
          createComponent(component: $component) { _id name type }
        }`,
        variables: {
          component: {
            name: component.name,
            type: component.type,
          },
        },
      });
    },
    updateComponent: async ({ commit }, { _id, component }) => {
      const { data } = await axios.post('/graphql', {
        query: `mutation ($_id: String, $component: ComponentInput!) {
          updateComponent(_id: $_id, component: $component) { _id name type }
        }`,
        variables: {
          _id,
          component: {
            name: component.name,
            type: component.type,
          },
        },
      });
    },
    updateCircurit: async ({ commit }, { _id, circurit }) => {
      const { data } = await axios.post('/graphql', {
        query: `mutation ($_id: String, $circurit: CircuritInput!) {
          updateCircurit(
            _id: $_id,
            circurit: $circurit
          ) { _id name description components { _id name } }
        }`,
        variables: {
          _id,
          circurit: {
            name: circurit.name,
            description: circurit.description,
            componentIds: circurit.componentIds,
          },
        },
      });
    },
  },
});
