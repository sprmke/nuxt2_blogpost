export default function(context) {
  console.log('[Middleware] Just Auth');
  console.log('context.store.getters.isAuthenticated::', context.store.getters.isAuthenticated);
  
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth');
  }
}