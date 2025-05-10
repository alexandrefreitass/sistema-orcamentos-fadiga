declare module '*.mjs' {
  const value: any;
  export default value;
  export * from value;
}