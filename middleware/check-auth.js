export default function (context) {
  console.log('[Middleware] Check Auth');
  // initialize authentication
  context.store.dispatch('initAuth', context.req);
}