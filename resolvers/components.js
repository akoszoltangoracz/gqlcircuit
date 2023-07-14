const db = require('../db');

module.exports = {
  Query: {
    components: async () => {
      const components = await db.getComponents({});
      return components;
    },
    component: async (parent, { id }) => {
      const component = await db.getComponent(id);
      return component;
    },
    countComponents: () => {
      console.log('gettin component count');
      return db.getComponentCount();
    },
  },
  Component: {
    circurits: async (parent) => {
      return db.getCircuritsByComponentId(parent._id);
    },
  },
  Mutation: {
    createComponent: async (parent, args) => {
      const { component } = args;
      const { insertedId } = await db.createComponent(component);
      const refetched = await db.getComponent(insertedId);
      return refetched;
    },

    updateComponent: async (parent, args) => {
      const { _id, component } = args;
      await db.updateComponent({
        _id,
        ...component,
      });

      const refetched = await db.getComponent(_id);
      return refetched;
    }
  },
};
