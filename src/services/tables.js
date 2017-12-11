import request from '../utils/request';

export function getTables(query) {
  const queryTables = `query tables($query: FormQuery!) {
    public {
      tables(query:$query) {
        data {
          id
          uid
          name
          description
          owner {
            username
          }
          member {
            uid
            username
          }
        }
        meta {
          skip
          limit
          count
          page
        }
      }
    }
  }`;

  return request(queryTables, query);
}

export function createTable(argv) {
  const mutation = `mutation createTable($argv: CreateTableArgv) {
            me {
              createTable(argv: $argv) {
                id
                uid
                name
                description
                owner {
                  username
                }
              }
            }
          }`;
  return request(mutation, argv);
}
export function updateTable(argv) {
  const mutation = `mutation updateTable($argv: UpdateTableArgv)) {
            me {
              updateTable(argv: $argv) {
                id
                uid
                name
                description
                owner {
                  username
                }
              }
            }
          }`;
  return request(mutation, argv);
}

export function changeMember(argv) {
  const mutation = `mutation changeMember($argv: ChangeMemberArgv) {
          me {
            changeMember(argv: $argv) 
          }
        }`;
  return request(mutation, argv);
}
