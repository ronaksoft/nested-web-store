/**
 * Type declerations for global development variables
 */

interface Window {
  // A hack for the Redux DevTools Chrome extension.
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
  __INITIAL_STATE__?: any;
  __NESTED_CONFIG__?: any;
  __INITIAL_DATA__?: any;
  locale?: string;
}

interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
}
