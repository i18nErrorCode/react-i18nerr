import request from '../utils/request';

export function getRows(id) {
  const queryRows = `query getRows($id: String!){
          public{
            rows(id: $id){
              data{
                id
                tid
                uid
                key
                value_cn
                value_tw
                value_en
              }
            }
          }
       }`;

  return request(queryRows, id);
}

export function haveMember(tid) {
  const queryMembers = `query haveMember($tid: String!) {
        me {
          haveMember(tid:$tid)
        }
      }`;
  return request(queryMembers, tid);
}

export function addRow(argv) {
  const addRow = `mutation createRow($argv: CreateRowArgv) {
            me {
              createRow(argv: $argv) {
                id
                uid
                tid
                key
                value_cn
                value_en
                value_tw
              }
            }
          }`;
  return request(addRow, argv);
}
export function updateRow(argv) {
  const addRow = `mutation updateRow($argv: UpdateRowArgv) {
            me {
              updateRow(argv: $argv) {
                id
                uid
                tid
                key
                value_cn
                value_en
                value_tw
              }
            }
          }`;
  return request(addRow, argv);
}
