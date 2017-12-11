import request from '../utils/request';

export function login(argv) {

  const mutation = `mutation Login($argv: LoginArgv){
    public{
      login(argv: $argv) {
        uid
        username
        token
      }
    }
  }`;

  return request(mutation, { argv })
}

export function register(argv) {
  const mutation = `mutation Register($argv: RegistryArgv){
          public{
            registry(argv: $argv) {
              uid
              username
              token
            }
          }
        }`;
  return request(mutation, { argv })
}
