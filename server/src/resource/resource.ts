/**
 * Resource interface
 *  This interface is used to convert a resource to a JSON object. This is useful for
 * serializing the resource to be returned in a response.
 */
export interface Resource<T> {
  toJSON(): T;
}
