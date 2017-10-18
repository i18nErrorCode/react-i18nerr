import React, { Component } from "react";

import get from "lodash.get";

import { graphql } from "../lib/graphql";
import { Link } from "react-router-dom";
export default class Home extends Component {
  state = {
    tables: { data: [], meta: {} }
  };
  async componentWillMount() {
    try {
      const data = await graphql(`
        query getTableList {
          me {
            tables(query: { limit: 10 }) {
              data {
                id
                uid
                name
              }
              meta {
                skip
                skip
                limit
                num
                page
              }
            }
          }
        }
      `)();

      this.setState({
        tables: get(data, ["me", "tables"])
      });
    } catch (err) {}
  }
  render() {
    return (
      <div>
        {this.state.tables.data.map(d => {
          return (
            <div key={d.id}>
              <p>name: {d.name}</p>
              <p>author: {d.uid}</p>
              <Link to={`info/${d.id}`}>id: {d.id}</Link>
            </div>
          );
        })}
      </div>
    );
  }
}
