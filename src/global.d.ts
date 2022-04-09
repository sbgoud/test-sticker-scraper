declare module "@dibgram/tdweb" {
    import TdClient, { TdError, TdObject, TdOptions } from "tdweb";
    export { TdObject, TdOptions, TdError };
    export default TdClient;
}
