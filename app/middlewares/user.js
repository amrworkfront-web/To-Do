module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      // لو مفيش توكن — روح
      if (!ctx.state.user) {
        return await next();
      }

      const userId = ctx.state.user.id; // user id from authentication provider

      // لو request بـ POST أو PUT — ضيف userId جوه data
      if (["POST", "PUT"].includes(ctx.request.method)) {
        ctx.request.body = ctx.request.body || {};
        ctx.request.body.data = ctx.request.body.data || {};

        ctx.request.body.data.userId = userId;
      }

      await next();
    } catch (err) {
      console.error("User middleware error:", err);
      await next();
    }
  };
};
