/*
  feat: strict typing for NodeJS process environment
  Module augmentation was chosen here to extend the native NodeJS ProcessEnv interface, 
  optimizing type safety and strictly avoiding the 'any' type for environment variables.
*/
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      STRIPE_SECRET_KEY: string;
      DATABASE_URL: string;
    }
  }
}
export {};