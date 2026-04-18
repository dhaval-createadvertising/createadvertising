export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, loading } = useAuth();

  // On the client, we might need to wait for Firebase to initialize its state
  if (import.meta.client && loading.value) {
    // Wait for auth to finish loading
    await new Promise((resolve) => {
      const unwatch = watch(loading, (newVal) => {
        if (!newVal) {
          unwatch();
          resolve(true);
        }
      });
    });
  }

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (user.value && !user.value.emailVerified && to.path !== '/login') {
    return navigateTo('/login');
  }
});
