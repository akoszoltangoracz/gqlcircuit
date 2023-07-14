const db = require('../db');

module.exports = {
  Query: {
    circurits: async (parent, args) => {
      const { sort = {} } = args;
      const circurits = await db.getCircurits({ sort });
      return circurits;
    },
    circurit: async (parent, { id }) => {
      const circurit = await db.getCircurit(id);
      return circurit;
    },
    countCircurits: () => {
      try {
        return db.getCircuritCount();

      } catch (err) {
        console.log(err);
      }
    },
  },
  Circurit: {
    components: async (parent) => {
      const { componentIds } = parent;
      if (!componentIds?.length) return [];

      return db.getComponents({ componentIds });
    },
    imageUrl: async (parent) => {
      const { _id, hasImage } = parent;

      if (!hasImage) return null;

      return `${process.env.STATIC_HOST}/${String(_id)}.jpg`;
    },
  },
  Mutation: {
    createCircurit: async (parent, args) => {
      const { circurit } = args;
      const { insertedId } = await db.createCircurit(circurit);
      const refetched = await db.getCircurit(insertedId);
      return refetched;
    },

    updateCircurit: async (parent, args) => {
      const { _id, circurit } = args;
      await db.updateCircurit({
        _id,
        ...circurit,
      });

      const refetched = await db.getCircurit(_id);
      return refetched;
    },
  },
};
