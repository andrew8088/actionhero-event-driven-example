export const DEFAULT = {
  routes: config => {
    return {
      post: [
        { path: '/member', action: 'member-post' }
      ],
    };
  }
};
